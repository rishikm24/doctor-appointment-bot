const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const moment = require('moment')
dotenv.config({ path: "./config/config.env" });
const socketio = require("socket.io");
const bodyParser = require('body-parser')
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
global.db = require('./config/knex')
const app = express();
const doctorRouter = require('./routers/doctor.router')
const appointmentService = require('./src/apis/appointment/appointment')

const { handleAppointmentResponse } = require("./src/apis/appointment/appointment");
global.webhookFinalResponse = null
const query = require('./src/apis/appointment/appointment.query');
const { insertWaitText } = require("./utils/utils");

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

// can add auth verification
app.use('/api/doctor', doctorRouter)

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server is runnig on ${process.env.NODE_ENV} mode at port ${PORT}`
  )
);

const io = socketio(server);
io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("chat message", async (message) => {
    console.log(message);

    const callapibot = async (projectId = process.env.PROJECT_ID) => {
      try {
        const sessionId = uuid.v4();
        const sessionClient = new dialogflow.SessionsClient({
          // keyFilename: "doctor-reservation-1-222f945afca9.json"
          keyFilename: "./doctor-reservation-1-c59e61f3b450.json"
          // keyFilename: "./newagent-yatx-16301caf1896.json",
        });
        const sessionPath = sessionClient.projectAgentSessionPath(
          projectId,
          sessionId
        );
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: "en-US",
            },
          },
        };
        const responses = await sessionClient.detectIntent(request);
        const intent = responses[0].queryResult.intent.displayName
        const parameters = responses[0].queryResult.parameters.fields

        // move below to webhook.service
        // check if intent list includes intent then add wait a second

        const defaultResponse = responses[0].queryResult.fulfillmentText
        socket.emit('wait ', 'Sure, give me some time')
        const webhookResponseMsg = await appointmentService.handleAppointmentResponse(intent, parameters)
        const result = webhookResponseMsg || defaultResponse;
        socket.emit("bot reply", result);
        console.log(result);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
        } else {
          console.log(`  No intent matched.`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    await callapibot();
  });
});
