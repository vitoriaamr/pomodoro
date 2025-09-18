const { ipcRenderer } = require('electron');

let timerInterval;
let isRunning = false;
let timeLeft = 25 * 60;

function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;

    
      new Notification('Pomodoro', {
        body: 'Tempo encerrado! Faça uma pausa.'
      });

      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();

  // Controles da janela
  const minimizeBtn = document.getElementById('minimize-btn');
  const maximizeBtn = document.getElementById('maximize-btn');
  const closeBtn = document.getElementById('close-btn');

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      ipcRenderer.send('minimize-app');
    });
  }

  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', () => {
      ipcRenderer.send('maximize-restore-app');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      ipcRenderer.send('close-app');
    });
  }

 
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (startBtn) {
    startBtn.addEventListener('click', startTimer);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseTimer);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }
});
