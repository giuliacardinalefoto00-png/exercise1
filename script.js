const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// colori
const color = "#00ff00";      // verde al passaggio
const hoverColor = "#b300ff"; // viola di base

// dimensione pioggia e nome (uguali)
const fontSize = 16;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", () => {
    resizeCanvas();
    initDrops();
});

const letters = "01";
let columns = Math.floor(window.innerWidth / fontSize);

let drops = [];

// posizione del mouse
let mouseX = -1000;
let mouseY = -1000;

// raggio di influenza
const mouseRadius = 140;

// ascolto movimento mouse
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener("mouseleave", () => {
    mouseX = -1000;
    mouseY = -1000;
});

function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}

initDrops();

// --- TESTO FISSO IN VERTICALE ---
const name = "giulia".split("");
const surname = "cardinale".split("");

// colonne dove appariranno
const nameColumn = 10;
const surnameColumn = 20;

// riga di partenza
const nameStartRow = 10;
const surnameStartRow = 10;

// memorizza le lettere già formate
let fixedName = Array(name.length).fill(false);
let fixedSurname = Array(surname.length).fill(false);

// memorizza quale lettera è sotto il cursore
let lastHoveredLetter = null;

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    lastHoveredLetter = null;

    for (let i = 0; i < drops.length; i++) {
        const baseX = i * fontSize;
        const baseY = drops[i] * fontSize;

        // distanza dal cursore
        const dx = mouseX - baseX;
        const dy = mouseY - baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // posizione modificata dal cursore
        let drawX = baseX;
        let drawY = baseY;

        if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            drawX += dx * force * 1.2;
            drawY += dy * force * 1.2;
            ctx.shadowBlur = 60;
        } else {
            ctx.shadowBlur = 10;
        }

        // --- NOME ---
        if (i === nameColumn) {
            const index = drops[i] - nameStartRow;

            if (index >= 0 && index < name.length) {
                fixedName[index] = true;
            }

            ctx.fillStyle = color;
            const rainChar = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(rainChar, drawX, drawY);

            fixedName.forEach((fixed, idx) => {
                if (fixed) {
                    const letterX = baseX;
                    const letterY = (nameStartRow + idx) * fontSize;

                    const distToLetter = Math.sqrt(
                        (mouseX - letterX) ** 2 +
                        (mouseY - letterY) ** 2
                    );

                    // GLITCH leggero
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

            if (index >= 0 && index < surname.length) {
                fixedSurname[index] = true;
            }

            ctx.fillStyle = color;
            const rainChar = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(rainChar, drawX, drawY);

            fixedSurname.forEach((fixed, idx) => {
                if (fixed) {
                    const letterX = baseX;
                    const letterY = (surnameStartRow + idx) * fontSize;

                    const distToLetter = Math.sqrt(
                        (mouseX - letterX) ** 2 +
                        (mouseY - letterY) ** 2
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
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, drawX, drawY);

        if (baseY > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(draw, 33);
