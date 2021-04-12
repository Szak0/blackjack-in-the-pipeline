let type = ["Spades", "Hearts", "Diamonds", "Clubs"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let names = [];
let deck = [];
let name = "";
let players = [];
let winStreak = 0;


function createDeck() {
    deck = [];
    name = "";
    for (let i = 0; i < values.length; i++) {
        for (let x = 0; x < type.length; x++) {
            let weight = parseInt(values[i]);
            if (values[i] === "J" || values[i] === "Q" || values[i] === "K")
                weight = 10;
            if (values[i] === "A")
                weight = 11;
            const card = {Value: values[i], Type: type[x], Weight: weight, CardName: values[i] + type[x]};
            deck.push(card);
        }
    }
}


function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function initPlayers(num) {
    players = new Array();
    for (let i = 1; i <= num; i++) {
        let hand = new Array();
        let player = {Name: 'Player ' + i, ID: i, Points: 0, Hand: hand};
        players.push(player);
    }

    document.getElementById('cards')


}


function giveCards() {
    let cardBack = document.createElement('div');
    cardBack.className = "cardBack";
    cardBack.style.background = 'url(' + '/static/images/' + "back" + '.jpg' + ')';
    let player_first = deck.pop();
    let dealer_card = deck.pop();
    console.log(dealer_card)
    let dealer_cardBack = ""

    let player_secund = deck.pop();
    if (player_first.Value === 'A' || player_secund.Value === 'A') {
        player_secund.Weight = 1
    }
    players[0].Hand.push(dealer_card);

    players[1].Hand.push(player_first);
    players[1].Hand.push(player_secund);


}


function displayPlayers() {

    let dealer_card = document.createElement('div');
    dealer_card.className = "cards" + " " + players[0].Hand[0].CardName;
    dealer_card.style.background = 'url(' + '/static/images/' + players[0].Hand[0].CardName + '.png' + ')';
    document.getElementById('cards').appendChild(dealer_card)


    for (let y = 1; y < 2; y++) {
        for (let i = 0; i < players.length; i++) {

            // console.log(players[y].ID)
            let player_card = document.createElement('div');
            let dealer_card = document.createElement('div');

            if (players[y].ID === 1) {
                player_card.className = "cards" + " " + players[y].Hand[i].CardName;
                player_card.style.background = 'url(' + '/static/images/' + players[y].Hand[i].CardName + '.png' + ')';
                document.getElementById('cards').appendChild(player_card)
            } else {
                dealer_card.className = "cards" + " " + players[y].Hand[i].CardName;
                dealer_card.style.background = 'url(' + '/static/images/' + players[y].Hand[i].CardName + '.png' + ')';
                document.getElementById('cards_2').appendChild(dealer_card)
            }
        }
    }

    countPoints();
}


function standButton() {
    const button = document.getElementById('stand');
    button.addEventListener('click', standCard)

}

function checkWin() {
    if (players[0].Points > players[1].Points) {
        setTimeout(function () {
            displayResult("House wins. You lost the game!");
        }, 120);
    }

}


function standCard() {
    checkWin();
    if (players[0].Points >= 18) {
        let less_than = true;
        countPoints(less_than);
    } else {
        if (players[0].Points < 18) {
            let newCard = deck.pop();
            players[0].Hand.push(newCard);
            updateUI(newCard, 0);
            countPoints();
        }
    }
}


function hitButton() {
    const button = document.getElementById('hit');
    button.addEventListener('click', hitCard(1));
}


function hitCard(player) {
    let newCard = deck.pop();
    players[player].Hand.push(newCard);
    updateUI(newCard, player);
    countPoints();

}


function updateUI(newCard, player) {
    if (player === 0) {
        let dealer_card = document.createElement('div');
        dealer_card.className = "cards" + " " + newCard.CardName;
        dealer_card.style.background = 'url(' + '/static/images/' + newCard.CardName + '.png' + ')';
        document.getElementById('cards').appendChild(dealer_card)
    } else {
        let player_card = document.createElement('div');
        player_card.className = "cards" + " " + newCard.CardName;
        player_card.style.background = 'url(' + '/static/images/' + newCard.CardName + '.png' + ')';
        document.getElementById('cards_2').appendChild(player_card)
    }
}


function countPoints(less_than) {
    let d_score = 0;
    let p_score = 0;
    for (let cards of players[0].Hand) {
        d_score += cards.Weight;
        players[0].Points = d_score
    }
    for (let cards of players[1].Hand) {
        p_score += cards.Weight;
        players[1].Points = p_score
    }
    document.getElementById("dealer-score").innerHTML = d_score;
    document.getElementById("player-score").innerHTML = p_score;

    winCheck(d_score, p_score, less_than);


}


function displayResult(text) {

    let div = document.getElementById('result');
    div.style.backgroundColor = 'red';
    div.style.textAlign = 'center';
    div.innerHTML = text;
    div.style.fontSize = '30px';

    let buttons = document.getElementById('buttons')
    buttons.style.display = 'None';
    let start_button = document.getElementById('start_again_container');
    start_button.style.display = 'flex';

}

function checkAce() {
    let value = [];
    for (let y = 0; y < players[1].Hand.length; y++) {
        value[y] = players[1].Hand[y].Value === 'A';
    }
    const even = (element) => element === true;
    return value.some(even) !== false;
}


function winCheck(d_score, p_score, less_than) {
    console.log(players[1].Hand);
    if (less_than) {
        if (d_score > p_score) {
            setTimeout(function () {
                displayResult("House wins. You lost the game!");
            }, 120);
        }

        if (d_score < p_score) {
            setTimeout(function () {
                displayResult("Congratulations! You win the game!");
            }, 120);
        }

        if (d_score === p_score) {
            setTimeout(function () {
                displayResult("It's a tie!");
            }, 120);
        }
    } else {
        if (p_score === 21) {
            setTimeout(function () {
                displayResult("Congratulations! You win the game!");
            }, 120);
        }

        if (p_score > 21) {
            setTimeout(function () {
                displayResult("Busted! You lost the game!");
            }, 120);
        }

        if (d_score === 21) {
            setTimeout(function () {
                displayResult("House wins. You lost the game!");
            }, 120);
        }

        if (d_score > 21) {
            setTimeout(function () {
                displayResult("House busted! Player wins!");
            }, 120);
        }

        if (d_score === 21 && p_score === 21) {
            setTimeout(function () {
                displayResult("It's a tie!");
            }, 120);
        }
    }
}


function game() {
    createDeck();
    shuffle(deck);
    initPlayers(2);
    giveCards();
    displayPlayers();

}

game();
