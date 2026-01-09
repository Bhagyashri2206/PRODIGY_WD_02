let timer = null;
let startTime = 0;
let elapsedTime = 0;
let running = false;
let lapCount = 0;
let lapTimes = [];

const display = document.getElementById("display");
const laps = document.getElementById("laps");
const clickSound = document.getElementById("clickSound");
const lapSound = document.getElementById("lapSound");

function start() {
    if (!running) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTime, 10);
        running = true;
        display.classList.add("running");
        clickSound.play();
    }
}

function pause() {
    if (running) {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        running = false;
        display.classList.remove("running");
        clickSound.play();
    }
}

function reset() {
    clearInterval(timer);
    display.textContent = "00:00:00";
    elapsedTime = 0;
    running = false;
    lapCount = 0;
    lapTimes = [];
    laps.innerHTML = "";
    display.classList.remove("running");
    localStorage.clear();
    clickSound.play();
}

function lap() {
    if (!running) return;

    lapCount++;
    lapSound.play();

    const diff = lapTimes.length
        ? elapsedTime - lapTimes[lapTimes.length - 1]
        : elapsedTime;

    lapTimes.push(elapsedTime);

    const li = document.createElement("li");
    li.innerHTML = `Lap ${lapCount} – ${display.textContent} (+${formatTime(diff)})`;
    laps.appendChild(li);

    highlightLaps();
    localStorage.setItem("laps", JSON.stringify(lapTimes));
}

function updateTime() {
    elapsedTime = Date.now() - startTime;

    const ms = Math.floor((elapsedTime % 1000) / 10);
    const s = Math.floor((elapsedTime / 1000) % 60);
    const m = Math.floor((elapsedTime / 60000) % 60);

    display.textContent =
        `${String(m).padStart(2,"0")}:` +
        `${String(s).padStart(2,"0")}:` +
        `${String(ms).padStart(2,"0")}`;
}

function formatTime(ms) {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor(ms / 60000);
    const t = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(t).padStart(2,"0")}`;
}

function highlightLaps() {
    const items = document.querySelectorAll("li");
    items.forEach(i => i.className = "");

    if (lapTimes.length < 2) return;

    const diffs = lapTimes.map((t,i) => i ? t - lapTimes[i-1] : t);
    const fastest = Math.min(...diffs.slice(1));
    const slowest = Math.max(...diffs.slice(1));

    diffs.forEach((d,i) => {
        if (i === 0) return;
        if (d === fastest) items[i].classList.add("fastest");
        if (d === slowest) items[i].classList.add("slowest");
    });
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

/* Keyboard Shortcuts */
document.addEventListener("keydown", e => {
    if (e.code === "Space") running ? pause() : start();
    if (e.key === "r") reset();
    if (e.key === "l") lap();
});
