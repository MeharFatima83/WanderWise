import React from 'react';

const PlaceCard = ({ place, onSelect, isSelected = false }) => {
  const getPriceRangeColor = (priceRange) => {
    switch (priceRange) {
      case 'budget': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'luxury': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className={`bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect && onSelect(place)}
    >
      {/* Image Section */}
      <div className="relative">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
          {place.category}
        </div>
        <div className="absolute top-3 right-3 bg-yellow-400 px-2 py-1 rounded-md text-sm font-semibold">
          ⭐ {place.rating}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-800">{place.name}</h3>
        <p className="text-gray-600 text-sm">📍 {place.location}</p>
        <p className="text-gray-700 text-sm">{place.description}</p>

        {/* Price & Days */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-gray-500 text-sm">Duration</p>
            <p className="font-semibold">{place.days}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Price</p>
            <p className="font-bold text-lg" style={{ color: getPriceRangeColor(place.priceRange) }}>
              ₹{place.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Button */}
        {onSelect && (
          <button
            className={`mt-4 w-full py-2 rounded-lg text-white font-semibold ${
              isSelected ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
