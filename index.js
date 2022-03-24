// Time limit of each test
let TIME_LIMIT = 5;

// Quotes to be used
let quotesArray = [
    "Push yourself, because no one else is going to do it for you.",
    "Failure is the condiment that gives success its flavor.",
    "Wake up with determination. Go to bed with satisfaction.",
    "It's going to be hard, but hard does not mean impossible.",
    "Learning never exhausts the mind.",
    "The only way to do great work is to love what you do."
];

// Select all elements which will be modified by JS
let timerText = document.querySelector("#currTime");
let accuracyText = document.querySelector("#currAccuracy");
let errorText = document.querySelector("#currErrors");
let cpmText = document.querySelector("#currCpm");
let wpmText = document.querySelector("#currWpm");
let quoteText = document.querySelector("#quote");
let inputArea = document.querySelector("#inputArea");
let restartBtn = document.querySelector("#restartBtn");
let cpmGroup = document.querySelector("#cpm");
let wpmGroup = document.querySelector("#wpm");
let errorGroup = document.querySelector("#errors");
let accuracyGroup = document.querySelector("#accuracy");

// Add event listeners on load
window.onload = () => {

    // Allow input area to process the current quote
    inputArea.addEventListener('input', processCurrentText);

    // Game starts when inputArea comes in focus
    inputArea.addEventListener('focus', startGame);

    // Reset values on click of the Restart button
    restartBtn.addEventListener('click', resetValues);
}

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;

// Total errors in up until then
let totalErrors = 0;

// Errors in current quote
let errors = 0;
let accuracy = 0;

// Number of characters type for current quote
let characterTyped = 0;
let currentQuote = "";
let quoteNo = 0;
let timer = null;

function startGame() {

    resetValues();
    updateQuote();

    inputArea.removeEventListener('focus', startGame);

    // Clear timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function resetValues() {
    timeLeft = TIME_LIMIT;
    timeElapsed = 0;
    errors = 0;
    totalErrors = 0;
    accuracy = 0;
    characterTyped = 0;
    quoteNo = 0;

    // Enabling input area and making it visible on the page
    inputArea.disabled = false;
    inputArea.style.display = "block";

    // Adding event listener to start game on focus
    inputArea.addEventListener('focus', startGame);

    inputArea.value = "";
    quoteText.textContent = 'Click on the area below to start the game.';
    accuracyText.textContent = 100;
    timerText.textContent = timeLeft + 's';
    errorText.textContent = 0;
    restartBtn.style.display = "none";
    cpmGroup.style.display = "none";
    wpmGroup.style.display = "none";
}

function updateQuote() {
    quoteText.textContent = null;
    currentQuote = quotesArray[quoteNo];

    // Separate each character and make an element out of each of them to individually style them
    currentQuote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        quoteText.appendChild(charSpan)
    })

    // Roll over to the first quote in case someone is as quick as Superman and finished typing all quotes
    if (quoteNo < quotesArray.length - 1)
        quoteNo++;
    else
        quoteNo = 0;
}

function processCurrentText() {

    // Get current input text and split it
    currInput = inputArea.value;
    currInputArray = currInput.split('');

    // Increment total characters typed
    characterTyped++;

    errors = 0;

    quoteSpanArray = quoteText.querySelectorAll('span');
    quoteSpanArray.forEach((char, index) => {
        let typedChar = currInputArray[index]

        // Character not currently typed
        if (typedChar == null) {
            char.classList.remove('correctChar');
            char.classList.remove('incorrectChar');
        }

        // Correct character
        else if (typedChar === char.innerText) {
            char.classList.add('correctChar');
            char.classList.remove('incorrectChar');
        }

        // Incorrect character
        else {
            char.classList.add('incorrectChar');
            char.classList.remove('correctChar');

            // Increment number of errors
            errors++;
        }
    });

    // Display the number of errors
    errorText.textContent = totalErrors + errors;

    // Update accuracy text
    let correctCharacters = (characterTyped - (totalErrors + errors));
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracyText.textContent = Math.round(accuracyVal);

    // If current text is completely typed irrespective of errors
    if (currInput.length == currentQuote.length) {
        updateQuote();

        // Update total errors
        totalErrors += errors;

        // Clear the input area
        inputArea.value = "";
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        // Decrease the current time left
        timeLeft--;

        // Increase the time elapsed
        timeElapsed++;

        // Update the timer text
        timerText.textContent = timeLeft + "s";
    }
    else {
        // Finish the game
        finishGame();
    }
}

function finishGame() {
    // Stop the timer
    clearInterval(timer);

    // Disable the input area and hide it
    inputArea.disabled = true;
    inputArea.style.display = "none";

    // Show finishing text
    quoteText.textContent = "Click on restart to start a new game.";

    // Display restart button
    restartBtn.style.display = "block";

    // Calculate cpm and wpm
    cpm = Math.round(((characterTyped / timeElapsed) * 60));
    wpm = Math.round((((characterTyped / 5) / timeElapsed) * 60));

    // Update cpm and wpm text
    cpmText.textContent = cpm;
    wpmText.textContent = wpm;

    // Display the cpm and wpm
    cpmGroup.style.display = "block";
    wpmGroup.style.display = "block";

}