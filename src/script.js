const fruits = ["🍒", "🍋", "🍇", "🍉", "🍎"];
const slots = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3"),
];
const startBtn = document.getElementById("startBtn");
const resultDiv = document.getElementById("result");
const balanceDiv = document.getElementById("balance");
const body = document.body;

let balance = 50;

function updateBalanceDisplay() {
    balanceDiv.textContent = `Balance: $${balance}`;
    startBtn.disabled = balance < 1;
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function createReelContent() {
    return Array.from(
        { length: 20 },
        () => `<div class="digit">${getRandomFruit()}</div>`,
    ).join("");
}

function startSpinning() {
    if (balance < 1) return;

    balance -= 1;
    updateBalanceDisplay();

    resultDiv.textContent = "";
    resultDiv.classList.remove("blink");
    body.classList.remove("flash-win");
    startBtn.disabled = true;

    slots.forEach((slot) => {
        const reel = slot.querySelector(".reel");
        reel.innerHTML = createReelContent();
        reel.style.top = "0";
        reel.style.animation = "spin 0.2s linear infinite";
        reel.style.animationDuration = "0.2s";
    });

    setTimeout(() => {
        slots.forEach((slot) => {
            const reel = slot.querySelector(".reel");
            reel.style.animationDuration = "0.5s";
        });
    }, 500);

    [0, 1, 2].forEach((index, i) => {
        setTimeout(
            () => {
                const slot = slots[index];
                const reel = slot.querySelector(".reel");
                reel.style.animation = "none";
                const fruit = getRandomFruit();
                reel.innerHTML = `<div class="digit">${fruit}</div>`;
                reel.style.top = "0";

                if (i === 2) {
                    setTimeout(checkWin, 200);
                }
            },
            1000 + i * 500,
        );
    });
}

function checkWin() {
    const results = slots.map(
        (slot) => slot.querySelector(".digit").textContent,
    );
    if (results[0] === results[1] && results[1] === results[2]) {
        resultDiv.textContent = "🎉 YOU WIN!";
        resultDiv.classList.add("blink");
        balance += 20;
        updateBalanceDisplay();

        body.classList.add("flash-win");
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
        });
    } else {
        resultDiv.textContent = "NO MATCH";
    }

    startBtn.disabled = balance < 1;
}

startBtn.addEventListener("click", startSpinning);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !startBtn.disabled) {
        event.preventDefault();
        startSpinning();
    }
});

updateBalanceDisplay();
