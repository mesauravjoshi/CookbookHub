import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import Nav from '../Nav/Nav';
import RecipeNewest from './RecipeNewest';
import RecipeCat from './RecipeCat';
import RecipeCuisine from './RecipeCuisine';
import { useNavigate } from 'react-router-dom';
import './Recipe.css'

function Recipe() {
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // state for login status

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <center>
        <h2>.................... Recipes ....................</h2>
      </center>
      <RecipeNewest isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <RecipeCat />
      <RecipeCuisine />
    </>
  );
}

export default Recipe;