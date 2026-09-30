/* =====================================================
   CCS114 Finals Laboratory 1 - Score Evaluator
   -----------------------------------------------------
   Program flow:
     1. Page loads
     2. alert()   -> welcome message
     3. prompt()  -> ask for the name
     4. prompt()  -> ask for the score
     5. confirm() -> ask if the user wants to continue
     6. Validate the name and the score
     7. evaluateScore() -> decide the remark (if / else if / else)
     8. Display the result on the webpage
   ===================================================== */


/* ---------- Page elements used by the program ---------- */
const resultBox = document.getElementById("result");
const runAgainButton = document.getElementById("runAgainButton");


/* =====================================================
   FUNCTION 1: evaluateScore(score)
   The required function that evaluates the score.
   It receives a NUMBER and returns the remark as text.
   It uses the required conditional branching:
   if, else if, and else.
   ===================================================== */
function evaluateScore(score) {
    // Invalid input: not a number, zero, negative, or beyond 100
    if (typeof score !== "number" || isNaN(score) || score <= 0 || score > 100) {
        return "Invalid score";
    } else if (score >= 90) {
        // 90 - 100
        return "Excellent";
    } else if (score >= 75) {
        // 75 - 89 (anything 90 and up was already handled above)
        return "Passed";
    } else {
        // Valid score below 75
        return "Failed";
    }
}


/* =====================================================
   FUNCTION 2: convertScore(scoreText)
   prompt() always returns TEXT (or null when Cancel is
   pressed), so the text must be converted to a number
   before it can be compared.
   Returns NaN when the text cannot be used as a number.
   ===================================================== */
function convertScore(scoreText) {
    // Cancel (null) or blank/spaces-only input -> no number at all
    // (Number("") would wrongly become 0, so we check this first)
    if (scoreText === null || scoreText.trim() === "") {
        return NaN;
    }

    // "abc" becomes NaN, "95" becomes 95
    return Number(scoreText.trim());
}


/* =====================================================
   FUNCTION 3: getInvalidScoreReason(scoreText, score)
   Explains WHY a score is invalid, so the user knows
   exactly which validation rule was broken.
   ===================================================== */
function getInvalidScoreReason(scoreText, score) {
    if (scoreText === null || scoreText.trim() === "") {
        return "The score is empty. Please enter a number from 1 to 100.";
    } else if (isNaN(score)) {
        return "The score is not a number. Please enter digits only, such as 85.";
    } else if (score === 0) {
        return "A score of zero is not accepted. Please enter a number from 1 to 100.";
    } else if (score < 0) {
        return "A negative score is not accepted. Please enter a number from 1 to 100.";
    } else {
        return "The score is beyond 100. The highest accepted score is 100.";
    }
}


/* =====================================================
   FUNCTION 4: getRemarkMessage(remark)
   Returns the short message and the color class that
   match the remark.
   ===================================================== */
function getRemarkMessage(remark) {
    if (remark === "Excellent") {
        return {
            statusClass: "result-excellent",
            message: "Outstanding work! You reached the highest level."
        };
    } else if (remark === "Passed") {
        return {
            statusClass: "result-passed",
            message: "Congratulations! You passed. Keep it up."
        };
    } else if (remark === "Failed") {
        return {
            statusClass: "result-failed",
            message: "You did not reach the passing score of 75. Review and try again."
        };
    } else {
        return {
            statusClass: "result-invalid",
            message: "The score you entered is not valid."
        };
    }
}


/* =====================================================
   FUNCTION 5: showResult(options)
   Displays the output inside the result section of the
   page. textContent is used (not innerHTML) so anything
   the user types is shown as plain text and never run
   as HTML.
   options = { statusClass, headline, details, message }
     - details is a list of [label, value] pairs (optional)
   ===================================================== */
function showResult(options) {
    // Clear the old result and apply the new color class
    resultBox.innerHTML = "";
    resultBox.className = "result " + options.statusClass;

    // Optional big heading (used for cancelled / invalid name)
    if (options.headline) {
        const headline = document.createElement("p");
        headline.className = "result-remark-text";
        headline.textContent = options.headline;
        resultBox.appendChild(headline);
    }

    // Optional Name / Score / Remark rows
    if (options.details) {
        const list = document.createElement("dl");
        list.className = "result-details";

        for (const [label, value] of options.details) {
            const row = document.createElement("div");
            row.className = "result-row";
            if (label === "Remark") {
                row.classList.add("remark-row"); // makes the remark stand out
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

    // Short message that matches the remark
    const message = document.createElement("p");
    message.className = "result-message";
    message.textContent = options.message;
    resultBox.appendChild(message);
}


/* =====================================================
   MAIN FUNCTION: startProgram()
   Runs the whole program from start to finish.
   ===================================================== */
function startProgram() {
    // Show a waiting message while the dialogs are open
    showResult({
        statusClass: "result-waiting",
        headline: "Waiting for your input...",
        message: "Please answer the pop-up dialogs from the browser."
    });

    // STEP 1: alert() - welcome message
    alert("Welcome to the Score Evaluator!");

    // STEP 2: prompt() - ask for the name (returns null if Cancel is pressed)
    const nameInput = prompt("Please enter your name:");

    // STEP 3: prompt() - ask for the score (returns text, or null on Cancel)
    const scoreInput = prompt("Please enter your score (1 - 100):");

    // STEP 4: confirm() - ask if the user wants to continue
    const wantsToContinue = confirm("Do you want to continue and see your result?");

    // If the user pressed Cancel, stop politely and show a message on the page
    if (wantsToContinue === false) {
        showResult({
            statusClass: "result-cancelled",
            headline: "Cancelled",
            message: "You chose not to continue, so no result was generated. Click \"Run again\" to try again."
        });
        return;
    }

    // STEP 5: VALIDATION - name
    // trim() removes spaces, so a name with only spaces counts as empty.
    // (nameInput is null when Cancel is pressed on the prompt.)
    const name = (nameInput === null) ? "" : nameInput.trim();
    const scoreText = (scoreInput === null) ? "" : scoreInput.trim();
    const scoreShown = (scoreText === "") ? "(empty)" : scoreText;

    if (name === "") {
        showResult({
            statusClass: "result-invalid",
            details: [
                ["Name", "(empty)"],
                ["Score", scoreShown],
                ["Remark", "Invalid name"]
            ],
            message: "The name is empty. Please enter your name, then click \"Run again\"."
        });
        return;
    }

    // STEP 6: VALIDATION - score
    // Convert the text to a number, then let evaluateScore() decide.
    const score = convertScore(scoreInput);

    // STEP 7: call the evaluation function
    const remark = evaluateScore(score);

    // STEP 8: pick the message for the remark
    const remarkInfo = getRemarkMessage(remark);
    let finalMessage = remarkInfo.message;

    // For an invalid score, explain exactly what was wrong
    if (remark === "Invalid score") {
        finalMessage = getInvalidScoreReason(scoreInput, score);
    }

    // STEP 9: display the final result on the webpage
    showResult({
        statusClass: remarkInfo.statusClass,
        details: [
            ["Name", name],
            ["Score", scoreShown],
            ["Remark", remark]
        ],
        message: finalMessage
    });
}


/* =====================================================
   EVENTS
   ===================================================== */

// Run the program automatically when the page has finished loading.
// The short delay lets the page appear first, so the dialogs
// do not open over a blank screen.
window.addEventListener("load", function () {
    setTimeout(startProgram, 300);
});

// Let the user run the program again without refreshing the page
runAgainButton.addEventListener("click", startProgram);