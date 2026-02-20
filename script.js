// =============================
// MATRIX RAIN + NOME / COGNOME
// =============================
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const snakeCanvas = document.getElementById("snake");
const snakeCtx = snakeCanvas.getContext("2d");

// colori
const color = "#00ff00";
const hoverColor = "#b300ff";

const fontSize = 16;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    snakeCanvas.width = window.innerWidth;
    snakeCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "01";
let columns = Math.floor(window.innerWidth / fontSize);
let drops = [];

let mouseX = -1000;
let mouseY = -1000;
const mouseRadius = 140;

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener("mouseleave", () => {
    mouseX = -1000;
    mouseY = -1000;
});

// --- TESTO FISSO ---
const name = "giulia".split("");
const surname = "cardinale".split("");

const nameColumn = 10;
const surnameColumn = 20;

const nameStartRow = 10;
const surnameStartRow = 10;

let fixedName = Array(name.length).fill(false);
let fixedSurname = Array(surname.length).fill(false);

let lastHoveredLetter = null;

function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;
}

initDrops();

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    lastHoveredLetter = null;

    for (let i = 0; i < drops.length; i++) {
        const baseX = i * fontSize;
        const baseY = drops[i] * fontSize;

        const dx = mouseX - baseX;
        const dy = mouseY - baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawX = baseX;
        let drawY = baseY;

        if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            drawX += dx * force * 1.2;
            drawY += dy * force * 1.2;
            ctx.shadowBlur = 60;
        } else ctx.shadowBlur = 10;

        // --- NOME ---
        if (i === nameColumn) {
            const index = drops[i] - nameStartRow;
            if (index >= 0 && index < name.length) fixedName[index] = true;

            ctx.fillStyle = color;
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], drawX, drawY);

            fixedName.forEach((fixed, idx) => {
                if (fixed) {
                    const letterX = baseX;
                    const letterY = (nameStartRow + idx) * fontSize;

                    const distToLetter = Math.sqrt(
                        (mouseX - letterX) ** 2 + (mouseY - letterY) ** 2
                    );

                    let glitchOffset = 0;
                    if (distToLetter < fontSize) {
                        glitchOffset = (Math.random() - 0.5) * 3;
                        lastHoveredLetter = name[idx];
                    }

                    ctx.fillStyle = distToLetter < fontSize ? color : hoverColor;
                    ctx.fillText(name[idx], letterX + glitchOffset, letterY);
                }
            });

            drops[i]++;
            continue;
        }

        // --- COGNOME ---
        if (i === surnameColumn) {
            const index = drops[i] - surnameStartRow;
            if (index >= 0 && index < surname.length) fixedSurname[index] = true;

            ctx.fillStyle = color;
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], drawX, drawY);

            fixedSurname.forEach((fixed, idx) => {
                if (fixed) {
                    const letterX = baseX;
                    const letterY = (surnameStartRow + idx) * fontSize;

                    const distToLetter = Math.sqrt(
                        (mouseX - letterX) ** 2 + (mouseY - letterY) ** 2
                    );

                    let glitchOffset = 0;
                    if (distToLetter < fontSize) {
                        glitchOffset = (Math.random() - 0.5) * 3;
                        lastHoveredLetter = surname[idx];
                    }

                    ctx.fillStyle = distToLetter < fontSize ? color : hoverColor;
                    ctx.fillText(surname[idx], letterX + glitchOffset, letterY);
                }
            });

            drops[i]++;
            continue;
        }

        // --- CADUTA NORMALE ---
        ctx.fillStyle = color;
        ctx.fillText(letters[Math.floor(Math.random() * letters.length)], drawX, drawY);

        if (baseY > canvas.height && Math.random() > 0.975) drops[i] = 0;

        drops[i]++;
    }
}

setInterval(draw, 33);


// =============================
// 🎮 SNAKE GAME COMPLETO
// =============================
let snake = [];
let food = {};
let dx = 20;
let dy = 0;
let snakeRunning = false;
let score = 0;
let record = 0;
let startTime = 0;

const gameOverScreen = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");
const recordText = document.getElementById("recordText");
const timeText = document.getElementById("timeText");
const playAgainBtn = document.getElementById("playAgain");

playAgainBtn.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    startSnake();
});

function startSnake() {
    snakeCanvas.style.display = "block";

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    dx = 20;
    dy = 0;

    score = 0;
    startTime = Date.now();

    placeFood();

    snakeRunning = true;

    document.addEventListener("keydown", snakeControls);

    gameLoop();
}

function snakeControls(e) {
    if (!snakeRunning) return;

    if (e.key === "Escape") {
        endSnake();
        return;
    }

    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -20; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 20; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -20; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 20; dy = 0; }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (snakeCanvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (snakeCanvas.height / 20)) * 20
    };
}

function gameLoop() {
    if (!snakeRunning) return;

    setTimeout(() => {
        updateSnake();
        gameLoop();
    }, 100);
}

function updateSnake() {
    snakeCtx.fillStyle = "black";
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snakeCtx.fillStyle = "#00ff00";
    snakeCtx.font = "24px monospace";
    snakeCtx.textAlign = "center";
    snakeCtx.fillText(score.toString().padStart(2, "0"), snakeCanvas.width / 2, 40);

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (
        head.x < 0 ||
        head.x >= snakeCanvas.width ||
        head.y < 0 ||
        head.y >= snakeCanvas.height
    ) {
        endSnake();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }

    snakeCtx.fillStyle = "#00ff00";
    snake.forEach(part => snakeCtx.fillRect(part.x, part.y, 20, 20));

    snakeCtx.fillStyle = "red";
    snakeCtx.fillRect(food.x, food.y, 20, 20);
}

function endSnake() {
    snakeRunning = false;
    snakeCanvas.style.display = "none";

    const timePlayed = Math.floor((Date.now() - startTime) / 1000);

    if (score > record) record = score;

    scoreText.textContent = "Punteggio: " + score;
    recordText.textContent = "Record: " + record;
    timeText.textContent = "Tempo: " + timePlayed + "s";

    gameOverScreen.style.display = "block";
}


// =============================
// 🟪 GLITCH SULLA LETTERA "i"
// =============================
function triggerGlitch() {
    const glitchDiv = document.createElement("div");
    glitchDiv.style.position = "fixed";
    glitchDiv.style.top = 0;
    glitchDiv.style.left = 0;
    glitchDiv.style.width = "100vw";
    glitchDiv.style.height = "100vh";
    glitchDiv.style.background = "white";
    glitchDiv.style.mixBlendMode = "difference";
    glitchDiv.style.zIndex = 500;
    glitchDiv.style.pointerEvents = "none";

    document.body.appendChild(glitchDiv);

    setTimeout(() => glitchDiv.remove(), 300);
}


// =============================
// 🟦 SCHERMATA NERA (LETTERA "l")
// =============================
const dotsScreen = document.getElementById("dotsScreen");
let dots = [];
let dotsActive = false;
let mousePosDots = { x: 0, y: 0 };

function startDotsScreen() {
    dotsScreen.style.display = "block";
    dotsActive = true;
    dots = [];

    document.addEventListener("mousemove", trackMouseDots);
    dotsScreen.addEventListener("click", createDot);
    document.addEventListener("keydown", exitDotsScreen);

    animateDots();
}

function trackMouseDots(e) {
    mousePosDots.x = e.clientX;
    mousePosDots.y = e.clientY;
}

function createDot(e) {
    if (!dotsActive) return;

    const dot = document.createElement("div");
    dot.classList.add("dot");

    dot.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;

    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";

    dotsScreen.appendChild(dot);

    dots.push({
        el: dot,
        x: e.clientX,
        y: e.clientY,
        speed: 0.02 + Math.random() * 0.03
    });
}

function animateDots() {
    if (!dotsActive) return;

    dots.forEach((dot) => {
        dot.x += (mousePosDots.x - dot.x) * dot.speed;
        dot.y += (mousePosDots.y - dot.y) * dot.speed;

        dot.el.style.left = dot.x + "px";
        dot.el.style.top = dot.y + "px";
    });

    requestAnimationFrame(animateDots);
}

function exitDotsScreen(e) {
    if (e.key === "Escape") {
        dotsActive = false;
        dotsScreen.style.display = "none";
        dotsScreen.innerHTML = "";
        dots = [];

        document.removeEventListener("mousemove", trackMouseDots);
        dotsScreen.removeEventListener("click", createDot);
        document.removeEventListener("keydown", exitDotsScreen);
    }
}


// =============================
// 🟩 CLICK LETTERE
// =============================
canvas.addEventListener("click", () => {
    if (lastHoveredLetter === "e") startSnake();
    if (lastHoveredLetter === "i") triggerGlitch();
    if (lastHoveredLetter === "l") startDotsScreen();
});
