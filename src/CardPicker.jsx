const CardPicker = ({ availableCards, selectedCards, onCardSelect }) => {
  // Create a sorted array for display purposes
  const sortedCards = [...availableCards].sort((a, b) => {
    // Compare suits first
    if (a.Suit !== b.Suit) {
      return a.Suit.localeCompare(b.Suit);
    }
    // If suits are the same, sort by value
    return a.Value - b.Value;
  });

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 p-2">
      {sortedCards.map((card, index) => (
        <div
          key={index}  // Since this is for display, and we're not modifying the list, index is okay
          className={`p-1 ${selectedCards.includes(card) ? 'ring-4 ring-blue-300' : 'ring-1 ring-gray-300'} rounded cursor-pointer`}
          onClick={() => onCardSelect(card)}
        >
          <img src={card.ImagePath} alt={`Card ${card.Value} of ${card.Suit}`} className="w-16 h-auto rounded" />
        </div>
      ))}
    </div>
  );
};

export default CardPicker;
