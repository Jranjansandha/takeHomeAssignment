const fs = require('fs');

let Data = fs.readFileSync('heartrate.json');
let heartRate= JSON.parse(Data);

function getDate(timeStamp){
    let date= new Date(timeStamp);
    let year= date.getFullYear();
    let month= String(date.getMonth()+1).padStart(2,'0');
    let day= String(date.getDay()+1).padStart(2,'0');

    return `${year}-${month}-${day}`;
}
let statistics ={};
for(let i=0;i<heartRate.length;i++){
    let measurement= heartRate[i];
    let date = getDate(measurement.timestamps.startTime);

    if(!statistics[date]){
        statistics[date]={
            min:measurement.beatsPerMinute,
            max:measurement.beatsPerMinute,
            sum:measurement.beatsPerMinute,
            count:1,
            latestDateTimeStamp:measurement.timestamps.endTime
        }
    }
    else{
        let stat = statistics[date];
        stat.min= Math.min(stat.min,measurement.beatsPerMinute);
        stat.max= Math.max(stat.max,measurement.beatsPerMinute);
        stat.sum+=measurement.beatsPerMinute;
        stat.count++;
        stat.latestDateTimeStamp= measurement.timestamps.endTime;
    }
}

for(const date in statistics){
    const stat= statistics[date];
    stat.median= Math.round(stat.sum/stat.count);
    delete stat.sum;
    delete stat.count;
}

let output=[];
for(const date in statistics){
    let stat = statistics[date];
    output.push({
        date:date,
        min:stat.min,
        max:stat.max,
        median:stat.median,
        latestDateTimeStamp:stat.latestDateTimeStamp,
    })
}

fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Output has been written to output.json');
