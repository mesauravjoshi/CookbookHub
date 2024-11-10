import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import Nav from './Nav/Nav';

function Bookmark() {
  const { user, setUser } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status

  console.log(recipes);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }

    const fetchData = async () => {
      try {
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
        const bookmarksData = await bookmarksResponse.json();
        setRecipes(bookmarksData);

        setBookmarkedItems(bookmarksData.map(item => item.Post_id)); // Populate bookmarked items
        // console.log(recipes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setUser]);

  const toggleBookmark = async (item) => {
    console.log(item.Post_id);

    const saving_post = {
      Post_id: item.Post_id,
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
    console.log(saving_post);

    const response = await fetch('http://localhost:3000/bookmark/bookmark_remove', {
      method: 'POST',
      body: JSON.stringify(saving_post),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Removed bookmark:', data);
      // Refresh the page after successful removal
      window.location.reload();
    } else {
      console.log('Failed to remove bookmark');
    }
    // console.log(recipes);
  };

  return (
    <div>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      {user ? (
        <h1>Welcome back, {user.username}!</h1>
      ) : (
        <h1>Please log in.</h1>
      )}

      {
        recipes.length === 0 ?
          <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="text-center">
                    <h3 className="h2 mb-2">No bookmarks saved.</h3>
                    <h4> </h4>
                    <a className="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6 m-0" href="/home" role="button">Add to bookmarks <i className="bi bi-bookmark-plus"></i> </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          :
          <div id="container">
            {recipes.map((recipe, index) => (
              <div className="card" key={index}>
                <img src={recipe.Image_URL} alt="Recipe" />
                <div className="card__details">
                  <div className='psot-line'>

                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span>

                    <svg onClick={() => toggleBookmark(recipe)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                      {
                        bookmarkedItems.includes(recipe._id) ?
                          null
                          :
                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                      }
                    </svg>
                  </div>

                  <div className="name">Recipe Name:
                    <p>{recipe.Recipes}</p>
                  </div>
                  <div className="name">Ingredients:
                    <p>{recipe.Ingredients}</p>
                  </div>
                  <div className="name">Instructions to make Recipe:
                    <p>{recipe.Instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

    </div>
  );
}

export default Bookmark;