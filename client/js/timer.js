let time = 600;

const timer = document.getElementById("timer");

setInterval(()=>{

let min = Math.floor(time/60);

let sec = time%60;

timer.innerHTML =
`${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

time--;

if(time<0){

alert("Time Up!");

window.location.href="result.html";

}

},1000);