let startTime = null;
let elapsedBefore = 0;
let rafId = null;
let running = false;
const laps = [];

const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsEl = document.getElementById('laps');

function formatTime(ms) {
  const totalMs = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(milliseconds).padStart(3,'0')}`;
}

function update() {
  const now = performance.now();
  const elapsed = elapsedBefore + (now - startTime);
  timeEl.textContent = formatTime(elapsed);
  rafId = requestAnimationFrame(update);
}

function startStopwatch() {
  if (running) return;
  running = true;
  startTime = performance.now();
  rafId = requestAnimationFrame(update);
  startBtn.textContent = 'Pause';
  lapBtn.disabled = false;
  resetBtn.disabled = false;
}

function pauseStopwatch() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  elapsedBefore += performance.now() - startTime;
  startBtn.textContent = 'Start';
}

function resetStopwatch() {
  cancelAnimationFrame(rafId);
  running = false;
  startTime = null;
  elapsedBefore = 0;
  laps.length = 0;
  timeEl.textContent = '00:00.000';
  startBtn.textContent = 'Start';
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  renderLaps();
}

function lapStopwatch() {
  const nowElapsed = running ? elapsedBefore + (performance.now() - startTime) : elapsedBefore;
  const lastTotal = laps.length ? laps[laps.length - 1].total : 0;
  const lapTime = nowElapsed - lastTotal;
  laps.push({ total: nowElapsed, lap: lapTime });
  renderLaps();
}

function renderLaps() {
  lapsEl.innerHTML = '';
  for (let i = laps.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `<span>Lap ${i + 1}</span><span>${formatTime(Math.floor(laps[i].lap))} <small>(${formatTime(Math.floor(laps[i].total))})</small></span>`;
    lapsEl.appendChild(li);
  }
}

startBtn.addEventListener('click', () => {
  if (running) pauseStopwatch(); else startStopwatch();
});
lapBtn.addEventListener('click', lapStopwatch);
resetBtn.addEventListener('click', resetStopwatch);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); startBtn.click(); }
  if (e.key.toLowerCase() === 'l') lapBtn.click();
  if (e.key.toLowerCase() === 'r') resetBtn.click();
});
