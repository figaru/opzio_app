getStringFromEpoch = function(epochTime, hoursOnly){
    var readableTime = getDateFromEpoch(epochTime);
    var days = Math.floor(readableTime/8.64e7);
    var hours = (days*24) + readableTime.getUTCHours();

    if(hoursOnly){
        if(days > 0 || readableTime.getUTCHours() !== 0){
            var stringTime = hours+"h";
        }
        else{
            var stringTime = readableTime.getMinutes()+"m "+readableTime.getSeconds()+"s";
        }
    }
    else{
        if(days > 0){
            var stringTime = hours+"h";
        }
        else if(readableTime.getUTCHours() !== 0){
            var stringTime = hours+"h "+readableTime.getMinutes()+"m";
        }
        else{
            var stringTime = readableTime.getMinutes()+"m "+readableTime.getSeconds()+"s";
        }
    }

    return stringTime;

};