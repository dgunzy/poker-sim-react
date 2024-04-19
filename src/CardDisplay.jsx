import React, { useState, useEffect } from 'react';
import CardPicker from './CardPicker'; // Make sure the file name matches the import exactly.
const CardGame = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState(2);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  const [hands, setHands] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [presetHand, setPresetHand] = useState([]);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNewDeck();
  }, []);

  const validateTotalCards = () => {
    if (players * cardsPerPlayer > 52) {
      setError("The total number of cards exceeds the limit of 52.");
      return false;
    }
    setError("");
    return true;
  };
  
  const fetchNewDeck = async () => {
    const response = await fetch('http://localhost:8080/deck');
    const data = await response.json();
    setDeck(data);
    setHands([]);
    setPresetHand([]);
    setSelectedCards([]);
  };

  const toggleCardPicker = () => {
    setShowCardPicker(!showCardPicker);
  };
  const resetGame = () => {
    fetchNewDeck(); // Fetch a new deck and reset the game state
  };

  const handleCardSelection = (card) => {
    if (selectedCards.includes(card)) {
      // Deselect the card
      const newSelectedCards = selectedCards.filter((selectedCard) => selectedCard !== card);
      setSelectedCards(newSelectedCards);
      // Update cardsPerPlayer to match the length of the new selected cards array
      setCardsPerPlayer(newSelectedCards.length);
    } else if (selectedCards.length < 52) { // You should also check against the total deck size here
      // Select the card
      const newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);
      // Update cardsPerPlayer to match the length of the new selected cards array
      setCardsPerPlayer(newSelectedCards.length);
    }
  };

  const lockInPresetHand = () => {
    if (selectedCards.length > 0 && selectedCards.length <= 52) {
      setPresetHand([...selectedCards]);
      setCardsPerPlayer(selectedCards.length); // Set cards per player to match selected cards
      const newDeck = deck.filter((card) => !selectedCards.includes(card));
      setDeck(newDeck);
      setSelectedCards([]); // Reset selection
    } else {
      console.error('Invalid number of selected cards.');
    }
  };

  const generateRandomHands = () => {
    if (!validateTotalCards()) {
      return; // Stop the function if validation fails
    }
    let newHands = presetHand.length ? [presetHand] : []; // Start with preset hand if it exists
    let remainingDeck = [...deck]; // Clone the deck for manipulation
  
    // If there is a preset hand, the number of hands to generate is reduced by one
    for (let i = newHands.length; i < players; i++) {
      let hand = [];
      for (let j = 0; j < cardsPerPlayer; j++) {
        let cardIndex = Math.floor(Math.random() * remainingDeck.length);
        hand.push(remainingDeck.splice(cardIndex, 1)[0]);
      }
      newHands.push(hand);
    }
  
    setHands(newHands); // Set the new hands
    setShowCardPicker(false); // Hide the card picker
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4 fixed inset-y-0 left-0 overflow-auto">
      {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{error}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.846l-2.651 2.998a1.2 1.2 0 1 1-1.697-1.697l2.998-2.651-2.998-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.154l2.651-2.998a1.2 1.2 0 1 1 1.697 1.697l-2.998 2.651 2.998 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
    </span>
  </div>
)}
      <div className="mb-4">
          <label htmlFor="num-players" className="block mb-2">Number of Players:</label>
          <input
            id="num-players"
            type="number"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
            className="text-white bg-gray-700 p-2 rounded w-full"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cards-per-player" className="block mb-2">Cards per Player:</label>
          <input
            id="cards-per-player"
            type="number"
            value={cardsPerPlayer}
            onChange={(e) => setCardsPerPlayer(parseInt(e.target.value, 10))}
            className="text-white bg-gray-700 p-2 rounded w-full"
            min="1"
          />
        </div>
        <button onClick={toggleCardPicker} className="px-4 py-2 mt-2 bg-purple-500 hover:bg-purple-600 rounded text-white transition-colors w-full">
          {showCardPicker ? 'Hide Card Picker' : 'Show Card Picker'}
        </button>
        <button onClick={resetGame} className="px-4 py-2 mt-2 bg-red-500 hover:bg-red-600 rounded text-white transition-colors w-full">
          Reset Game
        </button>
        <button
        onClick={lockInPresetHand}
          className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors w-full"
        >
  Lock In Preset Hand
</button>
        <button
          onClick={generateRandomHands}
          className="px-4 py-2 mt-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors w-full"
        >
          Generate Hands
        </button>
      </aside>
      <main className="flex-grow pt-4 pl-64">
      {showCardPicker && (
      <CardPicker
        availableCards={deck.sort((a, b) => a.Value - b.Value)} // Sort the cards for display
      selectedCards={selectedCards}
        onCardSelect={handleCardSelection}
      />
        )}
        <section className="mt-8">
          {hands.map((hand, index) => (
            <div key={index} className="m-2 p-3 bg-gray-700 rounded shadow">
              <h2 className="font-semibold mb-2">Player {index + 1}</h2>
              <div className="flex flex-wrap justify-center">
                {hand.map((card, cardIndex) => (
                  <div key={cardIndex} className="m-1"> {/* Use index since ImagePath can repeat if the deck is reset */}
                    <img src={card.ImagePath} alt={`Card ${card.Value} of ${card.Suit}`} className="w-24 h-auto rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};


export default CardGame;
