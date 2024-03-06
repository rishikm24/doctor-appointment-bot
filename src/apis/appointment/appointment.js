const query = require('./appointment.query')
const { INTENTS } = require('../../../config/constants')
const moment = require('moment')
const { convertTo12HourTime, insertWaitText, convertToPostgresTime, convertToTimeValue } = require('../../../utils/utils')
class AppointmentService {
    static async handleAppointmentResponse(intent, parameters) {
        try {
            let webhookResponseMsg = ''
            let date = parameters?.date.stringValue
            date = date ? moment(new Date(date)).format('YYYY-MM-DD') : null
            let time = parameters?.time.stringValue ? parameters.time.stringValue.length > 10 ? parameters?.time.stringValue.split('T')[1].split('+')[0] : convertToPostgresTime(parameters.time.stringValue) : null
            const name = parameters?.patient_name.stringValue
            const patient_number = parameters.patient_number.stringValue ? Number(parameters.patient_number.stringValue) : 0
            if (intent == 'Appointment.set') {
                const askTime = parameters.date.stringValue && !parameters.time.stringValue
                if (askTime) {
                    const formattedDate = moment(new Date(parameters.date.stringValue)).format('YYYY-MM-DD')
                    let availableSlots = await query.getAvailableDateSlots(formattedDate)
                    if (!availableSlots.length) {
                        return 'No slots available for this day'
                    } else {
                        let convertedTimings = []
                        for (let slot of availableSlots) {
                            convertedTimings.push(convertTo12HourTime(slot.start_time))
                        }
                        return `The available slots are: ${JSON.stringify(convertedTimings.toString())}. Choose your slot`
                    }
                }
                if (patient_number && name && time && date) {
                    let slotId
                    await db.transaction(async function (trx) {
                        let patientId = await query.upsertPatientData(trx, name, patient_number)
                        slotId = await query.bookAppointment(trx, patientId, time, date)
                    }).then(() => {
                        if (slotId.id) {
                            return `Your appointment is confirmed for ${moment(date).format('DD-MM-YYYY')} at ${time}`
                        }
                    }).catch(() => {
                        return 'There was some issue in booking your appointment. Please try again later'
                    })
                }
            } else if (intent == 'Appointment.cancel') {
                const askTime = parameters.date.stringValue && !parameters.time.stringValue
                if (askTime) {
                    const formattedDate = moment(new Date(parameters.date.stringValue)).format('YYYY-MM-DD')
                    let availableSlots = await query.getAvailableDateSlots(formattedDate)
                    if (!availableSlots.length) {
                        return 'No slots available for this day'
                    } else {
                        let convertedTimings = []
                        for (let slot of availableSlots) {
                            convertedTimings.push(convertTo12HourTime(slot.start_time))
                        }
                        return `The available slots are: ${JSON.stringify(convertedTimings.toString())}`
                    }
                }
                if (patient_number && name && time && date) {
                    let slotId
                    await db.transaction(async function (trx) {
                        let patientId = await query.upsertPatientData(trx, name, patient_number)
                        slotId = await query.bookAppointment(trx, patientId, time, date)
                    }).then(() => {
                        if (slotId.id) {
                            return `Your appointment is confirmed for ${moment(date).format('DD-MM-YYYY')} at ${time}`
                        }
                    })
                }
            } else {
                // 
            }
            return webhookResponseMsg
        } catch (err) {
            throw err
        }
    }
}

module.exports = AppointmentService