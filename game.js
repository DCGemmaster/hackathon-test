function updateBalance() {
  balanceElement.textContent = `Balance: $${balance}`;
}

function updateScores() {
  document.getElementById('player-score').textContent = `Your Score: ${calculateScore(playerHand)}`;
  document.getElementById('dealer-score').textContent = `Dealer's Score: ${calculateScore(dealerHand)}`;
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

  updateScores();
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
