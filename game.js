// Define a deck of cards
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Initialize the deck
let deck = [];
suits.forEach(suit => {
    values.forEach(value => {
        deck.push({ suit, value });
    });
});

// Shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to calculate the score of a hand
function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    hand.forEach(card => {
        if (card.value === 'A') {
            aceCount++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    // Adjust for Aces (11 can become 1)
    while (score > 21 && aceCount) {
        score -= 10;
        aceCount--;
    }

    return score;
}

// Initialize game variables
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// Function to start a new game
function startGame() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });
    shuffleDeck();

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameOver = false;

    document.getElementById('player-score').textContent = 'Your Score: ' + calculateScore(playerHand);
    document.getElementById('dealer-score').textContent = 'Dealer\'s Score: ' + calculateScore(dealerHand);
    document.getElementById('message').textContent = '';

    renderHands();
}

// Function to render cards on the page
function renderHands() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    playerHand.forEach(card => {
        playerCardsDiv.innerHTML += `<p>${card.value} of ${card.suit}</p>`;
    });

    dealerCardsDiv.innerHTML = `<p>Face-down</p>`;
    dealerCardsDiv.innerHTML += `<p>${dealerHand[1].value} of ${dealerHand[1].suit}</p>`;
}

// Function to handle "Hit"
document.getElementById('hit-button').addEventListener('click', function () {
    if (!gameOver) {
        playerHand.push(deck.pop());
        document.getElementById('player-score').textContent = 'Your Score: ' + calculateScore(playerHand);
        renderHands();
        checkGameOver();
    }
});

// Function to handle "Stand"
document.getElementById('stand-button').addEventListener('click', function () {
    if (!gameOver) {
        // Dealer's turn to play
        while (calculateScore(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }
        document.getElementById('dealer-score').textContent = 'Dealer\'s Score: ' + calculateScore(dealerHand);
        renderHands();
        checkGameOver();
    }
});

// Function to check if the game is over
function checkGameOver() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
        document.getElementById('message').textContent = 'You busted! Dealer wins.';
        gameOver = true;
    } else if (dealerScore > 21) {
        document.getElementById('message').textContent = 'Dealer busted! You win!';
        gameOver = true;
    } else if (playerScore === 21) {
        document.getElementById('message').textContent = 'You got Blackjack! You win!';
        gameOver = true;
    } else if (dealerScore === 21) {
        document.getElementById('message').textContent = 'Dealer got Blackjack! Dealer wins.';
        gameOver = true;
    }

    if (gameOver) {
        document.getElementById('hit-button').disabled = true;
        document.getElementById('stand-button').disabled = true;
    }
}
// Handle the "Play Again" button
document.getElementById('play-again-button').addEventListener('click', function () {
    // Reset buttons
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('play-again-button').style.display = 'none';
    
    // Start a new game
    startGame();
});

// Start a new game when the page loads
startGame();
