var minutes = 25;
var seconds = "00";
let secs = 0;
let totalsecs = 1500;
let distractCounter = 0;

function template(){
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    document.getElementById("distraction-btn").innerHTML = "Distraction : " + distractCounter;
    document.getElementById("title_timer").innerHTML = "25:00" + "- Time To Work!"
}

function start(){
    minutes = 24;
    seconds = 59;

    secs = secs + 1;
    perc = 100-(((totalsecs - secs)/totalsecs)*100);
    setProgress(perc);

    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    var minutes_interval = setInterval(minutesTimer, 60000);
    var seconds_interval = setInterval(secondsTimer, 1000);

    function minutesTimer(){
        minutes = minutes -1;
        if(minutes<10){
            document.getElementById("minutes").innerHTML = "0"+minutes;
        }
        else{
            document.getElementById("minutes").innerHTML = minutes;
        }
    }

    function secondsTimer(){
        secs = secs + 1;
        perc = 100-(((totalsecs - secs)/totalsecs)*100);
        setProgress(perc);
        seconds = seconds -1;
        if(seconds < 10){
            document.getElementById("seconds").innerHTML = "0"+seconds;
            document.getElementById("title_timer").innerHTML = minutes + ":0" + seconds + "- Time To Work!";
            if(seconds == 0){
                if(minutes == 0){
                    clearInterval(minutes_interval);
                    clearInterval(seconds_interval);
                }
                seconds = 60;
            }
        }
        else{
            document.getElementById("seconds").innerHTML = seconds;
            document.getElementById("title_timer").innerHTML = minutes + ":" + seconds + "- Time To Work!";
        }
        
    } 
}

function distractionCount(){
    distractCounter = distractCounter + 1;
    document.getElementById("distraction-btn").innerHTML = "Distraction : " + distractCounter;
}
