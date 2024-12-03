import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import Nav from '../Nav/Nav';
import RecipeNewest from './RecipeNewest';
import RecipeCat from './RecipeCat';
import RecipeCuisine from './RecipeCuisine';
import { useNavigate } from 'react-router-dom';
import './Recipe.css'


function Recipe() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [onURL, setOnURL] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // state for login status

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value);
    setOnURL(value);
  };

  const handleQuerySearch = async (e) => {
    e.preventDefault()
    if (onURL.length > 0) navigate(`/search/${onURL}`)
  }

  useEffect(() => {
    const searchSuggestion = [
      "Asian", "Bacon", "Barbecue", "Baked", "Beef Wellington", "Biryani", "Curry", "Caesar Salad", "Cheese", "Chicken", "Chicken Parmesan", "Chicken Tikka Masala", "Chocolate", "Chocolate Mousse", "Chinese", "Comfort", "Comfort Food", "Crispy", "Creamy", "Dessert", "Drink", "Eggplant Parmesan", "Grilled", "Grilled Salmon", "Healthy", "Indian", "Italian", "Italian", "Lamb Chops with Mint Sauce", "Light", "Lassi", "Lobster Bisque", "Main", "Main Course", "Mango", "Manchurian", "Mushroom Risotto", "Pasta", "Pasta", "Pulled Pork Sandwiches", "Refreshing", "Rice", "Roast", "Salad", "Saucy", "Seafood", "Shrimp Scampi", "Spaghetti", "Spaghetti Carbonara", "Soup", "Spicy", "Sweet", "Tiramisu", "Vegetable", "Vegetable Stir-Fry", "Vegan", "Vegetarian"
    ];
    setSuggest(searchSuggestion)
  }, []);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <center>
        <form action="" onSubmit={handleQuerySearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <br />
          {
            searchQuery.length > 1 &&
            <div className='suggestion-list'>
              {
                suggest.map((item) => {
                  return (
                    <p>{item} </p>
                  )
                })
              }
            </div>
          }
          <button>submit</button>
        </form>
        <div>
        </div>
        <h2>.................... Recipes ....................</h2>


      </center>
      <RecipeNewest isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <RecipeCat />
      <RecipeCuisine />
    </>
  );
}

export default Recipe;