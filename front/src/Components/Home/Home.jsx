// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Home.css';
import Nav from '../Nav/Nav';
import Hero from './Hero';
import MarkCode from '../MarkCode';

function Home() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && user.username) {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(atob(token.split('.')[1]));
          setUser(userData);
        }
        try {
          const recipesResponse = await fetch(`http://localhost:3000/recipes/data/?_limit=4&_page=${page}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (recipesResponse.status === 401) {
            setIsLoggedIn(false);
            return;
          }

          if (!recipesResponse.ok) {
            throw new Error('Network response was not ok');
          }

          const recipesData = await recipesResponse.json();
          // console.log(recipesData);
          
          setRecipes((prev) => [...prev, ...recipesData]);

          const bookmarksResponse = await fetch(`http://localhost:3000/bookmark/bookmarks/${user.username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!bookmarksResponse.ok) {
            throw new Error('Network response was not ok');
          }

          const bookmarksData = await bookmarksResponse.json();
          const bookmarkIds = bookmarksData.map((item) => item.Post_id);
          setBookmarkedItems(bookmarkIds);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoggedIn(false);
        }
      };

      fetchData();
    }
  }, [page]);
console.log(recipes.length);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <Hero />
      {isLoggedIn && (
        <div id="container">
          {recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <div className="car-iamge">
                <img src={recipe.Image_URL} alt="Recipe" />
              </div>
              <div className="card__details">
                <div className="psot-line">
                  <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                  <span className="tag">{recipe.PostedBy.username}</span>
                  <MarkCode
                    recipe={recipe}
                    bookmarkedItems={bookmarkedItems}
                    setBookmarkedItems={setBookmarkedItems} // Pass the state setter here
                  />
                </div>

                <div className="name">Recipe Name: <p>{recipe.Recipes}</p></div>
                <div className="name">Ingredients: <p>{recipe.Ingredients}</p></div>
                <div className="name">Instructions: <p>{recipe.Instructions}</p></div>

                <Link to={`/recipe/${recipe._id}`}>
                  <button className="read-more">Read more</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;