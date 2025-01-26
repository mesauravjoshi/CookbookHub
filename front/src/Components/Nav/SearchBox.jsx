import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css'

const suggest = [
    'American', 'Appetizer', 'Asian', 'Baked', 'Beverage', 'Breakfast', 'Bruschetta al Pomodoro', 'Caesar Salad', 'Chocolate', 'Chocolate Chip Cookies', 'Classic Coffee', 'Coffee', 'Comfort Drink', 'Comfort Food', 'Dessert', 'Dinner', 'Drink', 'Egg Salad Sandwich', 'Fluffy Pancakes', 'Fresh', 'Fried', 'Gluten-Free', 'Healthy', 'Hotteok', 'Indian', 'Italian', 'Korean', 'Lunch', 'Main Course', 'Mango Lassi', 'Oi Muchim (Spicy Korean Cucumber Salad)', 'Pancakes', 'Pasta', 'Pasta Aglio e Olio', 'Protein', 'Quick', 'Quinoa', 'Quinoa Stir Fry', 'Refreshing', 'Rice', 'Salad', 'Sandwich', 'Side Dish', 'Snack', 'Spicy', 'Stir Fry', 'Stir-Fry', 'Summer', 'Sweet', 'Tofu', 'Tofu Stir Fry ', 'Traditional', 'Vegetable Biryani', 'Vegetable Stir Fry', 'Vegetarian', 'Veggie Hummus Wrap'
];

function SearchBox({setIsSearchOpen }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    // const [suggest, setSuggest] = useState([]);
    const [filteredSuggest, setFilteredSuggest] = useState([]);

    // Create a ref to the search box element
    const searchBoxRef = useRef(null);

    // Close the search box if the user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setIsSearchOpen(false);  // Close the search box
            }
        };

        // Add event listener to document
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsSearchOpen]);

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchQuery(value);

        if (value.length > 0) {
            const filteredSuggestion = suggest.filter(item =>
                item.toLowerCase().startsWith(value.toLowerCase())
            )
            // Limit the filtered suggestions to 3 or fewer items
            const limitedFilteredSuggestion = filteredSuggestion.slice(0, 9);

            // Update the state with the limited suggestions
            setFilteredSuggest(limitedFilteredSuggestion);
        } else {
            setFilteredSuggest([])
        }
    };

    const handleQuerySearch = (e) => {
        e.preventDefault()
        if (searchQuery.length > 0) navigate(`/search/${searchQuery}`)
    }

    const handleCLickSuggestion = (item) => {
        setSearchQuery(item);
        setFilteredSuggest([]);
        if (searchQuery.length > 0) navigate(`/search/${item}`)
    }
    return (
        <>
            <div ref={searchBoxRef} className="search-box-input">
                <input type="text" placeholder="Search for Recipes, Category,  Ingredients, ..." autoFocus
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className='search-icon' onClick={handleQuerySearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#f13b16" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                            stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
                {/* <div>X</div> */}
                {
                    filteredSuggest.length > 0 &&
                    <div className='suggestion-list' >
                        {
                            filteredSuggest.map((item, index) => {
                                return (
                                    <div className='sesarched-item' key={index} onClick={() => handleCLickSuggestion(item)} >
                                        {/* <p >{item} </p> */}
                                        <h5 >{item} </h5>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

        </>
    )
}

export default SearchBox