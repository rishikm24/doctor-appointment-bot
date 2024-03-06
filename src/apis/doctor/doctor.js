const query = require('./doctor.query')

class DoctorService {
    static async addTimeSlot(slotData) {
        try {
            // add validation for existing slots
            await query.addTimeSlot(slotData)
        } catch (err) {
            throw err
        }
    }

    static async removeTimeSlot(slotId) {
        try {
            // check if data exists for slot id
            // remove appointments for this time slot
            const slotData = await query.getSlotDetails(slotId)
            if (!slotData || !slotData.length) {
                throw new Error({ success: false, msg: 'No slot found' })
            }
            await query.inactivateSlot(slotId)
        } catch (err) {
            throw err
        }
    }
}

module.exports = DoctorService