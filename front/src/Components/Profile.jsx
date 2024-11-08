import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from './UserContext';
// import './Home.css'
import Nav from './Nav/Nav';
import PageNotFound from './PageNotFound/PageNotFound';

function Profile() {
  const { username } = useParams(); // Get username from URL
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
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

  const toggleBookmark = async (item) => {
    if (bookmarkedItems.includes(item._id)) {
      // Remove from bookmarks
      const updatedBookmarkedItems = bookmarkedItems.filter((id) => id !== item._id);
      console.log('Removing bookmark for:', updatedBookmarkedItems);

      const saving_post = {
        Post_id: item._id,
        Image_URL: item.Image_URL,
        Recipes: item.Recipes,
        Ingredients: item.Ingredients,
        Instructions: item.Instructions,
        PostedBy: {
          name: item.PostedBy.name,
          username: item.PostedBy.username,
          _id: item.PostedBy._id
        }
      };

      const response = await fetch('http://localhost:3000/bookmark/bookmark_remove', {
        method: 'POST',
        body: JSON.stringify(saving_post), // Adjust saved_by as needed
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); // Read the response data
        console.log('Removed bookmark:', data);
        setBookmarkedItems(updatedBookmarkedItems); // Update state only if deletion was successful
      } else {
        console.log('Failed to remove bookmark');
      }
    } else {
      // Add to bookmarks
      const updatedBookmarkedItems = [...bookmarkedItems, item._id];
      setBookmarkedItems(updatedBookmarkedItems);

      const saving_post = {
        Post_id: item._id,
        Image_URL: item.Image_URL,
        Recipes: item.Recipes,
        Ingredients: item.Ingredients,
        Instructions: item.Instructions,
        PostedBy: {
          name: item.PostedBy.name,
          username: item.PostedBy.username,
          _id: item.PostedBy._id
        }
      };

      const response = await fetch('http://localhost:3000/bookmark/bookmark_add', {
        method: 'POST',
        body: JSON.stringify(saving_post), // Send specific item
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); // Read the response data
        console.log('Added bookmark:', data);
      } else {
        console.log('Failed to add bookmark');
        // If the add fails, consider reverting the state change
        setBookmarkedItems(bookmarkedItems); // Revert to previous state
      }
    }
    // Log the current state of bookmarkedItems after updates
    console.log('Current bookmarkedItems: ', bookmarkedItems);
  };
  console.log(recipes);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      <div>
        {isLoggedIn && user ? (
          <h1>Hello {user.username}!</h1>
        ) : (
          <div>
            <PageNotFound/>
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
                  <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                  <span className="tag">Username: {recipe.PostedBy.username}</span>

                  <svg onClick={() => toggleBookmark(recipe)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                    {
                      bookmarkedItems.includes(recipe._id) ?
                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                        :
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    }
                  </svg>
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