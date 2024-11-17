import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import Nav from '../../Nav/Nav';
import MarkCode from '../../MarkCode';
import PageNotFound from '../../PageNotFound/PageNotFound';
import './MyRecipes.css'

function MyRecipes() {
  // const { _id } = useParams(); // Get username from URL
  const navigate = useNavigate(); // Use useNavigate hook
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const { user, } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    // new 
    if (user && user.username) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage
          if (!token) {
            throw new Error('No authentication token found');
          } else{
              setShowSaveIcon(true)
          }
          console.log(user.username);

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
          setRecipes(data);
          console.log(recipes);

          // Fetch bookmarks for the user-----------------------------------------
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
    // old 

  }, [user]);

  const handleDelete = async (_id) => {
    alert('Want to delete post ?')
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
      console.log(result.message); // Log success message
      console.log('post deleted');
      
      navigate('/profile/MyRecipes'); // You can change this to whatever route you want
    } catch (error) {
      console.error('Error deleting recipe:', error);
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
              <div className="card" key={index}>
                <img src={recipe.Image_URL} alt="Lago di Braies" />
                <div className="card__details">
                  <div className='psot-line'>
                    <span className="tag">Category: {recipe.Category}</span>
                    <span className="tag">Cuisine: {recipe.Cuisine}</span>
                    <span className="tag"> {recipe._id}</span>
                    {/* <Link to={`/EditEecipe/${recipe._id}`} > */}
                    <Link to={`/profile/EditRecipe/${recipe._id}`} >
                    <div className='edit'> edit </div>

                    <div>
                    <i onClick={() => handleDelete(recipe._id)} className="bi bi-trash3" style={{ color: 'red' }}></i>
                    </div>

                    </Link>
                    {
                      showSaveIcon &&
                      <MarkCode
                        recipe={recipe}
                        bookmarkedItems={bookmarkedItems}
                        setBookmarkedItems={setBookmarkedItems} // Pass the state setter here
                      />
                    }
                  </div>
                  <div className="name">Recipes Nameeeeeeeeeee:
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