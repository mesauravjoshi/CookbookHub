import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import Nav from '../../Nav/Nav';
import MarkCode from '../../MarkCode';
import PageNotFound from '../../PageNotFound/PageNotFound';
import './MyRecipes.css'

function MyRecipes() {
  // const { _id } = useParams(); // Get username from URL
  const navigate = useNavigate(); // Use useNavigate hook
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [activeRecipeId, setActiveRecipeId] = useState(null); // State to track which recipe's dropdown is active

  const handleThreeDot = (recipeId) => {
    setActiveRecipeId(prevId => (prevId === recipeId ? null : recipeId));
  }

  // Close the dropdown if the user clicks outside of the card
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = event.target.closest('.bi-three-dots-vertical');
      if (!isClickInside) {
        setActiveRecipeId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // new 
    if (user && user.username) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage
          if (!token) {
            throw new Error('No authentication token found');
          } else {
            setShowSaveIcon(true)
          }
          // console.log(user);

          const response = await fetch(`http://localhost:3000/recipes/user_data/${user.username}`, {
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
          const updatedData = data.map(item => ({
            ...item, // spread the existing properties of the object
            isThreeDotShow: false // add isShow: true
          }));
          console.log(updatedData);
          setRecipes(updatedData);

          // Fetch bookmarks for the user-----------------------------------------
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

          if (bookmarksResponse.ok) {
            const bookmarksData = await bookmarksResponse.json();
            const bookmarkIds = bookmarksData.map(item => item.Post_id); // Assuming Post_id is the identifier
            console.log(bookmarksData);
            setBookmarkedItems(bookmarkIds);
          } else {
            console.log('Failed to fetch bookmarks');
          }
          // Fetch bookmarks for the user-----------------------------------------

        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoggedIn(false); // Set logged out state on error
        }
      }
      fetchData();
    } else {
      console.log('User is not logged in or no username found');
    }

  }, [user]);

  const handleDelete = async (_id) => {
    const isConfirmed = window.confirm('Do you want to delete this post?');
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/recipes/edit_recipe/${_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete recipe');
        }
  
        const result = await response.json();
        console.log('Post deleted');
        navigate('/profile/MyRecipes'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    } else {
      console.log('Post deletion canceled');
    }
  };
  

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
              <div className="my-card" key={index}>

                <div onClick={() => handleThreeDot(recipe._id)} className='three-dot'> <i className="bi bi-three-dots-vertical"></i> </div>
                {
                  activeRecipeId === recipe._id &&
                  <div className="post-mini-box">
                    <Link to={`/profile/EditRecipe/${recipe._id}`} className="link-style">
                      <div className='edit'>
                        <i className="bi bi-pen"></i>
                        Edit
                      </div>
                    </Link>
                    <div onClick={() => handleDelete(recipe._id)} className='delete'>
                      <i className="bi bi-trash3"></i>
                      Delete
                    </div>
                    <div className='delete'>
                      <i className="bi bi-share"></i>
                      Share
                    </div>
                  </div>
                }

                <span className="tag username-top"><span>Posted By:&nbsp;</span> {recipe.PostedBy.username}</span>
                <img src={recipe.Image_URL} alt="Lago di Braies" />
                <div className="card__details">
                  <div className='psot-line'>
                    <span className="tag">Category: {recipe.Category}</span>
                    <span className="tag">Cuisine: {recipe.Cuisine}</span>
                    {/* <span className="tag"> {recipe._id}</span> */}
                    {/* <Link to={`/EditEecipe/${recipe._id}`} > */}

                    {
                      showSaveIcon &&
                      <MarkCode
                        recipe={recipe}
                        bookmarkedItems={bookmarkedItems}
                        setBookmarkedItems={setBookmarkedItems} // Pass the state setter here
                      />
                    }
                  </div>
                  <div className="name">Recipes :
                    <p>
                      {recipe.Recipes}
                    </p>
                  </div>
                  <div className="name">Ingredients:
                    <p>
                      {(recipe.Ingredients).slice(0, 30)}
                      {/* {recipe.Ingredients}  */}
                    </p>
                  </div>
                  <Link to={`/recipe/${recipe._id}`}>
                    <button className="read-more">Read more</button>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      }

    </>
  );
}

export default MyRecipes;