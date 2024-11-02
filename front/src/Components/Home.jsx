import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css'
import Nav from './Nav/Nav';

function Home() {
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
        // Fetch recipes
        const recipesResponse = await fetch('http://localhost:3000/recipes/data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (recipesResponse.status === 401) {
          setIsLoggedIn(false);
          return; // Exit the function
        }

        if (!recipesResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const recipesData = await recipesResponse.json();
        console.log(recipesData);
        setRecipes(recipesData);

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

  return (
    <>
      <Nav />

      <div>
        {isLoggedIn && user ? (
          <center><h1>Welcome, {user.username}</h1></center>
        ) : (
          <center> <h1>Welcome to CookbookHub </h1><h1> <a href="/login">LogIn</a> to Post your Recipes</h1></center>
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
                </div>
              </div>
            ))
          }
        </div>
      }

      {/* Default Post */}
      <div id="container">
        <div className="card" >
          <img src='https://images.pexels.com/photos/8105093/pexels-photo-8105093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt="Lago di Braies" />
          <div className="card__details">
            <span className="tag">Posted By: CookbookHub</span>
            <div className="name">Recipes Name:
              <p>
                Dalgona coffee
              </p>
            </div>
            <div className="name">Ingredients:
              <p>
                2 tablespoons instant coffee <br />
                2 tablespoons sugar <br />
                2 tablespoons hot water <br />
                Milk (dairy or non-dairy, for serving) <br />
                Ice (optional, for iced coffee) <br />
              </p>
            </div>
            <div className="name">Instructions to make Recipes:
              <p>
                Combine Ingredients: In a mixing bowl, combine the instant coffee, sugar, and hot water. <br />
                Whip the Mixture: Using a hand mixer or a whisk, whip the mixture until it becomes light, fluffy, and forms stiff peaks. This usually takes about 2-5 minutes with a mixer or longer by hand. <br />
                Prepare the Milk: In a glass, fill it halfway with milk (hot or cold, depending on your preference) and add ice if desired. <br />
                Top with Coffee Foam: Spoon the whipped coffee mixture on top of the milk. <br />
                Mix and Enjoy: Stir the whipped coffee into the milk before drinking. Enjoy your creamy, frothy Dalgona coffee! <br />
              </p>
            </div>
            <button>Read more</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;