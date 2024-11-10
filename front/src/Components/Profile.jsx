import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import Nav from './Nav/Nav';
import MarkCode from './MarkCode';
import PageNotFound from './PageNotFound/PageNotFound';

function Profile() {
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const { username } = useParams(); // Get username from URL
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setShowSaveIcon(true)
      setUser(userData);
    }

    const fetchData = async () => {
      try {
        // Fetch single user recipes
        try {
          const response = await fetch(`http://localhost:3000/recipes/user_data/${username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.status === 401) {
            // Token is expired or invalid
            setShowSaveIcon(false)
            setIsLoggedIn(false);
            // setUser(null); // Clear user context
            return; // Exit the function
          }
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRecipes(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoggedIn(false); // Set logged out state on error
        }

        // Fetch bookmarks for the user
        const bookmarksResponse = await fetch('http://localhost:3000/bookmark/bookmarks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!bookmarksResponse.ok) {
          throw new Error('Network response was not ok');
        }

        if (bookmarksResponse.ok) {
          console.log('inside if else line 55');
          const bookmarksData = await bookmarksResponse.json();
          const bookmarkIds = bookmarksData.map(item => item.Post_id); // Assuming Post_id is the identifier
          console.log(bookmarkIds);
          setBookmarkedItems(bookmarkIds);
        } else {
          console.log('Failed to fetch bookmarks');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      <div>
        {isLoggedIn && user ? (
          <h1>Hello {user.username}!</h1>
        ) : (
          <div>
            <PageNotFound />
          </div>
        )}
      </div>

      {
        isLoggedIn &&
        <div id="container">
          {
            recipes.map((recipe, index) => (
              <div className="card" key={index}>
                <img src={recipe.Image_URL} alt="Lago di Braies" />
                <div className="card__details">
                  <div className='psot-line'>
                    <span className="tag">Category: {(recipe.Category).substring(0, 10)}</span>
                    <span className="tag">Cuisine: {(recipe.Cuisine).substring(0, 10)}</span>
                    {
                      showSaveIcon &&
                      <MarkCode
                        recipe={recipe}
                        bookmarkedItems={bookmarkedItems}
                        setBookmarkedItems={setBookmarkedItems} // Pass the state setter here
                      />
                    }
                  </div>
                  <div className="name">Recipes Name:
                    <p>
                      {recipe.Recipes}
                    </p>
                  </div>
                  <div className="name">Ingredients:
                    <p>
                      {recipe.Ingredients}
                    </p>
                  </div>
                  <div className="name">Instructions to make Recipes:
                    <p>{recipe.Instructions}</p>
                  </div>
                  <button className="read-more">Read more</button>
                </div>
              </div>
            ))
          }
        </div>
      }

    </>
  );
}

export default Profile;