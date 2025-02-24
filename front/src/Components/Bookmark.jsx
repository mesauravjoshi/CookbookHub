import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import { url } from './ApiUrl/Url';
import Nav from './Nav/Nav';

function Bookmark() {
  const { user, } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status

  useEffect(() => {
    if (user && user.username) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage
          const IDresponse = await fetch(`${url}/bookmark/bookmarks/${user.username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!IDresponse.ok) {
            throw new Error('Network response was not ok');
          }
          const IDresponseData = await IDresponse.json();
          // setRecipes(IDresponseData);

          setBookmarkedItems(IDresponseData.map(item => item.Post_id)); // Populate bookmarked items

          // console.log(recipes);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user]);
  // console.log(bookmarkedItems);

  useEffect(() => {
    const fetchBookmark = async () => {
      if (bookmarkedItems.length === 0) {
        // console.log('lenght is   0');
        return; // Avoid sending an empty array
      }
      else {

        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage
          const bookmarksResponse = await fetch(`${url}/bookmark/bookmarks/`, {
            method: 'POST',
            body: JSON.stringify({ ids: bookmarkedItems }), // Send the bookmarked items' IDs
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!bookmarksResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const bookmarksData = await bookmarksResponse.json();
          // console.log(bookmarksData);
          setRecipes(bookmarksData);  // Set the response data to `recipes`
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

    };

    fetchBookmark()
  }, [bookmarkedItems])

  const toggleBookmark = async (item) => {
    // console.log(item._id);

    const removing_post = {
      BookmarkBy: {
        username: user.username,
        _id: user.id
      },
      // Category: item.Category,
      // Cuisine: item.Cuisine,
      Post_id: item._id,
      // Image_URL: item.Image_URL,
      // Recipes: item.Recipes,
      // Ingredients: item.Ingredients,
      // Instructions: item.Instructions,
      // PostedBy: {
      //   name: item.PostedBy.name,
      //   username: item.PostedBy.username,
      //   _id: item.PostedBy._id
      // }
    };
    // console.log(removing_post);

    const response = await fetch(`${url}/bookmark/bookmark_remove`, {
      method: 'POST',
      body: JSON.stringify(removing_post),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      // const data = await response.json();
      // console.log('Removed bookmark:', data);
      setBookmarkedItems(prevBookmarkedItems => 
        prevBookmarkedItems.filter(bookmarkId => bookmarkId !== item._id)
      );
    } else {
      console.log('Failed to remove bookmark');
    }
  };
  // console.log(recipes);

  return (
    <div>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      {user ? (
        <h1>Welcome back, {user.username}!</h1>
      ) : (
        <h1>Please log in.</h1>
      )}
      {/* <button onClick={() => fetchBookmark()} >send</button> */}

      {
        recipes.length === 0 ?
          <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="text-center">
                    <h3 className="h2 mb-2">No bookmarks saved.</h3>
                    <h4> </h4>
                    <Link to={`/recipe`}
                      className="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6 m-0" role="button"
                    >
                      Add to bookmarks <i className="bi bi-bookmark-plus"></i>
                    </Link>
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

                    <span className="tag">CATE: {recipe.Category}</span>
                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span>
                    <span className="tag">id: {recipe._id}</span>

                    <svg onClick={() => toggleBookmark(recipe)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                      {
                        bookmarkedItems.includes(recipe._id) ?
                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                        :
                        null
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