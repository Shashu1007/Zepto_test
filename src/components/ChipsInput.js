import React, { useState, useEffect, useRef } from 'react';
import './ChipsInput.css';

import Drug from '../Resources/Drugs.png';
import Electronics from '../Resources/Electronic.png';
import Foods from '../Resources/Food.png';
import Groceries from '../Resources/Grocery.png';
import Stationaries from '../Resources/Stationary.png';

const ChipsInput = () => {
  const [inputValue, setInputValue] = useState(''); 
  const [chips, setChips] = useState([]);
  const [suggestions, setSuggestions] = useState([
    //Option are Drugs,Electronic,Food,Grocercy and Stationary
    { name: 'Drugs', description: 'Get medicinies for emergencies', image: Drug },
    { name: 'Electronic', description: 'Get the electronic gadgets here', image: Electronics },
    { name: 'Food', description: 'Find out the best restaurants to eat', image: Foods },
    { name: 'Grocery', description: 'Shop the household groceries', image: Groceries },
    { name: 'Stationary', description: 'Stationary products like pen,pencil etc.', image: Stationaries },
   
    

  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filteredSuggestions = suggestions.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    const sortedSuggestions = filteredSuggestions.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredSuggestions(sortedSuggestions);

    setShowSuggestions(value.trim() !== '');
  };

  const handleItemClick = (item) => {
    setChips([...chips, item]);
    const updatedSuggestions = suggestions.filter(suggestion => suggestion !== item);
    setSuggestions(updatedSuggestions);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleChipRemove = (chip) => {
    const updatedChips = chips.filter(item => item !== chip);
    setChips(updatedChips);
    setSuggestions([...suggestions, chip]);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      handleItemClick(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionClick = (item) => {
    handleItemClick(item);
  };

  const handleSuggestionHover = (item) => {
    setHighlightedSuggestion(item);
  };

  useEffect(() => {
    const handleBackspace = (e) => {
      if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
        const lastChip = chips[chips.length - 1];
        handleChipRemove(lastChip);
      }
    };

    document.addEventListener('keydown', handleBackspace);

    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [inputValue, chips, handleChipRemove]);

  useEffect(() => {
    if (inputRef.current) {
      const inputWidth = inputRef.current.offsetWidth;
      const suggestionsList = document.querySelector('.suggestions');
      if (suggestionsList) {
        suggestionsList.style.width = `${inputWidth}px`;
      }
    }
  }, [inputValue, showSuggestions]);

  return (
    <div className="app-container">
      <div className="chips-container">
        {chips.map((chip, index) => (
          <div key={index} className="chip" onClick={() => handleChipRemove(chip)}>
            <img src={chip.image} alt={chip.name} className="chip-image" />
            {chip.name} <span>X</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder="Search for drugs, electronics, food, groceries, and stationeries etc..."
          ref={inputRef}
        />
        {showSuggestions && (
          <ul className={`suggestions ${filteredSuggestions.length === 0 ? 'hidden' : ''}`}>
            {filteredSuggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                onMouseEnter={() => handleSuggestionHover(item)}
                className={highlightedSuggestion === item ? 'highlighted' : ''}
              >
                <div className="suggestion-item">
                  <img src={item.image} alt={item.name} className="suggestion-image" />
                  <div>
                    <strong>{item.name}</strong>
                    <p className="small-font">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChipsInput;
