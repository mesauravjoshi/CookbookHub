import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import { url } from '../ApiUrl/Url';

function SearchBox({ setIsSearchOpen }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggest, setFilteredSuggest] = useState([]);
  const searchBoxRef = useRef(null);

  // Close the search box if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsSearchOpen]);

  // Fetch search suggestions from the backend API
  const fetchSuggestions = async (query) => {
    if (query.length > 0) {
      try {
        // const response = await fetch(`/search/searchSuggestions?query=${query}`);

        const response = await fetch(`${url}/search/searchSuggestions?query=${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        //   body: JSON.stringify({ search: [arraySuggestion] }),
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setFilteredSuggest(data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setFilteredSuggest([]);
    }
  };

  // Handle input change and fetch suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  // Handle search query submission
  const handleQuerySearch = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) navigate(`/search/${searchQuery}`);
  };

  // Handle click on a suggestion
  const handleCLickSuggestion = (item) => {
    setSearchQuery(item);
    setFilteredSuggest([]);
    navigate(`/search/${item}`);
  };

  return (
    <div ref={searchBoxRef} className="search-box-input">
      <input
        type="text"
        placeholder="Search for Recipes, Category, Ingredients, ..."
        autoFocus
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button className="search-icon" onClick={handleQuerySearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="#f13b16"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      {filteredSuggest.length > 0 && (
        <div className="suggestion-list">
          {filteredSuggest.map((item, index) => (
            <div
              className="sesarched-item"
              key={index}
              onClick={() => handleCLickSuggestion(item)}
            >
              <h5>{item}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
