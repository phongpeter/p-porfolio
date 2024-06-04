'use-strict'

document.addEventListener('DOMContentLoaded', function () {
    const emojis = ['😀', '🐶', '🍕', '🌞', '🎉', '🚀', '🌈', '⚽️'];
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-btn');
    const timerElement = document.getElementById('time-remaining');
    const scoreElement = document.getElementById('score-value');

    let cards = [];
    let flippedCards = [];
    let score = 0;
    let time = 0;
    let timerId;

    // Shuffle the emojis array
    function shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Create game cards
    function createCards() {
        const shuffledEmojis = shuffle(emojis.concat(emojis));

        for (let i = 0; i < shuffledEmojis.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = shuffledEmojis[i];
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        }
    }

    // Flip the selected card
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    // Check if flipped cards match
    function checkForMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];

        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            score += 2;
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];

        if (score === emojis.length * 2) {
            clearInterval(timerId);
            alert('Congratulations! You won!');
        }
    }

    // Start the game
    function startGame() {
        startButton.disabled = true;
        createCards();
        startTimer();
    }

    // Start the timer
    function startTimer() {
        var els = document.getElementsByName('difficulty');

        for (var i = 0; i < els.length; i++) {
            if (els[i].checked) {

                if(els[i].value == 'd1'){
                    time = 120;
                }

                if(els[i].value == 'd2'){
                    time = 80;
                }

                if(els[i].value == 'd3'){
                    time = 60;
                }
            }
        }

        console.log(time)

        timerId = setInterval(function () {
            time--;
            timerElement.textContent = time;

            if (time === 0) {
                clearInterval(timerId);
                alert('Time\'s up! Game over!');
            }
        }, 1000);
    }

    // Reset the game
    function resetGame() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        score = 0;
        time = 0;
        timerElement.textContent = time;
        scoreElement.textContent = score;
        startButton.disabled = false;
        clearInterval(timerId);
    }

    startButton.addEventListener('click', startGame);

    // Reset the game when the page loads
    resetGame();
});
