// Get references to DOM elements
const timeDisplay = document.getElementById('time-display');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapList = document.getElementById('lap-list');
const countdownInput = document.getElementById('countdown-input');
const startCountdownBtn = document.getElementById('start-countdown-btn');
const stopCountdownBtn = document.getElementById('stop-countdown-btn');
const statusMessage = document.getElementById('status-message');

let startTime = 0;
let elapsedTime = 0;
let lapTimes = [];
let isRunning = false;
let timerInterval;
let countdownTime = 0;
let countdownInterval;
let isCountdownRunning = false;

// Format seconds to HH:MM:SS
function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

// Update the stopwatch display time
function updateTimeDisplay() {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(Math.floor(elapsedTime / 1000));
}

// Show status messages
function showStatusMessage(message) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Toggle between start and stop for the stopwatch
function toggleStopwatch() {
    if (isCountdownRunning) {
        showStatusMessage('Countdown running. Stop countdown first.');
        return;
    }

    if (isRunning) {
        clearInterval(timerInterval);
        startStopBtn.textContent = 'Start';
        showStatusMessage('Stopwatch stopped');
    } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimeDisplay, 1000);
        startStopBtn.textContent = 'Stop';
        showStatusMessage('Stopwatch running');
    }
    isRunning = !isRunning;
}

// Reset the stopwatch
function resetStopwatch() {
    if (isCountdownRunning) {
        showStatusMessage('Countdown running. Stop countdown first.');
        return;
    }

    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lapTimes = [];
    timeDisplay.textContent = formatTime(0);
    lapList.innerHTML = '';
    startStopBtn.textContent = 'Start';
    showStatusMessage('Stopwatch reset');
}

// Record a lap
function recordLap() {
    if (!isRunning || isCountdownRunning) {
        return;
    }
    let lapTime = elapsedTime;
    lapTimes.push(lapTime);
    renderLapList();
}

// Render lap times in the list
function renderLapList() {
    lapList.innerHTML = '';
    lapTimes.forEach((lapTime, index) => {
        let lapItem = document.createElement('li');
        lapItem.classList.add('lap-time');
        lapItem.innerHTML = `Lap ${index + 1}: ${formatTime(Math.floor(lapTime / 1000))} 
                             <button onclick="deleteLap(${index})">Delete</button>`;
        lapList.appendChild(lapItem);
    });
}

// Delete a lap from the list
function deleteLap(index) {
    lapTimes.splice(index, 1);
    renderLapList();
}

// Start the countdown timer
function startCountdown() {
    if (isRunning) {
        showStatusMessage('Stopwatch running. Stop stopwatch first.');
        return;
    }

    countdownTime = parseInt(countdownInput.value);
    if (isNaN(countdownTime) || countdownTime <= 0) {
        showStatusMessage('Please enter a valid countdown time.');
        return;
    }

    timeDisplay.textContent = formatTime(countdownTime);
    isCountdownRunning = true;
    disableStopwatchControls(true);
    showStatusMessage('Countdown in progress');

    countdownInterval = setInterval(function () {
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            showStatusMessage('Countdown finished!');
            isCountdownRunning = false;
            disableStopwatchControls(false);
        }
        timeDisplay.textContent = formatTime(countdownTime);
        countdownTime--;
    }, 1000);
}

// Stop the countdown timer
function stopCountdown() {
    clearInterval(countdownInterval);
    isCountdownRunning = false;
    timeDisplay.textContent = '00:00:00';
    disableStopwatchControls(false);
    showStatusMessage('Countdown stopped');
}

// Enable or disable stopwatch controls
function disableStopwatchControls(disable) {
    startStopBtn.disabled = disable;
    resetBtn.disabled = disable;
    lapBtn.disabled = disable;
    countdownInput.disabled = disable;
    startCountdownBtn.disabled = disable;
    stopCountdownBtn.disabled = !disable;
}

// Event listeners for buttons
startStopBtn.addEventListener('click', toggleStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
startCountdownBtn.addEventListener('click', startCountdown);
stopCountdownBtn.addEventListener('click', stopCountdown);

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // Spacebar to start/stop
        toggleStopwatch();
    } else if (event.key === 'r') { // "r" to reset
        resetStopwatch();
    } else if (event.key === 'l') { // "l" to record a lap
        recordLap();
    }
});
