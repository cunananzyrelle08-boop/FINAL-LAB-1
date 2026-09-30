/* =====================================================
   CCS114 Finals Laboratory 1 - Score Evaluator
   -----------------------------------------------------
   Program flow:
     1. Page loads
     2. alert()   -> welcome message
     3. prompt()  -> ask for the name & validate immediately
     4. prompt()  -> ask for the score & validate immediately
     5. confirm() -> ask if the user wants to continue
     6. evaluateScore() -> decide the remark (if / else if / else)
     7. Display the result on the webpage
   ===================================================== */

/* ---------- Page elements used by the program ---------- */
const resultBox = document.getElementById("result");
const runAgainButton = document.getElementById("runAgainButton");

/* =====================================================
   FUNCTION 1: evaluateScore(score)
   The required function that evaluates the score.
   ===================================================== */
function evaluateScore(score) {
  if (typeof score !== "number" || isNaN(score) || score <= 0 || score > 100) {
    return "Invalid score";
  } else if (score >= 90) {
    return "Excellent";
  } else if (score >= 75) {
    return "Passed";
  } else {
    return "Failed";
  }
}

/* =====================================================
   FUNCTION 2: convertScore(scoreText)
   Converts prompt text to a number.
   ===================================================== */
function convertScore(scoreText) {
  if (scoreText === null || scoreText.trim() === "") {
    return NaN;
  }
  return Number(scoreText.trim());
}

/* =====================================================
   FUNCTION 3: getInvalidScoreReason(scoreText, score)
   Explains WHY a score is invalid for page display.
   ===================================================== */
function getInvalidScoreReason(scoreText, score) {
  if (scoreText === null || scoreText.trim() === "") {
    return "Error: Empty score input. Please enter a valid number from 1 to 100.";
  } else if (isNaN(score)) {
    return "Error: Non-numeric input detected. Please enter digits only (e.g., 85).";
  } else if (score === 0) {
    return "Error: A score of zero (0) is invalid. Please enter a score between 1 and 100.";
  } else if (score < 0) {
    return "Error: Negative scores are not allowed. Please enter a positive score.";
  } else {
    return "Error: Score exceeds maximum limit (100). The valid range is 1 to 100.";
  }
}

/* =====================================================
   FUNCTION 4: getRemarkMessage(remark)
   ===================================================== */
function getRemarkMessage(remark) {
  if (remark === "Excellent") {
    return {
      statusClass: "result-excellent",
      message: "Outstanding work! You reached the highest level.",
    };
  } else if (remark === "Passed") {
    return {
      statusClass: "result-passed",
      message: "Congratulations! You passed. Keep it up.",
    };
  } else if (remark === "Failed") {
    return {
      statusClass: "result-failed",
      message:
        "You did not reach the passing score of 75. Review and try again.",
    };
  } else {
    return {
      statusClass: "result-invalid",
      message: "The score you entered is not valid.",
    };
  }
}

/* =====================================================
   FUNCTION 5: showResult(options)
   ===================================================== */
function showResult(options) {
  resultBox.innerHTML = "";
  resultBox.className = "result " + options.statusClass;

  if (options.headline) {
    const headline = document.createElement("p");
    headline.className = "result-remark-text";
    headline.textContent = options.headline;
    resultBox.appendChild(headline);
  }

  if (options.details) {
    const list = document.createElement("dl");
    list.className = "result-details";

    for (const [label, value] of options.details) {
      const row = document.createElement("div");
      row.className = "result-row";
      if (label === "Remark") {
        row.classList.add("remark-row");
      }

      const term = document.createElement("dt");
      term.textContent = label + ":";

      const description = document.createElement("dd");
      description.textContent = value;

      row.appendChild(term);
      row.appendChild(description);
      list.appendChild(row);
    }
    resultBox.appendChild(list);
  }

  const message = document.createElement("p");
  message.className = "result-message";
  message.textContent = options.message;
  resultBox.appendChild(message);
}

/* =====================================================
   MAIN FUNCTION: startProgram()
   ===================================================== */
function startProgram() {
  showResult({
    statusClass: "result-waiting",
    headline: "Waiting for your input...",
    message: "Please answer the pop-up dialogs from the browser.",
  });

  // STEP 1: Welcome alert
  alert("Welcome to the Score Evaluator!");

  // STEP 2: Name prompt + IMMEDIATE VALIDATION
  const nameInput = prompt("Please enter your name:");
  const name = nameInput === null ? "" : nameInput.trim();

  if (name === "") {
    alert("Validation Error: Name cannot be empty!");
    showResult({
      statusClass: "result-invalid",
      details: [
        ["Name", "(empty)"],
        ["Score", "N/A"],
        ["Remark", "Invalid name"],
      ],
      message:
        'The name is empty. Please enter your name, then click "Run again".',
    });
    return; // Stop immediately, do not prompt for score
  }

  // STEP 3: Score prompt + IMMEDIATE VALIDATION
  const scoreInput = prompt("Please enter your score (1 - 100):");
  const scoreText = scoreInput === null ? "" : scoreInput.trim();
  const scoreShown = scoreText === "" ? "(empty)" : scoreText;
  const score = convertScore(scoreInput);

  if (scoreInput === null || scoreInput.trim() === "") {
    alert("Validation Error: Score input cannot be empty!");
  } else if (isNaN(score)) {
    alert("Validation Error: Please enter a valid numeric score!");
  } else if (score === 0) {
    alert("Validation Error: Zero is an invalid score entry!");
  } else if (score < 0) {
    alert("Validation Error: Score cannot be negative!");
  } else if (score > 100) {
    alert("Validation Error: Score cannot exceed 100!");
  }

  // If score validation fails, stop before showing confirmation dialog
  if (isNaN(score) || score <= 0 || score > 100) {
    showResult({
      statusClass: "result-invalid",
      details: [
        ["Name", name],
        ["Score", scoreShown],
        ["Remark", "Invalid score"],
      ],
      message: getInvalidScoreReason(scoreInput, score),
    });
    return; // Stop immediately, do not prompt for confirmation
  }

  // STEP 4: Confirmation dialog (only reached if inputs are valid)
  const wantsToContinue = confirm(
    "Do you want to continue and see your result?",
  );

  if (wantsToContinue === false) {
    showResult({
      statusClass: "result-cancelled",
      headline: "Cancelled",
      message:
        'You chose not to continue, so no result was generated. Click "Run again" to try again.',
    });
    return;
  }

  // STEP 5: Evaluate & Display Result
  const remark = evaluateScore(score);
  const remarkInfo = getRemarkMessage(remark);

  showResult({
    statusClass: remarkInfo.statusClass,
    details: [
      ["Name", name],
      ["Score", scoreShown],
      ["Remark", remark],
    ],
    message: remarkInfo.message,
  });
}

/* =====================================================
   EVENTS
   ===================================================== */
window.addEventListener("load", function () {
  setTimeout(startProgram, 300);
});

runAgainButton.addEventListener("click", startProgram);