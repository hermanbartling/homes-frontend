import moment from 'moment'

export const swedishDays = {
    1: 'Måndag',
    2: 'Tisdag',
    3: 'Onsdag',
    4: 'Torsdag',
    5: 'Fredag',
    6: 'Lördag',
    0: 'Söndag'
};

export function getWeekdayFromDateTimeString(dateString) {
    const date = new Date(dateString);
    return swedishDays[date.getDay()]
}

export function getWeekNumberFromDateTimeString(dateTime) {
    return moment(dateTime).isoWeek();
}

export function rollDateTimeForwardWeeks(dateTime, numberOfWeeks) {
    return moment(dateTime).add(numberOfWeeks, 'week').toDate();
}

export function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

export function getDateTimeString(dateString) {
    const date = moment(dateString);
    return date.format("YYYY-MM-DD HH:mm");
}

export function forwardDateToWeekDayAndTime(dateToForward, weekDay, hour) {
    var updatedStartDate;

    if (dateToForward.getDay() > 0 && dateToForward.getDay() <= weekDay) {
        updatedStartDate = moment(dateToForward)
            .isoWeekday(weekDay)
            .hour(hour)
            .minute(0)
            .second(0)
            .millisecond(0);
    } else {
        updatedStartDate = moment(dateToForward)
            .add(1, 'week')
            .isoWeekday(weekDay)
            .hour(hour)
            .minute(0)
            .second(0)
            .millisecond(0);
    }

    return updatedStartDate.toDate();
}

export default forwardDateToWeekDayAndTime;
