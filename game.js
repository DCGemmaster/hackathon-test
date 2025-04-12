const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let balance = 100;  // Starting balance
let currentBet = 0; // Amount the player bets for each round


// Place the bet when the player clicks the "Place Bet" button
document.getElementById('place-bet').addEventListener('click', () => {
    const betInput = document.getElementById('bet');
    const betAmount = parseInt(betInput.value);
    
    if (betAmount <= 0 || betAmount > balance) {
        alert("Please place a valid bet.");
        return;
    }
    
    currentBet = betAmount;
    balance -= currentBet;  // Deduct bet from balance
    document.getElementById('balance').textContent = `Balance: $${balance}`;
    
    startGame();  // Start the game once bet is placed
});

function createDeck() {
    deck = [];
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

function getCardHTML(card) {
    const suitSymbols = {
        'Hearts': '♥',
        'Diamonds': '♦',
        'Clubs': '♣',
        'Spades': '♠'
    };
    return `<div class="card">${card.value}${suitSymbols[card.suit]}</div>`;
}

function renderHands(showDealerFull = false) {
    const playerDiv = document.getElementById('player-cards');
    const dealerDiv = document.getElementById('dealer-cards');
    playerDiv.innerHTML = '';
    dealerDiv.innerHTML = '';

    playerHand.forEach(card => {
        playerDiv.innerHTML += getCardHTML(card);
    });

    if (showDealerFull || gameOver) {
        dealerHand.forEach(card => {
            dealerDiv.innerHTML += getCardHTML(card);
        });
    } else {
        dealerDiv.innerHTML += `<div class="card">🂠</div>`;
        dealerDiv.innerHTML += getCardHTML(dealerHand[1]);
    }

    document.getElementById('player-score').textContent = 'Your Score: ' + calculateScore(playerHand);
    document.getElementById('dealer-score').textContent = showDealerFull || gameOver
        ? 'Dealer\'s Score: ' + calculateScore(dealerHand)
        : 'Dealer\'s Score: ?';
}

function checkGameOver() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore > 21) {
        endGame("You busted! Dealer wins.");
    } else if (dealerScore > 21) {
        endGame("Dealer busted! You win!");
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            endGame(`You win! You earned $${currentBet}`);
            balance += currentBet * 2;  // Player wins the bet (gets it back + double)
        } else if (dealerScore > playerScore) {
            endGame(`Dealer wins! You lost $${currentBet}`);
        } else {
            endGame("It's a tie! You get your bet back.");
            balance += currentBet;  // Tie, return the bet
        }
    }
}


function endGame(message) {
    gameOver = true;
    document.getElementById('message').textContent = message;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('play-again-button').style.display = 'inline-block';
    renderHands(true);
}

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

    document.getElementById('message').textContent = '';
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('play-again-button').style.display = 'none';

    renderHands();
}

document.getElementById('hit-button').addEventListener('click', () => {
    if (!gameOver) {
        dealCard(playerHand);
        renderHands();
        if (calculateScore(playerHand) > 21) {
            checkGameOver();
        }
    }
});

document.getElementById('stand-button').addEventListener('click', () => {
    if (!gameOver) {
        while (calculateScore(dealerHand) < 17) {
            dealCard(dealerHand);
        }
        gameOver = true;
        renderHands(true);
        checkGameOver();
    }
});

document.getElementById('play-again-button').addEventListener('click', () => {
    startGame();
});

startGame();
