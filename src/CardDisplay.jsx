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

  useEffect(() => {
    fetchNewDeck();
  }, []);

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
      // Deselect
      setSelectedCards(selectedCards.filter((selectedCard) => selectedCard !== card));
    } else if (selectedCards.length < cardsPerPlayer) {
      // Select
      setSelectedCards([...selectedCards, card]);
    }
  };

  const lockInPresetHand = () => {
    setPresetHand(selectedCards);
    // Remove selected cards from the deck
    setDeck(deck.filter((card) => !selectedCards.includes(card)));
    setSelectedCards([]); // Reset selection
  };

  const generateRandomHands = () => {
    let newHands = presetHand.length ? [presetHand] : [];
    let remainingDeck = [...deck.filter((card) => !presetHand.includes(card))];

    for (let i = newHands.length; i < players; i++) {
      let hand = [];
      for (let j = 0; j < cardsPerPlayer; j++) {
        let cardIndex = Math.floor(Math.random() * remainingDeck.length);
        hand.push(remainingDeck.splice(cardIndex, 1)[0]);
      }
      newHands.push(hand);
    }

    setHands(newHands);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4 fixed inset-y-0 left-0 overflow-auto">
      <div className="mb-4">
          <label htmlFor="num-players" className="block mb-2">Number of Players:</label>
          <input
            id="num-players"
            type="number"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
            className="text-black p-2 rounded w-full"
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
            className="text-black p-2 rounded w-full"
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
          disabled={selectedCards.length !== cardsPerPlayer}
          className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors w-full disabled:bg-green-200 disabled:cursor-not-allowed"
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
      <main className="flex-1 ml-64 mt-4">
        {showCardPicker && (
          <CardPicker
            availableCards={deck}
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
