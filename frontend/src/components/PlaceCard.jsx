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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'attraction': return '🎯';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'activity': return '🎪';
      case 'landmark': return '🏛️';
      default: return '📍';
    }
  };

  return (
    <div 
      className={`place-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(place)}
    >
      <div className="place-image">
        <img src={place.image} alt={place.name} />
        <div className="place-category">
          <span className="category-icon">{getCategoryIcon(place.category)}</span>
          <span className="category-text">{place.category}</span>
        </div>
        <div className="place-rating">
          <span className="rating-stars">⭐</span>
          <span className="rating-value">{place.rating}</span>
        </div>
      </div>
      
      <div className="place-content">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-location">📍 {place.location}</p>
        <p className="place-description">{place.description}</p>
        
        <div className="place-footer">
          <div 
            className="price-range"
            style={{ color: getPriceRangeColor(place.priceRange) }}
          >
            {place.priceRange.toUpperCase()}
          </div>
          {onSelect && (
            <button className="select-btn">
              {isSelected ? 'Selected' : 'Select'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
