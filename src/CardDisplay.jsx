import React, { useState, useEffect } from "react";

const CardGame = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState(2);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  const [hands, setHands] = useState([]);

  useEffect(() => {
    const fetchDeck = async () => {
      const response = await fetch("http://localhost:8080/deck");
      const data = await response.json();
      setDeck(data);
    };

    fetchDeck();
  }, []);

  const generateHands = () => {
    let newHands = [];
    let remainingDeck = [...deck];

    for (let i = 0; i < players; i++) {
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
      <div className="w-64 bg-gray-800 text-white p-4 fixed inset-y-0 left-0">
        <h1 className="text-xl font-bold mb-4">Card Game Setup</h1>
        <div className="mb-4">
          <label className="block mb-2">Number of Players:</label>
          <input type="number" value={players} onChange={e => setPlayers(parseInt(e.target.value))}
                 className="text-black p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Cards per Player:</label>
          <input type="number" value={cardsPerPlayer} onChange={e => setCardsPerPlayer(parseInt(e.target.value))}
                 className="text-black p-2 rounded" />
        </div>
        <button onClick={generateHands} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors w-full">
          Generate Hands
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start ml-64 mt-4">
        {hands.map((hand, index) => (
          <div key={index} className="m-2 p-3 bg-gray-700 rounded shadow">
            <h2 className="font-semibold mb-2">Player {index + 1}</h2>
            <div className="flex flex-wrap justify-center">
              {hand.map(card => (
                <div key={card.ImagePath} className="m-1">
                  <img src={card.ImagePath} alt={`Card ${card.Value} of ${card.Suit}`} className="w-24 h-32 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default CardGame;
