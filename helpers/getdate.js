const getdate = (add = null) => {
    // get current date
    let date_time = new Date();

    if(add !== null) {
        date_time.setDate(date_time.getDate() + add);
    }
    
    date_time.toLocaleString('en-US', {
        timeZone: 'Asia/Manila'
    });

    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = ("0" + date_time.getMinutes()).slice(-2);

    // get current seconds
    let seconds = ("0" + date_time.getSeconds()).slice(-2);

    const generateddate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return generateddate;
}


module.exports = getdate;