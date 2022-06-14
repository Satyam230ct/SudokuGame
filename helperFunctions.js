//----------------Helper Functions----------------
const id= (id) => document.getElementById(id);
const qs= (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

//-----------Convers seconds into string MM:SS format
function timeConversion(time){
    let minutes = Math.floor(time/60);
    if(minutes<10)minutes='0'+minutes;
    let sec = time%60;
    if(sec<10)sec='0'+sec;
    return (minutes+':'+sec);
}

function startTimer(){
    // Sets Time remaining based on input
    if(id('time-1').checked)timeRemaining=180;
    else if(id('time-2').checked)timeRemaining=300;
    else timeRemaining = 600;

    // Sets timer for first second
    id('timer').textContent = timeConversion(timeRemaining);
    
    // Sets timer to update every second
    timer = setInterval(function (){
        timeRemaining--;
        // If no time remaininf end the game
        if(timeRemaining==0)endGame();
        id('timer').textContent = timeConversion(timeRemaining);
    },1000);
}
