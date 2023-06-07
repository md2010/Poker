$(document).ready(function () {
  const suits = ["h", "d", "c", "s"];
  const ranks = [
    "a",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "j",
    "q",
    "k",
  ];

  $('#display-blocks').on( "click", function() {
    window.open('blocks.html', '_blank');
  } );

  let deck = [];
  let gameDeck = [];
  let reveal = 1;
  let transactions = [];
  let players = [];

  let boardCards = [];

  let initialStake = 5;
  let initialAmount = 30;

  let player1 = new Player("", "", "player1", 1, initialAmount, 1);
  let player2 = new Player("", "", "player2", 2, initialAmount, 2);
  let player3 = new Player("", "", "player3", 3, initialAmount, 3);
  let player4 = new Player("", "", "player4", 4, initialAmount, 4);
  let dealer = new Player("", "", "dealer", 19, 0, 5);
  let addressList = [];
  getAddresses();


  players.push(dealer, player1, player2, player3, player4);

    async function getAddresses() {
        const response = await fetch("/addresses");
        addressList = await response.json();
        assignAddresses();
    }

    function assignAddresses() {
        for (let i = 0; i < addressList.length; i++) {
            players[i].address = addressList[i];
        }
    }

    function displayBlocks() {
        window.open('blocks.html', '_blank').focus();
    }

  //let addressList = ["dealer", "palyer1", "player2", "player3", "player4"];

  for (let suit in suits) {
    for (let rank in ranks) {
      deck.push(ranks[rank] + suits[suit]);
    }
  }

  let shuffle = function () {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  };

  let deal = function () {
    setUpCards();
    payInitialStake();

    shuffle();
    gameDeck = [...deck];

    for (let i = 0; i < players.length; i++) {
      if (players[i].name != "dealer" && players[i].fold == false) {
        players[i].card1 = gameDeck.pop();
        $("#" + players[i].name + "-card-1").css(
          "background-image",
          "url(../img/card-" + players[i].card1 + ".png)"
        );
        players[i].card2 = gameDeck.pop();
        $("#" + players[i].name + "-card-2").css(
          "background-image",
          "url(../img/card-" + players[i].card2 + ".png)"
        );
      }
    }

    $("#deal-btn").prop("disabled", true);
  };

  let reveal3 = function () {
    for (let i = 1; i < 4; i++) {
      let card = gameDeck.pop();
      boardCards.push(card);
      $("#dealer-cards-table-" + i).css(
        "background-image",
        "url(../img/card-" + card + ".png)"
      );
    }

    reveal++;
  };

  let reveal4 = function () {
    let card = gameDeck.pop();
    boardCards.push(card);
    $("#dealer-cards-table-4").css(
      "background-image",
      "url(../img/card-" + card + ".png)"
    );
    reveal++;
  };

  let reveal5 = function () {
    let card = gameDeck.pop();
    boardCards.push(card);
    $("#dealer-cards-table-5").css(
      "background-image",
      "url(../img/card-" + card + ".png)"
    );
    reveal++;
  };

  $("#deal-btn").click(function () {
    deal();
    $("#title-and-winner").text("Poker Blockchain");
    setNextPlayer(findNextPlayer(dealer));
  });

  $("#reveal-btn").click(function () {
    if (reveal == 1) {
      reveal3();
    } else if (reveal == 2) {
      reveal4();
    } else if (reveal == 3) {
      reveal5();
    }
    setNextPlayer(findNextPlayer(dealer));
  });

  $("#player1-fold").click(function () {
    fold(player1);
  });

  $("#player1-pay").click(function () {
    pay(player1, dealer, initialStake);
    setNextPlayer(findNextPlayer(player1));
  });

  $("#player2-fold").click(function () {
    fold(player2);
  });

  $("#player2-pay").click(function () {
    pay(player2, dealer, initialStake);
    setNextPlayer(findNextPlayer(player2));
  });

  $("#player3-fold").click(function () {
    fold(player3);
  });

  $("#player3-pay").click(function () {
    pay(player3, dealer, initialStake);
    setNextPlayer(findNextPlayer(player3));
  });

  $("#player4-fold").click(function () {
    fold(player4);
  });

  $("#player4-pay").click(function () {
    pay(player4, dealer, initialStake);
    setNextPlayer(findNextPlayer(player4));
  });

  let changeAmountOnGui = function () {
    $("#dealer-name-and-amount").text(dealer.name + ": " + dealer.amount + "$");
    $("#player-1-name-and-amount").text(
      player1.name + ": " + player1.amount + "$"
    );
    $("#player-2-name-and-amount").text(
      player2.name + ": " + player2.amount + "$"
    );
    $("#player-3-name-and-amount").text(
      player3.name + ": " + player3.amount + "$"
    );
    $("#player-4-name-and-amount").text(
      player4.name + ": " + player4.amount + "$"
    );
  };

  let pay = function (payer, reciever, amount) {
    if (payer.amount >= amount) {
      payer.amount -= amount;
      reciever.amount += amount;
      transactions.push(
        new Transaction(payer.address, reciever.address, amount)
      );
      changeAmountOnGui();
    } else {
      console.log("nemam ba para");
    }
  };

  let fold = function (player) {
    player.fold = true;
    if (countActivePlayers() > 2) {
      setNextPlayer(findNextPlayer(player));
    } else {
      getWinnerByFold();
    }
  };

  let countActivePlayers = function () {
    let counter = 0;
    for (let i = 0; i < players.length; i++) {
      if (!players[i].fold) {
        counter++;
      }
    }

    return counter;
  };

  let setUpNewRound = function () {
    disableAllbutons();
    hideAllTurnMarks();
    reveal = 1;
    $("#dealer-is-playing").show();
    $("#deal-btn").prop("disabled", false);
    $("#reveal-btn").prop("disabled", true);
    boardCards = [];
  };

  let setUpCards = function () {
    setPlayersCards();
    setDealerCards();
  };

  let setPlayersCards = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].name != "dealer") {
        if (players[i].amount > 0) {
          players[i].fold = false;
        }
        players[i].card1 = gameDeck.pop();
        $("#" + players[i].name + "-card-1").css(
          "background-image",
          "url(../img/card-back.png)"
        );
        players[i].card2 = gameDeck.pop();
        $("#" + players[i].name + "-card-2").css(
          "background-image",
          "url(../img/card-back.png)"
        );
      }
    }
  };

  let setDealerCards = function () {
    for (let i = 1; i < 6; i++) {
      $("#dealer-cards-table-" + i).css(
        "background-image",
        "url(../img/card-back.png)"
      );
    }
  };

  let payInitialStake = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].name != "dealer") {
        if (players[i].fold == false) {
          pay(players[i], dealer, initialStake);
        }
      }
    }
  };

  let hideAllTurnMarks = function () {
    for (let i = 0; i < players.length; i++) {
      $("#" + players[i].name + "-is-playing").hide();
    }
  };

  let disableAllbutons = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].name === "dealer") {
        $("#reveal-btn").prop("disabled", true);
        $("#deal-btn").prop("disabled", true);
      } else {
        $("#" + players[i].name + "-fold").prop("disabled", true);
        $("#" + players[i].name + "-pay").prop("disabled", true);
      }
    }
  };

  let setNextPlayer = function (player) {
    hideAllTurnMarks();
    disableAllbutons();
    $("#" + player.name + "-is-playing").show();
    if (player.name === "dealer") {
      if (reveal == 4) {
        findWinner();
      } else {
        $("#reveal-btn").prop("disabled", false);
      }
    } else {
      $("#" + player.name + "-fold").prop("disabled", false);
      $("#" + player.name + "-pay").prop("disabled", false);
    }
  };

  let findNextPlayer = function (player) {
    let position = player.position;

    for (let i = 0; i < 5; i++) {
      if (position === 5) {
        position = 1;
      } else {
        position += 1;
      }
      player = players.find((p) => p.position == position);
      if (!player.fold) {
        if (player.name === "dealer") {
          return player;
        } else if (player.amount > 0) {
          return player;
        }
      }
    }
  };

  let getWinnerByFold = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].name != "dealer" && players[i].fold == false) {
        declareWinner(players[i]);
        break;
      }
    }
  };

  let findWinner = function () {
    let activePlayers = [];
    for (let i = 0; i < players.length; i++) {
      if (players[i].fold == false && players[i].name != "dealer") {
        activePlayers.push(players[i]);
      }
    }

    let winner = determineWinner(activePlayers, boardCards);
    declareWinner(winner);
  };

  let declareWinner = function (winner) {
    pay(dealer, winner, dealer.amount);
    hidePlayersIfTheyLost();
    if (checkIfGameIsOver()) {
      $("#title-and-winner").text(winner.name + " is winner of the game");
      hideAllTurnMarks();
      disableAllbutons();
    } else {
      $("#title-and-winner").text(winner.name + " is winner of this round");
      setUpNewRound();
    }
    sendTransactions();
    transactions = [];
    };

    async function sendTransactions() {
        const response = await fetch("save-transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Transactions: transactions }), // body data type must match "Content-Type" header
        });
        response.json();        
    }

  let hidePlayersIfTheyLost = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].amount == 0 && players[i].name != "dealer") {
        players[i].fold = true;
        $('#' + players[i].name).hide();
        $('#' + players[i].name + "-card-1").hide();
        $('#' + players[i].name + "-card-2").hide();
      }
    }
  }
  
  let checkIfGameIsOver = function () {
    for (let i = 0; i < players.length; i++) {
      if (players[i].amount == 4 * initialAmount) {
        return true;
      } else if (players[i].amount == 0 && players[i].name != "dealer") {
        players[i].fold = true;
        $('#' + players[i].name).hide();
        $('#' + players[i].name + "-card-1").hide();
        $('#' + players[i].name + "-card-2").hide();
      }
    }
    return false;
  };

  changeAmountOnGui();
});

class Player {
  constructor(card1, card2, name, id, amount, position) {
    this.card1 = card1;
    this.card2 = card2;
    this.name = name;
    this.id = id;
    this.amount = amount;
    this.position = position;
    this.fold = false;
    this.address = "";
  }
}

class Transaction {
  constructor(senderAddress, reciverAddress, amount) {
    this.senderAddress = senderAddress;
    this.reciverAddress = reciverAddress;
    this.amount = amount;
  }
}

function determineWinner(activePlayers, boardCards) {
  let handStrengths = [];

  for (let i = 0; i < activePlayers.length; i++) {
    let allCards = [...boardCards];
    allCards.push(activePlayers[i].card1);
    allCards.push(activePlayers[i].card2);

    let handStrength = calculateHandStrength(allCards);
    handStrengths.push(handStrength);
  }

  let maxStrength = Math.max(...handStrengths);
  let winner;
  for (let i = 0; i < handStrengths.length; i++) {
    if (handStrengths[i] === maxStrength) {
      winner = activePlayers[i];
    }
  }

  return winner;
}

function calculateHandStrength(cards) {
  let sortedCards = cards.sort((a, b) => {
    let aRank = getCardRank(a);
    let bRank = getCardRank(b);
    return bRank - aRank;
  });

  let flushSuit = checkFlush(sortedCards);
  let pairs = [];
  let threeOfAKind = null;
  let fourOfAKind = null;
  let ranksTemp = {};

  for (let i = 0; i < sortedCards.length; i++) {
    let rank = getCardRank(sortedCards[i]);
    if (ranksTemp[rank]) {
      ranksTemp[rank]++;
    } else {
      ranksTemp[rank] = 1;
    }
  }

  for (let rank in ranksTemp) {
    if (ranksTemp[rank] === 2) {
      pairs.push(rank);
    } else if (ranksTemp[rank] === 3) {
      threeOfAKind = rank;
    } else if (ranksTemp[rank] === 4) {
      fourOfAKind = rank;
    }
  }

  if (checkFlush(sortedCards) && checkStraight(sortedCards)) {
    let flushCards = sortedCards.filter(
      (card) => getCardSuit(card) === flushSuit
    );
    return parseInt(getCardRank(flushCards[0])) + 160;
  }

  if (fourOfAKind != null) {
    return parseInt(fourOfAKind) + 140;
  }

  if (checkFlush(sortedCards)) {
    let flushCards = sortedCards.filter(
      (card) => getCardSuit(card) === flushSuit
    );
    return parseInt(getCardRank(flushCards[0])) + 120;
  }

  if (checkStraight(sortedCards)) {
    return parseInt(getCardRank(checkStraight(sortedCards)[0])) + 100;
  }

  if (threeOfAKind) {
    return parseInt(threeOfAKind) + 80;
  }

  if (pairs.length === 2) {
    let highPair = Math.max(pairs[0], pairs[1]);
    let lowPair = Math.min(pairs[0], pairs[1]);
    return parseInt(highPair) + parseInt(lowPair) + 50;
  }

  if (pairs.length === 1) {
    return parseInt(pairs[0]) + 30;
  }

  return (
    parseInt(getCardRank(sortedCards[5])) +
    parseInt(getCardRank(sortedCards[6]))
  );
}

function getCardSuit(card) {
  if (card.startsWith("10")) {
    return card.charAt(2);
  }
  return card.charAt(1);
}

function checkFlush(cards) {
  let suits = {};
  for (let i = 0; i < cards.length; i++) {
    let suit = getCardSuit(cards[i]);
    if (suits[suit]) {
      suits[suit]++;
    } else {
      suits[suit] = 1;
    }
  }
  for (let suit in suits) {
    if (suits[suit] >= 5) {
      return suit;
    }
  }
  return false;
}

function checkStraight(cards) {
  let uniqueRanks = [...new Set(cards.map((card) => getCardRank(card)))];
  let sortedRanks = uniqueRanks.sort((a, b) => b - a);
  let straightCount = 1;

  for (let i = 0; i < sortedRanks.length - 1; i++) {
    if (sortedRanks[i] - sortedRanks[i + 1] === 1) {
      straightCount++;
      if (straightCount === 5) {
        let straightCards = cards.filter(
          (card) =>
            getCardRank(card) === sortedRanks[i] ||
            getCardRank(card) === sortedRanks[i + 4]
        );
        return straightCards;
      }
    } else if (sortedRanks[i] !== sortedRanks[i + 1]) {
      straightCount = 1;
    }
  }

  return null;
}

function getCardRank(card) {
  if (card.startsWith("10")) {
    return 10;
  }
  let rank = parseInt(card.charAt(0));
  if (isNaN(rank)) {
    switch (card.charAt(0)) {
      case "a":
        rank = 14;
        break;
      case "k":
        rank = 13;
        break;
      case "q":
        rank = 12;
        break;
      case "j":
        rank = 11;
        break;
      default:
        rank = NaN;
        break;
    }
  }
  return rank;
}
