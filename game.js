const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

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

function getCardSymbol(card) {
    const suitSymbols = {
        'Hearts': '♥',
        'Diamonds': '♦',
        'Clubs': '♣',
        'Spades': '♠'
    };
    return `<span class="card">${card.value}${suitSymbols[card.suit]}</span>`;
}

function renderHands(showDealerFull = false) {
    const playerDiv = document.getElementById('player-cards');
    const dealerDiv = document.getElementById('dealer-cards');
    playerDiv.innerHTML = '';
    dealerDiv.innerHTML = '';

    playerHand.forEach(card => {
        playerDiv.innerHTML += getCardSymbol(card);
    });

    if (showDealerFull || gameOver) {
        dealerHand.forEach(card => {
            dealerDiv.innerHTML += getCardSymbol(card);
        });
    } else {
        dealerDiv.innerHTML += `<span class="card">🂠</span>`;
        dealerDiv.innerHTML += getCardSymbol(dealerHand[1]);
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
        endGame('You busted! Dealer wins.');
    } else if (dealerScore > 21) {
        endGame('Dealer busted! You win!');
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            endGame('You win!');
        } else if (dealerScore > playerScore) {
            endGame('Dealer wins!');
        } else {
            endGame('It\'s a tie!');
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
