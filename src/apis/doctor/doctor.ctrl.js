const { request, response } = require('express')
const http = require('http-status-codes')
const service = require('./doctor')

class DoctorController {
    static async addSlots(req = request, res = response) {
        try {
            const slotData = req.body.slot_details
            if (!slotData) {
                return res.status(http.StatusCodes.BAD_REQUEST).send({
                    success: false, msg: "Slot data missing"
                })
            }
            await service.addTimeSlot(slotData)
            return res.status(http.StatusCodes.OK).send({ success: true, msg: 'Slot added successfully' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in adding time slot'
            return res.status(http.StatusCodes.BAD_GATEWAY).send({ success: false, msg })
        }
    }

    static async removeSlot(req = request, res = response) {
        try {
            const slotId = req.params.id
            if (!slotId || isNaN(slotId)) {
                return res.status(http.StatusCodes.BAD_REQUEST).send({
                    success: false, msg: "Slot id required"
                })
            }
            await service.removeTimeSlot(slotId)
            return res.status(http.StatusCodes.OK).send({ success: true, msg: 'Slot removed' })
        } catch (err) {
            console.log(err)
            const msg = err.msg || err.message || 'Error in removing time slot'
            return res.status(http.StatusCodes.BAD_GATEWAY).send({ success: false, msg })
        }
    }
}

module.exports = DoctorController