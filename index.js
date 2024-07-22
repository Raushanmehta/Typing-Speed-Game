const typingText = document.querySelector(".typingText p");
const input = document.querySelector(".input-field");
const timeDisplay = document.querySelector(".time b");
const mistakeDisplay = document.querySelector(".mistake span");
const wpmDisplay = document.querySelector(".wpm span");
const cpmDisplay = document.querySelector(".cpm span");
const startBtn = document.querySelector("#start");
const restartBtn = document.querySelector("#restart");
const settingsBtn = document.querySelector("#settings");
const settingsModal = document.querySelector("#settingsModal");
const closeModalBtn = document.querySelector(".close");
const saveSettingsBtn = document.querySelector("#saveSettings");
const timeInput = document.querySelector("#timeInput");

let timerInterval;
let timeLeft = 60; // Default time in seconds
let mistakes = 0;
let typedChars = 0;
let correctChars = 0;

function loadParagraph() {
    const paragraphs = [
        "India is a beautiful country and famous all over the world for its unique cultures and traditions. It is famous for its historical heritages and monuments. Citizens here are very polite and understanding in nature. It was a slave country earlier to 1947 under British rule."
    ];
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    const paragraph = paragraphs[randomIndex];

    typingText.innerHTML = ''; // Clear previous content
    for (const char of paragraph) {
        typingText.innerHTML += `<span>${char === ' ' ? '&nbsp;' : char}</span>`;
    }

    // Add 'active' class to the first span
    const spans = typingText.querySelectorAll('span');
    if (spans.length > 0) {
        spans[0].classList.add('active');
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        calculateResults();
        input.disabled = true;
    }
}

function calculateResults() {
    const totalChars = typingText.textContent.length;
    const wordsTyped = Math.round(correctChars / 5);
    const minutes = (parseInt(timeInput.value) || 60) / 60; // Use the initial set time in seconds
    const wpm = Math.round(wordsTyped / minutes);
    const cpm = Math.round(typedChars / minutes);

    wpmDisplay.textContent = wpm;
    cpmDisplay.textContent = cpm;
}

function handleInput(event) {
    const typedText = input.value;
    const spans = typingText.querySelectorAll('span');
    let correct = true;

    for (let i = 0; i < typedText.length; i++) {
        const span = spans[i];
        const char = typedText[i];

        if (i < spans.length) {
            if (char === span.textContent || (char === ' ' && span.innerHTML === '&nbsp;')) {
                span.classList.add('active');
                correctChars++;
            } else {
                span.classList.remove('active');
                mistakes++;
                correct = false;
            }
            typedChars++;
        }
    }

    if (typedText.length > spans.length) {
        mistakes += typedText.length - spans.length;
    }

    mistakeDisplay.textContent = mistakes;
}

function startTest() {
    input.value = '';
    input.disabled = false;
    mistakes = 0;
    typedChars = 0;
    correctChars = 0;
    timeLeft = parseInt(timeInput.value) || 60; // Use the time from the input or default to 60
    timeDisplay.textContent = `${timeLeft}s`;
    mistakeDisplay.textContent = mistakes;
    wpmDisplay.textContent = 0;
    cpmDisplay.textContent = 0;

    loadParagraph();
    clearInterval(timerInterval); // Clear any existing timer
    startTimer();
}

function openSettings() {
    settingsModal.style.display = "block";
}

function closeSettings() {
    settingsModal.style.display = "none";
}

// Event listeners
startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', startTest);
settingsBtn.addEventListener('click', openSettings);
closeModalBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', () => {
    timeLeft = parseInt(timeInput.value) || 60; // Update timeLeft with new value
    timeDisplay.textContent = `${timeLeft}s`;
    closeSettings();
});
input.addEventListener('input', handleInput);
