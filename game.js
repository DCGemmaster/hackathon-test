// Global Variables
let balance = 100;
let currentBet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// DOM Elements
const balanceElement = document.getElementById('balance');
const betInput = document.getElementById('bet');
const placeBetButton = document.getElementById('place-bet');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playAgainButton = document.getElementById('play-again-button');
const messageElement = document.getElementById('message');
const playerCardsElement = document.getElementById('player-cards');
const dealerCardsElement = document.getElementById('dealer-cards');

// Update balance in the UI
function updateBalance() {
    balanceElement.textContent = `Balance: $${balance}`;
}

// Create a new deck of cards
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

// Shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal a card to the specified hand
function dealCard(hand) {
    hand.push(deck.pop());
}

// Render cards to the screen
function renderHands() {
    playerCardsElement.innerHTML = '';
    dealerCardsElement.innerHTML = '';

    for (let card of playerHand) {
        playerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }
    for (let card of dealerHand) {
        dealerCardsElement.innerHTML += `<div class="card">${card.value} ${card.suit}</div>`;
    }
}

// Calculate the score for a given hand
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

    // Adjust for Aces if score is over 21
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

// Handle the game over logic
function checkGameOver() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
        endGame("You busted! Dealer wins.");
    } else if (dealerScore > 21) {
        endGame("Dealer busted! You win!");
        balance += currentBet * 2;  // Player wins (gets back bet + winnings)
    } else if (playerScore > dealerScore) {
        endGame(`You win! You earned $${currentBet}`);
        balance += currentBet * 2;  // Player wins (gets back bet + winnings)
    } else if (dealerScore > playerScore) {
        endGame(`Dealer wins! You lost $${currentBet}`);
    } else {
        endGame("It's a tie! You get your bet back.");
        balance += currentBet;  // Tie, player gets their bet back
    }

    // Update the balance on the page
    updateBalance();
}

// End the game and display the result
function endGame(message) {
    gameOver = true;
    messageElement.textContent = message;
    hitButton.disabled = true;
    standButton.disabled = true;
    playAgainButton.style.display = 'inline-block';
}

// Handle the 'Hit' button click
hitButton.addEventListener('click', () => {
    if (gameOver) return;

    dealCard(playerHand);
    renderHands();

    if (calculateScore(playerHand) > 21) {
        endGame('You busted! Dealer wins.');
        updateBalance();  // <--- this was missing
    }
});


// Handle the 'Stand' button click
standButton.addEventListener('click', () => {
    if (gameOver) return;

    while (calculateScore(dealerHand) < 17) {
        dealCard(dealerHand);
    }

    renderHands();
    checkGameOver();
});

// Handle the 'Place Bet' button click
placeBetButton.addEventListener('click', () => {
    const betAmount = parseInt(betInput.value);

    if (betAmount <= 0 || betAmount > balance) {
        alert("Please place a valid bet.");
        return;
    }

    currentBet = betAmount;
    balance -= currentBet;
    updateBalance();  // Update balance display

    startGame();
});

// Start a new game
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

// Handle the 'Play Again' button click
playAgainButton.addEventListener('click', () => {
    startGame();
});

// Start the game on initial load
startGame();
