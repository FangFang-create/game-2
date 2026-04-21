const video = document.querySelector("#dance-video");
const gameShell = document.querySelector(".game-shell");
const notesLayer = document.querySelector("#notes-layer");
const startScreen = document.querySelector("#start-screen");
const resultScreen = document.querySelector("#result-screen");
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");

const comboCount = document.querySelector("#combo-count");
const judgementText = document.querySelector("#judgement-text");
const accuracyText = document.querySelector("#accuracy-text");
const powerFill = document.querySelector("#power-fill");

const bestComboText = document.querySelector("#best-combo");
const finalAccuracyText = document.querySelector("#final-accuracy");
const perfectCountText = document.querySelector("#perfect-count");
const finalScoreText = document.querySelector("#final-score");

const TRAVEL_TIME = 2.25;
const PERFECT_WINDOW = 0.1;
const GOOD_WINDOW = 0.22;
const MISS_WINDOW = 0.28;
const JUDGE_X = 24;

const NOTE_COLORS = [
  "#9FEA5A",
  "#56D8FF",
  "#FF8A7E",
  "#FFC655",
  "#BA9CFF",
];

const state = {
  started: false,
  rafId: 0,
  combo: 0,
  bestCombo: 0,
  score: 0,
  hits: 0,
  totalNotes: 0,
  perfects: 0,
  power: 0,
  notes: [],
};

function createNoteElement(color) {
  const note = document.createElement("div");
  note.className = "note";
  note.style.setProperty("--note-color", color);
  note.style.left = "108%";
  note.style.opacity = "0";

  const face = document.createElement("span");
  face.className = "note__face";

  const nose = document.createElement("span");
  nose.className = "note__nose";

  note.append(face, nose);
  notesLayer.append(note);
  return note;
}

function resetUi() {
  state.combo = 0;
  state.bestCombo = 0;
  state.score = 0;
  state.hits = 0;
  state.perfects = 0;
  state.power = 0;

  comboCount.textContent = "0";
  judgementText.textContent = "Ready?";
  judgementText.style.color = "var(--glow-green)";
  accuracyText.textContent = "100%";
  powerFill.style.width = "0%";
}

function clearNotes() {
  cancelAnimationFrame(state.rafId);
  state.notes.forEach((note) => note.element.remove());
  state.notes = [];
  state.totalNotes = 0;
}

function buildBeatmap(duration) {
  clearNotes();

  const pattern = [0.5, 0.58, 0.46, 0.62, 0.52, 0.5, 0.44, 0.66];
  let time = 1.85;
  let index = 0;

  while (time < duration - 0.65) {
    const color = NOTE_COLORS[index % NOTE_COLORS.length];
    state.notes.push({
      id: index,
      time,
      color,
      judged: false,
      element: createNoteElement(color),
    });

    time += pattern[index % pattern.length];
    index += 1;
  }

  state.totalNotes = state.notes.length;
}

function setFeedback(text, color) {
  judgementText.textContent = text;
  judgementText.style.color = color;
}

function updatePower(delta) {
  state.power = Math.max(0, Math.min(100, state.power + delta));
  powerFill.style.width = `${state.power}%`;
}

function updateAccuracy() {
  const accuracy = state.totalNotes ? Math.round((state.hits / state.totalNotes) * 100) : 100;
  accuracyText.textContent = `${accuracy}%`;
}

function registerHit(kind, note) {
  note.judged = true;
  note.element.classList.add("is-hit");
  window.setTimeout(() => note.element.remove(), 120);

  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.hits += 1;

  if (kind === "perfect") {
    state.perfects += 1;
    state.score += 150 + state.combo * 8;
    updatePower(8);
    setFeedback("Perfect!", "var(--perfect)");
  } else {
    state.score += 100 + state.combo * 5;
    updatePower(5);
    setFeedback("Good!", "var(--good)");
  }

  comboCount.textContent = String(state.combo);
  updateAccuracy();
}

function registerMiss(note) {
  note.judged = true;
  note.element.classList.add("is-missed");
  window.setTimeout(() => note.element.remove(), 180);

  state.combo = 0;
  comboCount.textContent = "0";
  updatePower(-10);
  setFeedback("Miss", "var(--miss)");
  updateAccuracy();
}

function judgeTap() {
  if (!state.started || video.paused || video.ended) {
    return;
  }

  tapSurface.classList.add("is-active");
  window.clearTimeout(judgeTap.pulseTimeout);
  judgeTap.pulseTimeout = window.setTimeout(() => {
    tapSurface.classList.remove("is-active");
  }, 120);

  const currentTime = video.currentTime;
  let bestNote = null;
  let bestDistance = Infinity;

  state.notes.forEach((note) => {
    if (note.judged) {
      return;
    }

    const distance = Math.abs(note.time - currentTime);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestNote = note;
    }
  });

  if (!bestNote || bestDistance > GOOD_WINDOW) {
    state.combo = 0;
    comboCount.textContent = "0";
    updatePower(-6);
    setFeedback("Too Early", "var(--miss)");
    return;
  }

  if (bestDistance <= PERFECT_WINDOW) {
    registerHit("perfect", bestNote);
    return;
  }

  registerHit("good", bestNote);
}

function updateNotes() {
  const now = video.currentTime;

  state.notes.forEach((note) => {
    if (note.judged) {
      return;
    }

    const delta = note.time - now;
    if (delta < -MISS_WINDOW) {
      registerMiss(note);
      return;
    }

    const x = JUDGE_X + (delta / TRAVEL_TIME) * 76;
    const opacity = delta > TRAVEL_TIME ? 0 : 1;
    note.element.style.left = `${x}%`;
    note.element.style.opacity = String(opacity);
  });

  if (!video.paused && !video.ended) {
    state.rafId = requestAnimationFrame(updateNotes);
  }
}

function showResult() {
  gameShell.classList.remove("is-playing");
  resultScreen.classList.add("modal-card--visible");
  startScreen.classList.remove("modal-card--visible");

  const accuracy = state.totalNotes ? Math.round((state.hits / state.totalNotes) * 100) : 100;
  bestComboText.textContent = String(state.bestCombo);
  finalAccuracyText.textContent = `${accuracy}%`;
  perfectCountText.textContent = String(state.perfects);
  finalScoreText.textContent = String(state.score);
}

function startGame() {
  gameShell.classList.add("is-playing");
  resultScreen.classList.remove("modal-card--visible");
  startScreen.classList.remove("modal-card--visible");

  resetUi();
  buildBeatmap(Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 18);

  video.currentTime = 0;
  state.started = true;

  const playAttempt = video.play();
  if (playAttempt instanceof Promise) {
    playAttempt.catch(() => {
      startScreen.classList.add("modal-card--visible");
      setFeedback("Tap To Start", "var(--glow-green)");
    });
  }

  state.rafId = requestAnimationFrame(updateNotes);
}

video.addEventListener("loadedmetadata", () => {
  if (!state.notes.length) {
    buildBeatmap(video.duration);
  }
});

video.addEventListener("play", () => {
  cancelAnimationFrame(state.rafId);
  state.rafId = requestAnimationFrame(updateNotes);
});

video.addEventListener("ended", showResult);

gameShell.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) {
    return;
  }

  judgeTap();
});
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!state.started || video.ended) {
      startGame();
      return;
    }
    judgeTap();
  }
});

resetUi();
