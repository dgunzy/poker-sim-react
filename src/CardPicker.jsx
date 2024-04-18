const CardPicker = ({ availableCards, selectedCards, onCardSelect }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
        {availableCards.map((card) => (
          <div
            key={card.ImagePath}
            className={`p-1 ${
              selectedCards.includes(card) ? 'ring-4 ring-blue-300' : 'ring-1 ring-gray-300'
            } rounded cursor-pointer`}
            onClick={() => onCardSelect(card)}
          >
            <img src={card.ImagePath} alt={`Card ${card.Value} of ${card.Suit}`} className="w-full h-auto rounded" />
          </div>
        ))}
      </div>
    );
  };
  
  export default CardPicker;