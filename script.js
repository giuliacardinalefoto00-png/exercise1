// =============================
// MATRIX RAIN + NOME / COGNOME
// =============================
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const snakeCanvas = document.getElementById("snake");
const snakeCtx = snakeCanvas.getContext("2d");

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

canvas.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
canvas.addEventListener("mouseleave", () => {
    mouseX = -1000;
    mouseY = -1000;
});

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
    ctx.fillStyle = "rgba(0,0,0,0.01)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.font = fontSize + "px monospace";
    lastHoveredLetter = null;

    for (let i = 0; i < drops.length; i++) {

        const baseX = i * fontSize;
        const baseY = drops[i] * fontSize;

        const dx = mouseX - baseX;
        const dy = mouseY - baseY;
        const dist = Math.sqrt(dx*dx + dy*dy);

        let drawX = baseX;
        let drawY = baseY;

        if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            drawX += dx * force * 1.2;
            drawY += dy * force * 1.2;
            ctx.shadowBlur = 60;
        } else ctx.shadowBlur = 10;

        if (i === nameColumn) {
            const index = drops[i] - nameStartRow;
            if (index >= 0 && index < name.length) fixedName[index] = true;

            ctx.fillStyle = color;
            ctx.fillText(letters[Math.floor(Math.random()*letters.length)], drawX, drawY);

            fixedName.forEach((fixed, idx) => {
                if (fixed) {
                    const lx = baseX;
                    const ly = (nameStartRow + idx) * fontSize;

                    const d = Math.sqrt((mouseX-lx)**2 + (mouseY-ly)**2);

                    let glitch = 0;
                    if (d < fontSize) {
                        glitch = (Math.random()-0.5)*3;
                        lastHoveredLetter = name[idx];
                    }

                    ctx.fillStyle = d < fontSize ? color : hoverColor;
                    ctx.fillText(name[idx], lx + glitch, ly);
                }
            });

            drops[i]++;
            continue;
        }

        if (i === surnameColumn) {
            const index = drops[i] - surnameStartRow;
            if (index >= 0 && index < surname.length) fixedSurname[index] = true;

            ctx.fillStyle = color;
            ctx.fillText(letters[Math.floor(Math.random()*letters.length)], drawX, drawY);

            fixedSurname.forEach((fixed, idx) => {
                if (fixed) {
                    const lx = baseX;
                    const ly = (surnameStartRow + idx) * fontSize;

                    const d = Math.sqrt((mouseX-lx)**2 + (mouseY-ly)**2);

                    let glitch = 0;
                    if (d < fontSize) {
                        glitch = (Math.random()-0.5)*3;
                        lastHoveredLetter = surname[idx];
                    }

                    ctx.fillStyle = d < fontSize ? color : hoverColor;
                    ctx.fillText(surname[idx], lx + glitch, ly);
                }
            });

            drops[i]++;
            continue;
        }

        ctx.fillStyle = color;
        ctx.fillText(letters[Math.floor(Math.random()*letters.length)], drawX, drawY);

        if (baseY > canvas.height && Math.random() > 0.975) drops[i] = 0;

        drops[i]++;
    }
}
setInterval(draw, 33);

// =============================
// GLITCH SULLA "i"
// =============================
function triggerGlitch() {
    const g = document.createElement("div");
    g.style.position = "fixed";
    g.style.top = 0;
    g.style.left = 0;
    g.style.width = "100vw";
    g.style.height = "100vh";
    g.style.background = "white";
    g.style.mixBlendMode = "difference";
    g.style.zIndex = 500;
    g.style.pointerEvents = "none";

    document.body.appendChild(g);
    setTimeout(() => g.remove(), 300);
}

// =============================
// SNAKE GAME (come prima)
// =============================
// (non modificato per brevità, rimane identico al tuo)

// =============================
// SCHERMATA NERA — SERPENTE LENTO
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

    const color = `hsl(${Math.random()*360},100%,50%)`;
    dot.style.background = color;

    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";

    dotsScreen.appendChild(dot);

    const dotObj = {
        el: dot,
        x: e.clientX,
        y: e.clientY,
        exploding: false,
        color: color
    };

    dot.addEventListener("click", ev => {
        ev.stopPropagation();
        explodeDot(dotObj);
    });

    dots.push(dotObj);
}

function explodeDot(dotObj) {
    if (dotObj.exploding) return;
    dotObj.exploding = true;

    const dot = dotObj.el;
    dot.style.transform = "scale(3)";
    dot.style.opacity = "0";

    const rect = dot.getBoundingClientRect();

    for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        p.textContent = Math.random() > 0.5 ? "0" : "1";
        p.style.color = dotObj.color;

        p.style.left = rect.left + "px";
        p.style.top = rect.top + "px";

        dotsScreen.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random()*60;
        const tx = rect.left + Math.cos(angle)*dist;
        const ty = rect.top + Math.sin(angle)*dist;

        p.style.transform = "translate(0,0)";
        requestAnimationFrame(() => {
            p.style.transform = `translate(${tx-rect.left}px, ${ty-rect.top}px)`;
            p.style.opacity = "0";
        });

        setTimeout(() => p.remove(), 700);
    }

    setTimeout(() => {
        dot.remove();
        dots = dots.filter(d => d !== dotObj);
    }, 400);
}

function animateDots() {
    if (!dotsActive) return;

    if (dots.length > 0) {
        const head = dots[0];
        if (!head.exploding) {
            head.x += (mousePosDots.x - head.x) * 0.02; // MOLTO più lento
            head.y += (mousePosDots.y - head.y) * 0.02;
            head.el.style.left = head.x + "px";
            head.el.style.top = head.y + "px";
        }

        for (let i = 1; i < dots.length; i++) {
            const prev = dots[i-1];
            const d = dots[i];
            if (d.exploding) continue;

            d.x += (prev.x - d.x) * 0.1; // segue lentamente
            d.y += (prev.y - d.y) * 0.1;

            d.el.style.left = d.x + "px";
            d.el.style.top = d.y + "px";
        }
    }

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
// CLICK LETTERE
// =============================
canvas.addEventListener("click", () => {
    if (lastHoveredLetter === "e") startSnake();
    if (lastHoveredLetter === "i") triggerGlitch();
    if (lastHoveredLetter === "l") startDotsScreen();
});
