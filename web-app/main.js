import {
  createGame,
  nextTurn,
  getGameState
} from "./game.js";

const TOTAL_COOKIES = 4;
const BOARD_SIZE = 8;
const MAX_LIVES = 3;
const HEART_SRC = "assets/items/heart.png";
const COOKIE_HUD_SRC = "assets/items/cookie.png";

// Map of different levels
const LEVELS = [
  {
    //Level 1
    walls: [
      { row: 0, col: 3 },{ row: 1, col: 3 }, { row: 1, col: 5 },
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 5 }, { row: 2, col: 7 },
      { row: 3, col: 3 },{ row: 4, col: 1 }, { row: 4, col: 3 }, { row: 4, col: 5 },
      { row: 5, col: 1 },{ row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 6 }
    ],
    cookies: [
      { row: 0, col: 1 }, { row: 3, col: 4 }, { row: 5, col: 2 }, { row: 7, col: 6 }
    ],
    playerStart: { row: 1, col: 0 },
    alien: { row: 7, col: 0 },
    exit: { row: 0, col: 7 }
  },
  {
    //Level 2
    walls: [
      { row: 0, col: 4 }, { row: 0, col: 5 }, { row: 0, col: 6 },{ row: 1, col: 1 }, { row: 1, col: 6 },
      { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 6 },{ row: 3, col: 1 }, 
      { row: 3, col: 6 },{ row: 4, col: 1 }, { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 6 },
      { row: 5, col: 1 }, { row: 5, col: 6 },{ row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, 
      { row: 6, col: 4 },{ row: 7, col: 4 }
    ],
    cookies: [
      { row: 0, col: 2 }, { row: 3, col: 3 }, { row: 5, col: 5 }, { row: 7, col: 1 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 7, col: 7 },
    exit: { row: 7, col: 6 }
  },
  {
    //Level 3
    walls: [
      { row: 0, col: 2 },{ row: 1, col: 2 }, { row: 1, col: 4 }, { row: 1, col: 6 },
      { row: 2, col: 4 }, { row: 2, col: 6 },{ row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 4 },
      { row: 4, col: 4 }, { row: 4, col: 6 },{ row: 5, col: 2 }, { row: 5, col: 4 }, { row: 5, col: 6 },
      { row: 6, col: 2 },{ row: 7, col: 2 }, { row: 7, col: 4 }, { row: 7, col: 5 }
    ],
    cookies: [
      { row: 0, col: 7 }, { row: 2, col: 1 }, { row: 4, col: 5 }, { row: 6, col: 7 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 7, col: 7 },
    exit: { row: 7, col: 0 }
  },
   {
    //Level 4
    walls: [
      { row: 0, col: 4 },
      { row: 1, col: 0 }, { row: 1, col: 2 }, { row: 1, col: 6 },
      { row: 2, col: 3 }, { row: 2, col: 5 },
      { row: 3, col: 1 }, { row: 3, col: 7 },
      { row: 4, col: 2 }, { row: 4, col: 4 },
      { row: 5, col: 0 }, { row: 5, col: 3 }, { row: 5, col: 6 },
      { row: 6, col: 2 }, { row: 6, col: 5 },
      { row: 7, col: 4 }
    ],
    cookies: [
      { row: 0, col: 6 }, { row: 2, col: 1 }, { row: 4, col: 6 }, { row: 6, col: 6 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 0, col: 7 },
    exit: { row: 7, col: 0 }
  },
];


// Player characters

const PLAYER_CHARS = [
  "assets/player/minji.png",
  "assets/player/hanni.png",
  "assets/player/dani.png",
  "assets/player/haerin.png",
  "assets/player/hyein.png"
];

function randomChar() {
  const src = PLAYER_CHARS[Math.floor(Math.random() * PLAYER_CHARS.length)];
  document.documentElement.style.setProperty("--player-img", `url("${src}")`);
}


// Game state

let currentLevel = 0;
let game = createGameForLevel(currentLevel);

function createGameForLevel(level) {
  const L = LEVELS[level];
  return {
    ...createGame({ lives: 3, steps: 40 }),
    walls:       L.walls.filter(Boolean).map(w => ({ ...w })),
    cookies:     L.cookies.map(c => ({ ...c })),
    playerStart: { ...L.playerStart },
    player:      { ...L.playerStart },
    alien:       { ...L.alien },
    exit:        { ...L.exit }
  };
}


// Audio

const bgMusic = new Audio("assets/music/supershy.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1;

const coinSound = new Audio("assets/music/pickupCoin.wav");
coinSound.volume = 0.3;
function playCookieSound() {
  coinSound.currentTime = 0;
  coinSound.play().catch(() => {});
}

const failSound = new Audio("assets/music/gameover.mp3");
failSound.volume = 0.3;

const hurtSound = new Audio("assets/music/Hurt.wav");
hurtSound.volume = 0.3;
function playHurtSound() {
  hurtSound.currentTime = 0;
  hurtSound.play().catch(() => {});
}

const levelUpSound = new Audio("assets/music/levelup.mp3");
levelUpSound.volume = 0.3;

let audioStarted = false;
function startAudio() {
  if (!audioStarted) {
    bgMusic.play().catch(() => {});
    audioStarted = true;
  }
}

const musicToggleBtn = document.getElementById("music-toggle");
musicToggleBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicToggleBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicToggleBtn.textContent = "🔇";
  }
});

// DOM references

const boardEl          = document.getElementById("board");
const boardWrapperEl   = document.getElementById("board-wrapper");
const gameContainerEl  = document.getElementById("game-container");
const levelSelectEl    = document.getElementById("level-select-screen");
const levelSelectGrid  = document.getElementById("level-select-grid");
const stepsEl          = document.getElementById("steps-count");
const hudLivesEl       = document.getElementById("hud-lives");
const hudCookiesEl     = document.getElementById("hud-cookies");
const levelDisplayEl   = document.getElementById("level-display");
const overlayEl        = document.getElementById("overlay");
const overlayTitle     = document.getElementById("overlay-title");
const overlayCookies   = document.getElementById("overlay-cookies");
const overlaySub       = document.getElementById("overlay-sub");
const overlayCountdown = document.getElementById("overlay-countdown");
const resetBtn         = document.getElementById("reset-button");

let countdownTimer = null;

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  overlayCountdown.textContent = "";
}

function startCountdown() {
  let secs = 3;
  overlayCountdown.textContent = `✨ Secret ending in ${secs}...`;
  countdownTimer = setInterval(() => {
    secs--;
    if (secs <= 0) {
      clearCountdown();
      showOutro();
    } else {
      overlayCountdown.textContent = `✨ Secret ending in ${secs}...`;
    }
  }, 1000);
}


// Level unlock tracking

const UNLOCK_KEY = "spaceMaze_maxUnlocked";

function getMaxUnlocked() {
  return parseInt(localStorage.getItem(UNLOCK_KEY) || "0", 10);
}

function saveUnlock(levelIndex) {
  if (levelIndex > getMaxUnlocked()) {
    localStorage.setItem(UNLOCK_KEY, String(levelIndex));
  }
}

const SCORES_KEY = "spaceMaze_scores";

function getLevelScores() {
  return JSON.parse(localStorage.getItem(SCORES_KEY) || "{}");
}

function saveLevelScore(levelIndex, cookies) {
  const scores = getLevelScores();
  const prev = scores[levelIndex] ?? -1;
  if (cookies > prev) {
    scores[levelIndex] = cookies;
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  }
}

function showLevelSelect() {
  levelSelectEl.classList.add("is-visible");
  gameContainerEl.style.display = "none";

  levelSelectGrid.innerHTML = "";
  const maxUnlocked = getMaxUnlocked();

  const scores = getLevelScores();

  LEVELS.forEach((_, i) => {
    const btn = document.createElement("button");
    const locked = i > maxUnlocked;
    const score = scores[i] ?? null;
    const perfect = score >= TOTAL_COOKIES;
    const scoreText = score !== null
      ? (perfect ? "⭐ Perfect!" : `${score}/${TOTAL_COOKIES} cookies`)
      : "—";

    btn.className = "level-btn" + (locked ? " level-btn--locked" : "") + (perfect ? " level-btn--perfect" : "");
    btn.disabled = locked;
    btn.innerHTML = `
      <span class="level-btn__number">${locked ? "🔒" : (i + 1)}</span>
      Level ${i + 1}
      <span class="level-btn__score">${locked ? "" : scoreText}</span>
    `;
    if (!locked) {
      btn.addEventListener("click", () => {
        currentLevel = i;
        game = createGameForLevel(i);
        randomChar();
        hideLevelSelect();
        buildBoard();
        render();
        boardEl.focus();
      });
    }
    levelSelectGrid.appendChild(btn);
  });
}

function hideLevelSelect() {
  levelSelectEl.classList.remove("is-visible");
  gameContainerEl.style.display = "";
}


// Board generation — runs once, creates all 64 cells

function buildBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      boardEl.appendChild(cell);
    }
  }
}

// Render — updates cell classes to reflect current game state

function hasPosition(list, row, col) {
  return list.some(p => p.row === row && p.col === col);
}

function renderBoard() {
  const state = getGameState(game);

  boardEl.querySelectorAll(".cell").forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    cell.className = "cell";

    if (hasPosition(game.walls, row, col)) {
      cell.classList.add("cell--wall");
    } else if (row === game.exit.row && col === game.exit.col) {
      cell.classList.add("cell--exit");
    } else if (hasPosition(game.cookies, row, col)) {
      cell.classList.add("cell--cookie");
    }

    if (row === game.alien.row && col === game.alien.col) {
      cell.classList.add("cell--alien");
    }

    if (row === game.player.row && col === game.player.col) {
      cell.classList.add("cell--player");
    }

    // ARIA label for screen readers
    cell.setAttribute("aria-label", getCellLabel(row, col));
  });
}

function getCellLabel(row, col) {
  if (game.player.row === row && game.player.col === col) return "Player";
  if (game.alien.row  === row && game.alien.col  === col) return "Alien";
  if (game.exit.row   === row && game.exit.col   === col) return "Exit";
  if (hasPosition(game.cookies, row, col)) return "Cookie";
  if (hasPosition(game.walls,   row, col)) return "Wall";
  return "Empty";
}


function triggerHitFlash() {
  boardWrapperEl.classList.remove("board-wrapper--hit");
  void boardWrapperEl.offsetWidth; // reflow to restart animation
  boardWrapperEl.classList.add("board-wrapper--hit");
  boardWrapperEl.addEventListener(
    "animationend",
    () => boardWrapperEl.classList.remove("board-wrapper--hit"),
    { once: true }
  );
}

function renderHUD() {
  stepsEl.textContent = game.steps;
  levelDisplayEl.textContent = `Level ${currentLevel + 1} / ${LEVELS.length}`;

  // Hearts
  hudLivesEl.innerHTML = "";
  for (let i = 0; i < MAX_LIVES; i++) {
    const img = document.createElement("img");
    img.src = HEART_SRC;
    img.alt = i < game.lives ? "life" : "lost life";
    img.className = "hud__icon" + (i < game.lives ? "" : " hud__icon--dim");
    hudLivesEl.appendChild(img);
  }

  hudCookiesEl.innerHTML = "";
  for (let i = 0; i < TOTAL_COOKIES; i++) {
    const img = document.createElement("img");
    img.src = COOKIE_HUD_SRC;
    img.alt = i < game.collectedCookies ? "cookie collected" : "cookie remaining";
    img.className = "hud__icon hud__icon--cookie" +
      (i < game.collectedCookies ? "" : " hud__icon--dim");
    hudCookiesEl.appendChild(img);
  }
  const countSpan = document.createElement("span");
  countSpan.className = "hud__cookie-count";
  countSpan.textContent = `${game.collectedCookies}/${TOTAL_COOKIES}`;
  hudCookiesEl.appendChild(countSpan);
}

// Overlay — win / lose message centred over the board

function renderStatus() {
  if (game.status === "win") {
    const isLastLevel = currentLevel >= LEVELS.length - 1;

    overlayTitle.className = "overlay__title overlay__title--win";
    overlayCookies.innerHTML = "";
    for (let i = 0; i < TOTAL_COOKIES; i++) {
      const img = document.createElement("img");
      img.src = COOKIE_HUD_SRC;
      img.alt = i < game.collectedCookies ? "collected" : "missed";
      img.className = "overlay__cookie-icon" +
        (i < game.collectedCookies ? "" : " overlay__cookie-icon--dim");
      overlayCookies.appendChild(img);
    }

    saveUnlock(currentLevel + 1);
    saveLevelScore(currentLevel, game.collectedCookies);

    if (currentLevel >= LEVELS.length - 1 && allLevelsPerfect()) {
      const K = (k) => `<span class="overlay__key">${k}</span>`;
      overlayTitle.textContent = "🏆 All Levels Complete!";
      overlayTitle.className = "overlay__title overlay__title--win";
      overlaySub.innerHTML = `${game.collectedCookies}/${TOTAL_COOKIES} cookies  •  ${K("Q")} secret ending  ${K("R")} again  ${K("S")} levels`;
      if (!overlayEl.classList.contains("is-visible")) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(() => {});
      }
      if (!overlayEl.classList.contains("is-visible")) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(() => {});
        startCountdown();
      }
      overlayEl.classList.add("is-visible");
      return;
    }
    const K = (k) => `<span class="overlay__key">${k}</span>`;
    if (isLastLevel) {
      overlayTitle.textContent = "🏆 All Levels Complete!";
      overlaySub.innerHTML = `${game.collectedCookies}/${TOTAL_COOKIES} cookies  •  ${K("R")} again  ${K("S")} levels`;
    } else {
      const perfect = game.collectedCookies >= TOTAL_COOKIES;
      overlayTitle.textContent = perfect ? "🎉 Perfect Clear!" : "✅ Level Cleared!";
      overlaySub.innerHTML = `${game.collectedCookies}/${TOTAL_COOKIES} cookies  •  ${K("N")} next  ${K("R")} restart  ${K("S")} levels`;
    }

    if (!overlayEl.classList.contains("is-visible")) {
      levelUpSound.currentTime = 0;
      levelUpSound.play().catch(() => {});
    }
    overlayEl.classList.add("is-visible");

  } else if (game.status === "lose") {
    overlayTitle.textContent = "💀 Game Over";
    overlayTitle.className = "overlay__title overlay__title--lose";
    overlayCookies.innerHTML = "";
    overlaySub.innerHTML = `No lives or steps left.  Press <span class="overlay__key">R</span> to restart.`;
    if (!overlayEl.classList.contains("is-visible")) {
      failSound.currentTime = 0;
      failSound.play().catch(() => {});
    }
    overlayEl.classList.add("is-visible");

  } else {
    overlayEl.classList.remove("is-visible");
  }
}

// Full render

function render() {
  renderBoard();
  renderHUD();
  renderStatus();
}


// Input

const KEY_DIRECTION = {
  ArrowUp:    "up",
  ArrowDown:  "down",
  ArrowLeft:  "left",
  ArrowRight: "right"
};

document.addEventListener("keydown", handleKey);

function handleKey(event) {
  startAudio();

  // Level select
  if (event.key === "s" || event.key === "S") {
    clearCountdown();
    showLevelSelect();
    return;
  }

  // Next level
  if ((event.key === "n" || event.key === "N") && game.status === "win") {
    if (currentLevel < LEVELS.length - 1) {
      clearCountdown();
      currentLevel++;
      game = createGameForLevel(currentLevel);
      randomChar();
      render();
    }
    return;
  }

  // Restart
  if (event.key === "r" || event.key === "R") {
    clearCountdown();
    game = createGameForLevel(currentLevel);
    randomChar();
    render();
    return;
  }

  if (game.status !== "running") return;

  const direction = KEY_DIRECTION[event.key];
  if (!direction) return;

  // Prevent page scrolling with arrow keys
  event.preventDefault();

  const cookiesBefore = game.collectedCookies;
  const livesBefore = game.lives;

  game = nextTurn(game, direction);

  if (game.collectedCookies > cookiesBefore) playCookieSound();
  if (game.lives < livesBefore) {
    playHurtSound();
    triggerHitFlash();
  }
  render();
}

// Reset button
resetBtn.addEventListener("click", () => {
  game = createGameForLevel(currentLevel);
  randomChar();
  render();
  boardEl.focus();
});


// Intro video

const introScreen   = document.getElementById("intro-screen");
const introVideo    = document.getElementById("intro-video");
const introOverlay  = document.getElementById("intro-overlay");
const introStory    = document.getElementById("intro-story");
const introSkipBtn  = document.getElementById("intro-skip");

const STORY_LINES = [
  "Five bunnies. One unknown planet.",
  "The NewJeans have crash-landed on a mysterious alien world.",
  "As their loyal bunny, it's up to you to guide them home.",
  "Collect the cookies to fuel the escape pod.",
  "Avoid the alien — and find the exit before it's too late.",
  "Good luck, bunny. 🐰"
];

// Intro music — update filename once you add the file
const introMusic = new Audio("assets/movie/newjeans-music.mp3");
introMusic.loop = true;
introMusic.volume = 0.3;

let introActive = false;

function endIntro() {
  if (!introActive) return;
  introActive = false;
  introVideo.pause();
  introMusic.pause();
  introMusic.currentTime = 0;
  introScreen.classList.add("is-hidden");
  showLevelSelect();
}

// Outro animation

const outroScreen  = document.getElementById("outro-screen");
const outroVideo   = document.getElementById("outro-video");
const outroStory   = document.getElementById("outro-story");
const outroSkipBtn = document.getElementById("outro-skip");

const OUTRO_LINES = [
  "Mission complete.",
  "The cookies have been collected.",
  "The escape pod is ready.",
  "The NewJeans are going home.",
  "Thank you for playing, bunny. 🐰"
];

const outroMusic = new Audio("assets/movie/newjeans-complete.mp3");
outroMusic.volume = 0.3;

function endOutro() {
  outroVideo.pause();
  outroMusic.pause();
  outroMusic.currentTime = 0;
  outroScreen.classList.add("is-hidden");
  bgMusic.play().catch(() => {});
  showLevelSelect();
}

function allLevelsPerfect() {
  const scores = getLevelScores();
  return LEVELS.every((_, i) => (scores[i] ?? 0) >= TOTAL_COOKIES);
}

function showOutro() {
  outroScreen.classList.remove("is-hidden");
  gameContainerEl.style.display = "none";
  outroStory.innerHTML = "";

  bgMusic.pause();

  outroMusic.currentTime = 0;
  outroMusic.play().catch(() => {});
  outroVideo.currentTime = 0;
  outroVideo.play().catch(() => {});

  OUTRO_LINES.forEach((line, i) => {
    setTimeout(() => {
      const span = document.createElement("span");
      span.className = "intro-story-line";
      span.textContent = line;
      outroStory.appendChild(span);
    }, 800 + i * 1200);
  });

  outroVideo.addEventListener("ended", endOutro, { once: true });
  outroSkipBtn.addEventListener("click", endOutro, { once: true });
}

function startStoryText() {
  introOverlay.classList.add("is-dim");
  STORY_LINES.forEach((line, i) => {
    setTimeout(() => {
      const span = document.createElement("span");
      span.className = "intro-story-line";
      span.textContent = line;
      introStory.appendChild(span);
    }, 800 + i * 1000);
  });

  const totalDelay = 800 + STORY_LINES.length * 1000 + 500;
  setTimeout(() => {
    const span = document.createElement("span");
    span.className = "intro-story-line intro-press-key";
    span.textContent = "— Press any key to start —";
    introStory.appendChild(span);
    document.addEventListener("keydown", endIntro, { once: true });
    introScreen.addEventListener("click", endIntro, { once: true });
  }, totalDelay);
}

function runIntro() {
  introActive = true;
  introMusic.play().catch(() => {});
  introVideo.play().catch(() => endIntro());

  // First loop ends → dim + show text, then loop video
  introVideo.addEventListener("ended", () => {
    startStoryText();
    introVideo.loop = true;
    introVideo.play();
  }, { once: true });

  introSkipBtn.addEventListener("click", endIntro, { once: true });
}


// Boot

buildBoard();
render();
runIntro();