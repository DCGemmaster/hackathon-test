document.addEventListener('DOMContentLoaded', () => {
  let balance = 100;
  let currentBet = 0;
  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let gameOver = false;

  const balanceElement = document.getElementById('balance');
  const placeBetButton = document.getElementById('place-bet');
  const hitButton = document.getElementById('hit-button');
  const standButton = document.getElementById('stand-button');
  const playAgainButton = document.getElementById('play-again-button');
  const messageElement = document.getElementById('message');
  const playerCardsElement = document.getElementById('player-cards');
  const dealerCardsElement = document.getElementById('dealer-cards');
  const playerScoreElement = document.getElementById('player-score');
  const dealerScoreElement = document.getElementById('dealer-score');
  const chipElements = document.querySelectorAll('.chip');

  // Function to update balance on the screen
  function updateBalance() {
    balanceElement.textContent = `Balance: $${balance}`;
  }

  // Function to update scores on the screen
  function updateScores() {
    playerScoreElement.textContent = `Your Score: ${calculateScore(playerHand)}`;
    dealerScoreElement.textContent = `Dealer's Score: ${calculateScore(dealerHand)}`;
  }

  // Create the deck of cards
  function createDeck() {
    deck = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
  }

  // Shuffle the deck using Fisher-Yates algorithm
  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  // Deal a card to a given hand
  function dealCard(hand) {
    hand.push(deck.pop());
  }

  // Render the player's and dealer's hands on the screen
  function renderHands() {
    playerCardsElement.innerHTML = '';
    dealerCardsElement.innerHTML = '';

    for (let card of playerHand) {
      playerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }
    for (let card of dealerHand) {
      dealerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }

    updateScores();
  }

  // Calculate the score of a hand
  function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (let card of hand) {
      if (card.value === 'A') {
        score += 11;
        aceCount++;
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    }
    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }
    return score;
  }

  // Check if the game is over and determine the winner
  function checkGameOver() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
      endGame("You busted! Dealer wins.");
    } else if (dealerScore > 21) {
      endGame("Dealer busted! You win!");
      balance += currentBet * 2;
    } else if (playerScore > dealerScore) {
      endGame(`You win! You earned $${currentBet}`);
      balance += currentBet * 2;
    } else if (dealerScore > playerScore) {
      endGame(`Dealer wins! You lost $${currentBet}`);
    } else {
      endGame("It's a tie! You get your bet back.");
      balance += currentBet;
    }

    updateBalance();
    updateScores();
  }

  // End the game and display a message
  function endGame(message) {
    gameOver = true;
    messageElement.textContent = message;
    hitButton.disabled = true;
    standButton.disabled = true;
    playAgainButton.style.display = 'inline-block';
  }

  // Start the game and reset hands, deck, etc.
  function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [];
    dealerHand = [];
    gameOver = false;
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
    renderHands();
    updateBalance();
    hitButton.disabled = false;
    standButton.disabled = false;
    playAgainButton.style.display = 'none';
    messageElement.textContent = '';
  }

  // Event listeners for buttons and chips
  chipElements.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipValue = parseInt(chip.getAttribute('data-value'));
      currentBet += chipValue;
      balance -= chipValue;
      updateBalance();
    });
  });

  placeBetButton.addEventListener('click', () => {
    if (currentBet <= 0 || currentBet > balance) {
      alert("Please place a valid bet.");
      return;
    }
    startGame();
  });

  hitButton.addEventListener('click', () => {
    if (gameOver) return;
    dealCard(playerHand);
    renderHands();
    if (calculateScore(playerHand) > 21) {
      endGame('You busted! Dealer wins.');
      updateBalance();
    }
  });

  standButton.addEventListener('click', () => {
    if (gameOver) return;
    while (calculateScore(dealerHand) < 17) {
      dealCard(dealerHand);
    }
    renderHands();
    checkGameOver();
  });

  playAgainButton.addEventListener('click', () => {
    startGame();
    currentBet = 0;
    updateBalance();
  });

  // Initialize the game
  startGame();
});
