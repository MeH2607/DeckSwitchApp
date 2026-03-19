let oldDeck;
let newDeck;
document.getElementById("submitbtn").addEventListener("click", function () {
   

  oldDeck = document
    .getElementById("oldDeck")
    .value.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  newDeck = document
    .getElementById("newDeck")
    .value.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

  cleanUpLists(oldDeck);
  cleanUpLists(newDeck);

  // Parse into maps
  oldDeck = new Map(Object.entries(parseDeckToMap(oldDeck)));
newDeck = new Map(Object.entries(parseDeckToMap(newDeck)));


  // Compare the decks and display results
  // compareLists(oldDeck, newDeck);



  //const updatedDeck = getDeckSimilarities(oldDeck, newDeck); //get what's common in both old and new deck
  const toGetRemovedFromDeck = getToGetRemoved(oldDeck, newDeck);
  const toGetAddedToDeck = getToGetAdded(oldDeck, newDeck);

  printDifferences(toGetRemovedFromDeck, toGetAddedToDeck);

});

// removes the titles in the decklist
function cleanUpLists(list) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (
      list[i].includes("Pokémon: ") ||
      list[i].includes("Trainer: ") ||
      list[i].includes("Energy: ") ||
      list[i] === ""
    ) {
      list.splice(i, 1);
    }
  }
}

// function to parse lines into a map
//Key: cardname, value: quantity
//ex. Toxel PFL 67 : 3
function parseDeckToMap(deckLines) {
  const deckMap = {};
  for (const line of deckLines) {
    const parts = line.split(/\s+/); // Split by spaces
    if (parts.length >= 2) {
      const quantity = parseInt(parts[0], 10);
      let cardName = parts.slice(1).join(" "); // Everything after the number

      if (!isNaN(quantity) && quantity > 0) {
        // Normalize the card name by removing set code at the end
        cardName = normalizeCardName(cardName);

        deckMap[cardName] = (deckMap[cardName] || 0) + quantity;
      }
    }
  }
  return deckMap;
}

// Helper function to remove the set code and number
function normalizeCardName(cardName) {
  // Matches space, 3 letters, space, then 1-3 digit number at the end of string
  return cardName.replace(/\s+[A-Z]{2,3}\s+\d{1,3}$/, "").trim();
}

function getToGetRemoved(oldDeck, newDeck) {
  const result = new Map();

  for (const [key, value] of oldDeck) {
    if (!newDeck.has(key)) {
      result.set(key, value);
    } else if (newDeck.get(key) < value) {
      result.set(key, value - newDeck.get(key));
    }
  }

  return result;
}

function getToGetAdded(oldDeck, newDeck) {
  const result = new Map();

  for (const [key, value] of newDeck) {
    if (!oldDeck.has(key)) {
      result.set(key, value);
    } else if (value > oldDeck.get(key)) {
      result.set(key, value - oldDeck.get(key));
    }
  }

  return result;
}

function getDeckSimilarities(oldDeck, newDeck) {
  const result = new Map();

  for (const [key, value] of oldDeck.entries()) {
    if (newDeck.has(key) && newDeck.get(key) === value) {
      result.set(key, value);
    }
  }

  return result;
}

function printDifferences(toGetRemoved, toGetAdded) {
    const removeCardsContainer = document.getElementById("removeCardsContainer");
    const addCardsContainer = document.getElementById("addCardsContainer");
    removeCardsContainer.innerHTML = ''; // Clear previous results
    addCardsContainer.innerHTML = ''; // Clear previous results

    // Loop through items to remove
    toGetRemoved.forEach((value, key) => {
        const p = document.createElement('p');
        p.textContent = 'Remove ' + value + ' ' + key;
        removeCardsContainer.appendChild(p);
    });

    // Loop through items to add
    toGetAdded.forEach((value, key) => {
        const p = document.createElement('p');
        p.textContent = 'Add ' + value + ' ' + key;
        addCardsContainer.appendChild(p);
    });
}

/*Pokémon: 16
3 Toxel PFL 67
3 Toxtricity PFL 68
3 Munkidori TWM 95
2 Mega Absol ex MEG 86
1 Pecharunt ex SFA 39
1 Fezandipiti ex SFA 38
1 Budew PRE 4
1 Yveltal MEG 88
1 Brute Bonnet TWM 118

Trainer: 35
4 Lillie's Determination MEG 119
4 Arven OBF 186
3 Iono PAL 185
2 Boss's Orders MEG 114
4 Nest Ball SVI 181
3 Ultra Ball MEG 131
2 Energy Switch MEG 115
2 Super Rod PAL 188
2 Counter Catcher PAR 160
1 Unfair Stamp TWM 165
1 Buddy-Buddy Poffin TEF 144
1 Night Stretcher SFA 61
2 Air Balloon BLK 79
1 Technical Machine: Evolution PAR 178
1 Bravery Charm PAL 173
2 Artazon PAL 171

Energy: 9
9 Darkness Energy MEE 7*/
