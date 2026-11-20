let answer = [];
let guesses = [];
let gameOver = false;

const form = document.getElementById("guessForm");
const input = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

// 1. 讓電腦產生答案：數字不重複，允許 0 開頭。
function generateAnswer() {
    let numbers = [];

    while (numbers.length < 4) {
        let number = Math.floor(Math.random() * 10);
        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    }

    return numbers;
}

// 2. 檢查輸入：只能是四個不重複的數字。
function validateInput(value) {
    if (!/^[0-9]{4}$/.test(value)) {
        return false;
    }

    for (let i = 0; i < value.length; i++) {
        for (let j = i + 1; j < value.length; j++) {
            if (value[i] === value[j]) {
                return false;
            }
        }
    }

    return true;
}

// 3. 數字與位置都對算 A；只有數字對算 B。
function checkGuess(value) {
    let numbers = value.split("").map(Number);
    let A = 0;
    let B = 0;

    for (let i = 0; i < 4; i++) {
        if (answer[i] === numbers[i]) {
            A++;
        } else if (answer.includes(numbers[i])) {
            B++;
        }
    }

    return { A, B };
}

// 4. 依猜測順序顯示紀錄。
function renderHistory() {
    historyList.innerHTML = "";
    emptyHistory.hidden = guesses.length > 0;

    guesses.forEach(function(item) {
        let row = document.createElement("li");
        row.textContent = item.guess + " → " + item.A + "A" + item.B + "B";
        historyList.appendChild(row);
    });
}

function updateButton() {
    guessButton.disabled = gameOver || !validateInput(input.value);
}

// 5. 送出猜測：驗證 → 計算 → 記錄 → 判斷是否結束。
function submitGuess() {
    if (gameOver) {
        return;
    }

    let value = input.value;
    if (!validateInput(value)) {
        message.textContent = "請輸入四個不重複的數字！";
        return;
    }

    let result = checkGuess(value);
    guesses.push({ guess: value, A: result.A, B: result.B });
    renderHistory();

    if (result.A === 4) {
        gameOver = true;
        message.textContent = "恭喜答對！總共猜了 " + guesses.length + " 次！";
        input.disabled = true;
        restartButton.focus();
    } else {
        message.textContent = "本次結果：" + result.A + "A" + result.B + "B";
        input.value = "";
        input.focus();
    }

    updateButton();
}

// 6. 重新開始：產生新答案，還原所有畫面與狀態。
function resetGame() {
    answer = generateAnswer();
    guesses = [];
    gameOver = false;
    input.value = "";
    input.disabled = false;
    message.textContent = "請輸入四個不重複的數字，開始猜測！";
    renderHistory();
    updateButton();
    input.focus();
}

// 7. 表單支援按鈕與 Enter 送出。
form.addEventListener("submit", function(event) {
    event.preventDefault();
    submitGuess();
});

input.addEventListener("input", function() {
    updateButton();

    if (input.value === "") {
        message.textContent = "請輸入四個不重複的數字，開始猜測！";
    } else if (!/^[0-9]{1,4}$/.test(input.value)) {
        message.textContent = "只能輸入 0～9 的數字，總共四位。";
    } else if (input.value.length < 4) {
        message.textContent = "還需要輸入 " + (4 - input.value.length) + " 個數字。";
    } else if (!validateInput(input.value)) {
        message.textContent = "數字不能重複，請重新輸入！";
    } else {
        message.textContent = "可以送出猜測了！";
    }
});

restartButton.addEventListener("click", resetGame);
resetGame();
