import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css'
import Nav from './Nav/Nav';
import Footer from './Footer/Footer';

function Home() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }

    const fetchData = async () => {
      try {
        // Fetch recipes
        const recipesResponse = await fetch(`http://localhost:3000/recipes/data/?_limit=4&_page=${page}`, {
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
        // console.log(recipesData);
        setRecipes((prev) => [...prev, ...recipesData]);

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
          // console.log('inside if else line 55');
          const bookmarksData = await bookmarksResponse.json();
          const bookmarkIds = bookmarksData.map(item => item.Post_id); // Assuming Post_id is the identifier
          // console.log(bookmarkIds);
          setBookmarkedItems(bookmarkIds);
        } else {
          console.log('Failed to fetch bookmarks');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page]);

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
  // console.log(isLoggedIn);

  const handleScroll = async () => {
    // console.log('scrollHeight', document.documentElement.scrollHeight);
    // console.log('innerHeight', window.innerHeight);
    // console.log('scrollTop', document.documentElement.scrollTop);
    try {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])



  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      <div className='welcome-title' >
        {isLoggedIn && user ? (
          <div className="tagline">
            <div className="heading">

            <center>
              <h1 id="custom-h1">
                Discover and Share Amazing Recipes! <br />
                {/* <div className='svg-cook'> */}

                <svg xmlns="http://www.w3.org/2000/svg" height="175px" viewBox="0 -960 960 960" width="175px" fill="#EA3323"><path d="M198.16-547.9q9.38-34.46.26-62.08-9.11-27.61-33.26-60.23-29.93-39.61-39.85-73-9.92-33.38-4.85-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 32.99 43.3 42.92 76.69 9.92 33.38 3 77h-59.15Zm158.46 0q9.38-34.46.57-62.08-8.8-27.61-32.96-60.23-29.92-39.61-40.15-73-10.23-33.38-5.16-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 33 43.3 42.92 76.69 9.92 33.38 3 77h-59.15Zm160 0q9.38-34.46.38-62.08-9-27.61-33.15-60.23-29.93-39.61-39.96-73-10.04-33.38-4.97-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 33 43.3 42.92 76.69 9.92 33.38 3 77h-59.15ZM200-180q-41.92 0-70.96-29.04Q100-238.08 100-280v-180h540.62q3.07-32.08 22.96-56.81 19.88-24.73 50.34-34.96l176.54-59.3 18.85 56.76L732.77-495q-14.69 4.77-23.73 17.58-9.04 12.81-9.04 28.5V-280q0 41.54-29.04 70.77Q641.92-180 600-180H200Zm0-60h400q17 0 28.5-11.5T640-280v-120H160v120q0 17 11.5 28.5T200-240Zm200-80Z" /></svg>
                {/* </div> */}

              </h1>
            </center>
            </div>

            <div className='tagline-but'>
              <button>Browse Recipes </button>
              <button>Sign Up</button>
            </div>
          </div>

        ) : (
          <center> <h1>Welcome to
            <a className="brand_name" href="#"> C<span>oo</span>kb<span>oo</span>kHub </a>
          </h1><h1> <a className='welcome_login' href="/login">LogIn</a> to Post your Recipes</h1>
          </center>
        )}
      </div>

      {
        isLoggedIn &&
        <div id="container">
          {
            recipes.map((recipe, index) => (
              <div className="card" key={index}>
                <div className="car-iamge">
                  <img src={recipe.Image_URL} alt="Recipe" />
                </div>
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
                    <p>{recipe.Recipes}</p>
                  </div>
                  <div className="name">Ingredients:
                    <p>{recipe.Ingredients}</p>
                  </div>
                  <div className="name">Instructions to make Recipes:
                    <p>{recipe.Instructions}</p>
                  </div>
                  {/* Fixed Read More button */}
                  <Link to={`/recipe/${recipe._id}`}>
                  <button  className="read-more">Read more</button>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      }
      {/* <Footer/> */}

    </>
  );
}

export default Home;