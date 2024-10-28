export function unixDateToIta(unixDate) {
    const milliseconds = unixDate * 1000;
    const dateObject = new Date(milliseconds)
    return dateObject.toLocaleString("it-IT", { day: "numeric", month: "numeric", year: "numeric" });
}

export function utcDateToUnix(utcDate) {
    //Datetime standard - inpurt html datetime-local
    return utcDate.getTime() / 1000;
}