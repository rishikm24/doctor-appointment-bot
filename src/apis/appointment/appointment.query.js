const { SLOT_STATUS } = require("../../../config/constants");

class AppointmentQuery {
    static getAvailableDateSlots(date) {
        return db.from('doctor_slots').where('slot_date', date)
    }

    static upsertPatientData(name, number) {
        let upsertQuery = 'INSERT INTO public.patients ' +
            '("name", mobile, created_at, updated_at) ' +
            'VALUES(name, number, new Date(), new Date()) ' +
            'ON CONFLICT(mobile) DO UPDATE SET ' +
            'name = EXCLUDED.name, mobile = EXCLUDED.mobile,' +
            'updated_at = now() returning *';

        return trx.raw(upsertQuery)
    }

    static bookAppointment(trx, patientId, time, date) {
        return trx.from('doctor_slots')
            .where('slot_date', date)
            .where('start_time', time)
            .update({
                status: SLOT_STATUS.BOOKED
            })
            .returning('id');
    }
}

module.exports = AppointmentQuery