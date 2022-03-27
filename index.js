// Time limit of each test
let TIME_LIMIT = 60;

// Quotes to be used
let quotesArray = [
  "When you have a dream, you've got to grab it and never let go.",
  "Nothing is impossible. The word itself says 'I'm possible!'",
  "There is nothing impossible to they who will try.",
  "The bad news is time flies. The good news is you're the pilot.",
  "Life has got all those twists and turns. You've got to hold on tight and off you go.",
  "Keep your face always toward the sunshine, and shadows will fall behind you.",
  "Be courageous. Challenge orthodoxy. Stand up for what you believe in. When you are in your rocking chair talking to your grandchildren many years from now, be sure you have a good story to tell.",
  "You make a choice: continue living your life feeling muddled in this abyss of self-misunderstanding, or you find your identity independent of it. You draw your own box.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "You define your own life. Don't let other people write your script.",
];

// Select all elements which will be modified by JS
// Timer
let timerText = document.querySelector("#currTime");

// Refreshed after every character input -
// Accuracy
let accuracyText = document.querySelector("#currAccuracy");
// Errors
let errorText = document.querySelector("#currErrors");

// Refreshed after every quote -
// Quote text
let quoteText = document.querySelector("#quote");
// Input area where the test data is typed by the taker
let inputArea = document.querySelector("#inputArea");

// Refreshed after test completion -
// Characters per minute
let cpmText = document.querySelector("#currCpm");
// Words per minute
let wpmText = document.querySelector("#currWpm");
// Restart button to clear stuff on the page - After test completion
let restartBtn = document.querySelector("#restartBtn");
// The entire DOM (div) where CPM is shown
let cpmGroup = document.querySelector("#cpm");
// The entire DOM (div) where WPM is shown
let wpmGroup = document.querySelector("#wpm");

// Add event listeners on load
window.onload = () => {
  // Allow input area to process the current quote
  inputArea.addEventListener("input", processCurrentText);

  // Game starts when inputArea comes in focus
  inputArea.addEventListener("focus", startGame);

  // Reset values on click of the Restart button
  restartBtn.addEventListener("click", resetValues);
};

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;

// Total errors (till current character input)
let totalErrors = 0;

// Errors till current quote
let errors = 0;

// Accuracy till current quote
let accuracy = 0;

// Number of characters typed for current quote
let characterTyped = 0;
let currentQuote = "";
let quoteNo = 0;
let timer = null;

function startGame() {
  resetValues();
  updateQuote();

  inputArea.removeEventListener("focus", startGame);

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
  inputArea.addEventListener("focus", startGame);

  inputArea.value = "";
  quoteText.textContent = "Click on the area below to start the game.";
  accuracyText.textContent = 100;
  timerText.textContent = timeLeft + "s";
  errorText.textContent = 0;
  restartBtn.style.display = "none";
  cpmGroup.style.display = "none";
  wpmGroup.style.display = "none";
}

function updateQuote() {
  quoteText.textContent = null;
  currentQuote = quotesArray[quoteNo];

  // Separate each character and make an element out of each of them to individually style them
  currentQuote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    quoteText.appendChild(charSpan);
  });

  // Roll over to the first quote in case someone is as quick as Superman and finished typing all quotes
  if (quoteNo < quotesArray.length - 1) quoteNo++;
  else quoteNo = 0;
}

function processCurrentText() {
  // Get current input text and split it
  currInput = inputArea.value;
  currInputArray = currInput.split("");

  // Increment total characters typed
  characterTyped++;

  errors = 0;

  quoteSpanArray = quoteText.querySelectorAll("span");
  quoteSpanArray.forEach((char, index) => {
    let typedChar = currInputArray[index];

    // Character not currently typed
    if (typedChar == null) {
      char.classList.remove("correctChar");
      char.classList.remove("incorrectChar");
    }

    // Correct character
    else if (typedChar === char.innerText) {
      char.classList.add("correctChar");
      char.classList.remove("incorrectChar");
    }

    // Incorrect character
    else {
      char.classList.add("incorrectChar");
      char.classList.remove("correctChar");

      // Increment number of errors
      errors++;
    }
  });

  // Display the number of errors
  errorText.textContent = totalErrors + errors;

  // Update accuracy text
  let correctCharacters = characterTyped - (totalErrors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
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
  } else {
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
  cpm = Math.round((characterTyped / timeElapsed) * 60);
  wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);

  // Update cpm and wpm text
  cpmText.textContent = cpm;
  wpmText.textContent = wpm;

  // Display the cpm and wpm
  cpmGroup.style.display = "block";
  wpmGroup.style.display = "block";
}
