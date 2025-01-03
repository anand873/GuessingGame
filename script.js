let userScore = 0;
    let playerScores = [0, 0, 0, 0];  // Player 2 to Player 5
    let round = 1;
    let roundGuesses = [];

    function randomGuess() {
      return Math.floor(Math.random() * 100) + 1;
    }

    function calculateScore(guess, mean) {
      return Math.abs(guess - mean);
    }

    function updateScores(roundScores) {
      let mean = roundScores.reduce((a, b) => a + b, 0) / 5;
  
      // Calculate the user's score and other players' scores
      let userDiff = calculateScore(roundScores[0], mean);
      let playerDiffs = roundScores.slice(1).map(score => calculateScore(score, mean));

      // Update the player's score
      userScore += userDiff;
      playerScores = playerScores.map((score, index) => score + playerDiffs[index]);

      // Display the average for the round
      document.getElementById("round-average").textContent = `Round Average: ${mean.toFixed(1)}`;

      // Add this round's guesses to the round guess table
      roundGuesses.push([round, ...roundScores]);
      updateRoundGuessTable();

      // Update current scores at the bottom of the table
      updateCurrentScores();
    }

    function updateRoundGuessTable() {
      const tableBody = document.getElementById("round-guesses");
      const newRow = document.createElement("tr");
      newRow.classList.add("fade-in-row"); // Apply fade-in animation to the new row

      const rowData = roundGuesses[round - 1]; // Get the last round's data

      rowData.forEach((data) => {
        const cell = document.createElement("td");
        cell.textContent = data;
        newRow.appendChild(cell);
      });

      tableBody.appendChild(newRow); // Append the new row with animation
    }

    function updateCurrentScores() {
      // Update current scores for each player
      document.getElementById("user-score").textContent = userScore.toFixed(1);
      playerScores.forEach((score, index) => {
        document.getElementById(`player-${index + 2}-score`).textContent = score.toFixed(1);
      });
    }

    function submitGuess() {
      if (round > 5) {
        return; // Do nothing if the game has ended
      }

      let userGuess = parseInt(document.getElementById("user-guess").value);
      if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        alert("Please enter a valid number between 1 and 100.");
        return;
      }

      // Create the round scores array (user guess + 4 random player guesses)
      let roundScores = [
        userGuess,          // User guess
        randomGuess(),      // Player 2 guess
        randomGuess(),      // Player 3 guess
        randomGuess(),      // Player 4 guess
        randomGuess()       // Player 5 guess
      ];

      updateScores(roundScores); // Pass the roundScores array to updateScores

      // Update the round number
      round++;
      if (round <= 5) {
        document.getElementById("round-number").textContent = `Round: ${round}`;
      }

      // Clear the input field
      document.getElementById("user-guess").value = '';

      // End game after 5 rounds
      if (round > 5) {
        displayWinner();
      }
    }

    function displayWinner() {
  // Find the player with the lowest score
  let scores = [userScore, ...playerScores];
  let minScore = Math.min(...scores);
  let winnerIndex = scores.indexOf(minScore);

  let winnerName = winnerIndex === 0 ? "You" : [
    "Captain Clutch", 
    "Guessmaster General", 
    "Numinator", 
    "The Intuitor"
  ][winnerIndex - 1];

  // Create the winner message with "Congratulations" or "Better luck next time"
  let winnerMessage = winnerIndex === 0 
    ? `Congratulations! You win with a score of ${minScore.toFixed(1)}!<br><br>Final Scores:<br><br>`
    : `Better luck next time! ${winnerName} wins with a score of ${minScore.toFixed(1)}!<br><br>Final Scores:<br><br>`;
  
  // Add all players' scores to the message
  winnerMessage += `You: ${userScore.toFixed(1)}<br>`;
  playerScores.forEach((score, index) => {
    winnerMessage += `${[
      "Captain Clutch", 
      "Guessmaster General", 
      "Numinator", 
      "The Intuitor"
    ][index]}: ${score.toFixed(1)}<br>`;
  });

  // Update the modal with winner and final scores
  document.getElementById("modal-winner").innerHTML = winnerMessage;

  // Show the overlay with the winner message
  document.getElementById("game-over-overlay").style.display = "flex"; 
  document.querySelector(".button").disabled = true; // Disable button after game ends
}

    function playAgain() {
  // Reset the game state
  userScore = 0;
  playerScores = [0, 0, 0, 0];
  round = 1;
  roundGuesses = [];

  // Reset the displayed round number and other texts
  document.getElementById("round-number").textContent = `Round: 1`;
  document.getElementById("round-average").textContent = '';
  document.getElementById("winner").textContent = '';

  // Hide the game over overlay
  document.getElementById("game-over-overlay").style.display = "none"; 
  
  // Enable the button again
  document.querySelector(".button").disabled = false; 

  // Reset the round guess table
  const tableBody = document.getElementById("round-guesses");
  tableBody.innerHTML = '';  // Clear the previous guesses

  // Reset current scores
  updateCurrentScores(); // Reset current scores
}

    // Add functionality to submit guess on Enter key
    document.getElementById("user-guess").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        submitGuess();
      }
    });