class DoctorQuery {
    static addTimeSlot(slotData) {
        return db.from('doctor_slots').insert(slotData)
    }

    static getSlotDetails(slotId) {
        return db.from('doctor_slots')
            .where('id', slotId)
    }

    static inactivateSlot(slotId) {
        return db.from('doctor_slots')
            .where('id', slotId)
            .update({ 'is_active': false })
    }
}

module.exports = DoctorQuery