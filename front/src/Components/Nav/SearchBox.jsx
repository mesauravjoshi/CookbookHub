import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBox() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggest, setSuggest] = useState([]);
    const [filteredSuggest, setFilteredSuggest] = useState([]);

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchQuery(value);

        if (value.length > 0) {
            const filteredSuggestion = suggest.filter(item =>
                item.toLowerCase().startsWith(value.toLowerCase())
            )
            // Limit the filtered suggestions to 3 or fewer items
            const limitedFilteredSuggestion = filteredSuggestion.slice(0, 3);

            // Update the state with the limited suggestions
            setFilteredSuggest(limitedFilteredSuggestion);
        } else {
            setFilteredSuggest([])
        }
    };

    const handleQuerySearch = async (e) => {
        e.preventDefault()
        if (searchQuery.length > 0) navigate(`/search/${searchQuery}`)
    }

    useEffect(() => {
        const searchSuggestion = ["Asian", "Bacon", "Barbecue", "Baked", "Beef Wellington", "Biryani", "Caesar Salad", "Cheese", "Chicken", "Chicken Parmesan", "Chicken Tikka Masala", "Chocolate", "Chocolate Mousse", "Chinese", "Comfort", "Comfort Food", "Crispy", "Creamy", "Dessert", "Drink", "Eggplant Parmesan", "Grilled", "Grilled Salmon", "Healthy", "Indian", "Italian", "Lamb Chops with Mint Sauce", "Light", "Lassi", "Lobster Bisque", "Main", "Main Course", "Mango", "Manchurian", "Mushroom Risotto", "Pasta", "Pulled Pork Sandwiches", "Refreshing", "Rice", "Roast", "Salad", "Saucy", "Seafood", "Shrimp Scampi", "Spaghetti", "Spaghetti Carbonara", "Soup", "Spicy", "Sweet", "Vegetable", "Vegan", "Vegetarian"];
        setSuggest(searchSuggestion)
    }, []);

    const handleCLickSuggestion = (item) => {
        // console.log(e.target.getAttribute('data-id'));
        setSearchQuery(item);
        setFilteredSuggest([]);
        if (searchQuery.length > 0) navigate(`/search/${item}`)
    }
    return (
        <>
            <div className="search-box-input">
                <input type="text" placeholder="Search..." autoFocus
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button onClick={handleQuerySearch}> sesarch</button>
                {
                    filteredSuggest.length > 0 &&
                    <div className='suggestion-list' >
                        {
                            filteredSuggest.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => handleCLickSuggestion(item)} >
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