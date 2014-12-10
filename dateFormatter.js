Date.prototype.toArray = function(){
    return [this.getFullYear(),
        (this.getMonth()+1),
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds()];
};

var date = {
    toArray : { until : { day : function(date){return _.first(date.toArray(),3);}}}
  
};

var date_array = {
        inc_day :  function (dateArray){
        var dateToInc = new Date(dateArray.join("/"));
        dateToInc.addDays(1);
        return date.toArray.until.day(dateToInc);
    }  
};

function jodaDateParser(dateString){
    if(_.isDate(dateString)){return dateString;}
    var dateMatch = /(\d{2,4})/g;
    var match = (dateString).match(dateMatch);
    var year = match[0];
    var month = Number(match[1])-1;
    var day = match[2];
    var hour = match[3];
    var minute = match[4];
    var second = match[5];
    
    if(dateString.toLowerCase().indexOf('z')>=0) {
        // ISO format
        return new Date(Date.UTC(year,month,day,hour,minute,second));
    } else {
        // JODA format (normal)
        return new Date(year,month,day,hour,minute,second);
    }
    
}
function dateFormatter(date){
    return date.toString("yyyy-MM-dd HH:mm:ss");
}
function datePartFormatter(date){
    return date.toString("yyyy-MM-dd");
}
function timePartFormatter(date){
    return date.toString("HH:mm:ss");
}

function jodaDateFormatter(dateString){
    return dateFormatter(jodaDateParser(dateString));
}
function jodaDatePartFormatter(dateString){
    return datePartFormatter(jodaDateParser(dateString));
}
function jodaTimePartFormatter(dateString){
    return timePartFormatter(jodaDateParser(dateString));
}

function getDateObjFromStr(dateString) {
    // this is for IE7 usually using for sort
    //dateString ; 2012-02-16T21:56:50.956Z
    var list = dateString.replace(/[-T:Z.]/g," ").split(" ");
    var date = new Date();
    date.setYear(Number(list[0]));
    date.setMonth(Number(list[1])-1);
    date.setDate(Number(list[2]));
    date.setHours(Number(list[3]));
    date.setMinutes(Number(list[4]));
    date.setSeconds(Number(list[5]));
    if(_.isNotEmpty(list[6])) {date.setMilliseconds(Number(list[6]));}
    date.setTimezone("GMT");
    
    return date;
}


function getDateObjectFromTimeOnlyPart(default_date, timeString) {
    if(_.isUndefined(timeString) || timeString == "") {
        return "";
    }

    var time = new Date(default_date);
    var hhmm = undefined;
    var ampm = undefined;
    if(_.str.contains(timeString.toLowerCase(), "m")) {
        // am/pm format ex) 04:00 am
        var timeStringArray = timeString.split(" ");
        hhmm = (timeStringArray[0]).split(':'); 
        ampm = timeStringArray[1].toLowerCase();
        if(ampm == "am" && hhmm[0]=="12") {
            hhmm[0] = "00";
        }
    } else {
        hhmm = timeString.split(':');    
    }
    
    time.setHours(Number(hhmm[0]) + ((!_.isUndefined(ampm) && ampm == "pm" && Number(hhmm[0])!=12)?12:0));
    time.setMinutes(Number(hhmm[1]));
    time.setSeconds(0);
    return time;
}

function getAMPMFormatTimeFromString(strTime) {
    // ex) 13:00
    if(_.isUndefined(strTime) || strTime == "") {
        return strTime;
    }

    if(_.str.contains(strTime.toLowerCase(), "m")) {
        return strTime;
    } else {
        var hhmm = strTime.split(":");
        var now = new Date();
        now.setHours(Number(hhmm[0]));
        now.setMinutes(Number(hhmm[1]));
        return now.toString("hh:mm tt").toUpperCase();
    }
}

function getElaspedTimeInDays(d1, d2) {
    var t1 = d1.getTime();
    var t2 = d2.getTime();

    var diff = t2 - t1;
    if(diff<0)
        diff = diff*(-1);

    return parseInt(diff/(24*3600*1000));
}

