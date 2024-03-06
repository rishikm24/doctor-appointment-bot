exports.convertTo12HourTime = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Determine AM or PM based on hours
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    let twelveHourFormat = hours % 12;
    twelveHourFormat = twelveHourFormat ? twelveHourFormat : 12; // Convert 0 to 12

    // Construct the formatted time string
    const formattedTime = `${twelveHourFormat}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${period}`;

    return formattedTime;
}

exports.convertToPostgresTime = (timeString) => {
    // Extract hours, minutes, seconds, and period (AM/PM)
    const [time, period] = timeString.split(' ');
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Convert hours to 24-hour format
    let twentyFourHourFormat = hours % 12;
    twentyFourHourFormat += period.toUpperCase() === 'PM' ? 12 : 0; // Add 12 hours if PM

    // Format the time string for PostgreSQL
    const formattedTime = `${twentyFourHourFormat.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return formattedTime;
}

exports.convertToTimeValue = (isoDateTime) => {
    // Parse ISO 8601 string to get the date and time components
    const dateTime = new Date(isoDateTime);

    // Extract hours, minutes, and seconds
    const hours = dateTime.getUTCHours();
    const minutes = dateTime.getUTCMinutes();
    const seconds = dateTime.getUTCSeconds();

    // Format the time string
    const timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return timeValue;
}