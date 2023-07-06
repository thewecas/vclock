//timer object
const timer = {
  title: "",
  totalSeconds: 0,
  remSeconds: 0,
  runFlag: false,
};

//display timer element
const timer__displayTitle = document.querySelector("#timer__displayTitle");
const timer__clock = document.querySelector("#timer__clock");

//buttons elememt
const timer__startBtn = document.querySelector("#timer__startBtn");
const timer__stopBtn = document.querySelector("#timer__stopBtn");
const timer__resetBtn = document.querySelector("#timer__resetBtn");
const timer__editTimerBtn = document.querySelector("#timer__editTimerBtn");
const timer__dialogCloseBtn = document.querySelector("#timer__dialogCloseBtn");

//dialog element
const timer__dialog = document.querySelector("#timer__dialog");

//form element
const timer__inputForm = document.querySelector("#timer__inputForm");
const timer__inputHH = document.querySelector("#timer__inputHH");
const timer__inputMM = document.querySelector("#timer__inputMM");
const timer__inputSS = document.querySelector("#timer__inputSS");
const timer__inputTitle = document.querySelector("#timer__inputTitle");

//alert audio
const timer__alert = document.querySelector("#timer__alert");

//format the output
const timer__formatOutput = (totalSeconds) => {
  const HH = Math.floor(totalSeconds / 3600);
  const MM = Math.floor((totalSeconds % 3600) / 60);
  const SS = Math.floor(totalSeconds % 60);

  const formattedHH = String(HH).padStart(2, "0");
  const formattedMM = String(MM).padStart(2, "0");
  const formattedSS = String(SS).padStart(2, "0");
  return `${formattedHH}:${formattedMM}:${formattedSS}`;
};

//set title
const timer__setTitle = (title) => {
  timer__displayTitle.innerText = title ? title : "---";
};

//set time
const timer__setTime = (seconds) => {
  timer__clock.innerText = timer__formatOutput(seconds);
  timer__storeTimer();
};

//start the timer
let timer__interval;
let timer__timeout;
const timer__startTimer = () => {
  if (timer.remSeconds <= 0) timer__initTimer();
  else {
    let timeout = timer.remSeconds;
    timer__startBtn.disabled = true;
    timer__stopBtn.disabled = false;

    timer__interval = setInterval(() => {
      timer.runFlag = true;
      timer.remSeconds -= 1;
      timer__setTime(timer.remSeconds);
    }, 1000);

    timer__timeout = setTimeout(() => {
      console.log("timeout");
      timer__initTimer();
      timer__setTime(0);
      timer__alert.play();
    }, timeout * 1000);
  }
};
timer__startBtn.addEventListener("click", timer__startTimer);

const timer__initTimer = () => {
  clearInterval(timer__interval);
  clearTimeout(timer__timeout);
  timer.runFlag = false;

  timer__startBtn.disabled = true;
  timer__stopBtn.disabled = false;
};

//stop timer
const timer__stopTimer = () => {
  timer__initTimer();
  timer.runFlag = false;
  timer__startBtn.disabled = false;
  timer__stopBtn.disabled = true;
  if (timer.remSeconds == 0) {
    timer__alert.pause();
    timer__startBtn.disabled = true;
    timer.runFlag = false;
  }
  timer__setTime(timer.remSeconds);
};
timer__stopBtn.addEventListener("click", timer__stopTimer);

//reset timer
const timer__resetTimer = () => {
  timer__initTimer();
  timer.remSeconds = timer.totalSeconds;
  timer.runFlag = false;
  timer__startBtn.disabled = false;
  timer__stopBtn.disabled = true;
  timer__setTime(timer.totalSeconds);
};
timer__resetBtn.addEventListener("click", timer__resetTimer);

//open the dialog
const timer__openDialog = () => timer__dialog.showModal();
timer__editTimerBtn.addEventListener("click", timer__openDialog);

//close the dialog
const timer__closeDialog = () => timer__dialog.close();
timer__dialogCloseBtn.addEventListener("click", timer__closeDialog);

//get form input
const timer__getFormInput = (event) => {
  event.preventDefault();

  const HH = Number(timer__inputHH.value);
  const MM = Number(timer__inputMM.value);
  const SS = Number(timer__inputSS.value);

  //calculate totalseconds
  const totalSeconds = HH * 3600 + MM * 60 + SS;

  //store in a local vaiable
  timer.totalSeconds = totalSeconds;
  timer.title = timer__inputTitle.value;
  timer.remSeconds = totalSeconds;
  //store the timer
  timer__storeTimer();

  //display & start timer
  timer__resetTimer();
  timer__setTitle(timer.title);
  timer__setTime(timer.totalSeconds);
  timer__startTimer();

  //close dialog
  timer__closeDialog();
};

const timer__storeTimer = () => {
  localStorage.setItem("timer", JSON.stringify(timer));
};

//get previous timer from local storage
const timer__reloadTimer = () => {
  const localTimer = JSON.parse(localStorage.getItem("timer"));
  Object.assign(timer, localTimer);
  console.log(timer);
  if (timer.runFlag) {
    timer__startTimer();
  } else {
    timer__startBtn.disabled = false;
    timer__stopBtn.disabled = true;
    if (timer.remSeconds == 0) {
      timer__resetTimer();
      timer__startBtn.disabled = true;
    }
  }
};

//initalization
(function init() {
  timer__reloadTimer();
  timer__setTitle(timer.title);
  timer__setTime(timer.remSeconds);
})();
