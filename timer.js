//display timer element
const timer__displayTitle = document.querySelector("#timer__displayTitle");
const timer__clock = document.querySelector("#timer__clock");

//buttons elememt
const timer__actionBtn = document.querySelector("#timer__actionBtn");
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

//start the timer
let timer__interval;
let timer__timeout;
let timer__remainingSeconds;
let restartFlag = true;
const timer__startTimer = () => {
  timer__remainingSeconds = restartFlag
    ? timer.totalSeconds
    : timer__remainingSeconds;
  timer__setAction(false);

  timer__interval = setInterval(() => {
    timer__remainingSeconds -= 1;
    timer__setTime(timer__remainingSeconds);
  }, 1000);

  timer__timeout = setTimeout(timer__stopTimer, timer.totalSeconds * 1000);
};

//stop timer
const timer__stopTimer = () => {
  clearInterval(timer__interval);
  clearTimeout(timer__timeout);
  timer__setTime(timer__remainingSeconds);
  restartFlag = false;
  timer__setAction(true);
};

//reset timer
const timer__resetTimer = () => {
  clearInterval(timer__interval);
  clearTimeout(timer__timeout);
  timer__setTime();
  restartFlag = true;
  timer__setAction(true);
};
timer__resetBtn.addEventListener("click", timer__resetTimer);

//set title
const timer__setTitle = () => {
  timer__displayTitle.innerText = timer.title;
};

//set time
const timer__setTime = (seconds) => {
  timer__clock.innerText = timer__formatOutput(
    seconds ? seconds : timer.totalSeconds
  );
};

//set Action
const timer__setAction = (action) => {
  timer__actionBtn.innerText = action ? "Start" : "Stop";
};

//perform action : start or stop the timer
const timer__performAction = () => {
  if (timer__actionBtn.innerText == "Stop") timer__stopTimer();
  else timer__startTimer();
};
timer__actionBtn.addEventListener("click", timer__performAction);

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
  //store the timer
  timer__storeTimer();

  //display & start timer
  timer__resetTimer();
  timer__setTitle();
  timer__setTime();
  timer__startTimer();

  //close dialog
  timer__closeDialog();
};

//store for future use
const timer = { totalSeconds: 0, title: "" };

const timer__storeTimer = () => {
  localStorage.setItem("timer", JSON.stringify(timer));
};

//get previous timer from local storage
const timer__reloadTimer = () => {
  const localTimer = JSON.parse(localStorage.getItem("timer"));
  Object.assign(timer, localTimer);
};

//initalization
(function init() {
  timer__reloadTimer();
  timer__setTitle();
  timer__setTime();
  timer__setAction(true);
})();
