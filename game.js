document.addEventListener('DOMContentLoaded', () => {
  let balance = 100;
  let currentBet = 0;
  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let gameOver = false;

  const balanceElement = document.getElementById('balance');
  const betInput = document.getElementById('bet');
  const placeBetButton = document.getElementById('place-bet');
  const hitButton = document.getElementById('hit-button');
  const standButton = document.getElementById('stand-button');
  const playAgainButton = document.getElementById('play-again-button');
  const messageElement = document.getElementById('message');
  const playerCardsElement = document.getElementById('player-cards');
  const dealerCardsElement = document.getElementById('dealer-cards');
  const playerScoreElement = document.getElementById('player-score');
  const dealerScoreElement = document.getElementById('dealer-score');

  function updateBalance() {
    balanceElement.textContent = `Balance: $${balance}`;
  }

  function updateScores() {
    playerScoreElement.textContent = `Your Score: ${calculateScore(playerHand)}`;
    dealerScoreElement.textContent = `Dealer's Score: ${calculateScore(dealerHand)}`;
  }

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

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function dealCard(hand) {
    hand.push(deck.pop());
  }

  function renderHands() {
    playerCardsElement.innerHTML = '';
    dealerCardsElement.innerHTML = '';

    for (let card of playerHand) {
      playerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }
    for (let card of dealerHand) {
      dealerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }

    updateScores(); // This is where we update the score every time the hands are rendered
  }

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

  function checkGameOver() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
      endGame("You busted! Dealer wins.");
    } else if (dealerScore > 21) {
      endGame("Dealer busted! You win!");
      balance += currentBet * 2; // Player wins (gets back bet + winnings)
    } else if (playerScore > dealerScore) {
      endGame(`You win! You earned $${currentBet}`);
      balance += currentBet * 2; // Player wins (gets back bet + winnings)
    } else if (dealerScore > playerScore) {
      endGame(`Dealer wins! You lost $${currentBet}`);
    } else {
      endGame("It's a tie! You get your bet back.");
      balance += currentBet; // Tie, player gets their bet back
    }

    updateBalance(); // Update balance after game ends
    updateScores(); // Update scores again just in case
  }

  function endGame(message) {
    gameOver = true;
    messageElement.textContent = message;
    hitButton.disabled = true;
    standButton.disabled = true;
    playAgainButton.style.display = 'inline-block';
  }

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

  placeBetButton.addEventListener('click', () => {
    const betAmount = parseInt(betInput.value);
    if (betAmount <= 0 || betAmount > balance) {
      alert("Please place a valid bet.");
      return;
    }
    currentBet = betAmount;
    balance -= currentBet;
    updateBalance();
    startGame();
  });

  playAgainButton.addEventListener('click', () => {
    startGame();
    // Reset currentBet for new round
    currentBet = 0;
    betInput.value = ''; // Clear the bet input field
    updateBalance();
  });

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
    updateScores();
    hitButton.disabled = false;
    standButton.disabled = false;
    playAgainButton.style.display = 'none';
    messageElement.textContent = '';
  }

  // Init
  startGame();
});
