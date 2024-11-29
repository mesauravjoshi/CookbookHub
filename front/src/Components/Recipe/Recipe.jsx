import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import Nav from '../Nav/Nav';
import RecipeNewest from './RecipeNewest';
import RecipeCat from './RecipeCat';
import RecipeCuisine from './RecipeCuisine';

function Recipe() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // state for login status


  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <center>
        <h2>.................... Recipes ....................</h2>
      </center>
      <RecipeNewest isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <RecipeCat/>
      <RecipeCuisine/>
    </>
  );
}

export default Recipe;