import React,{useState,useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import Nav from '../Nav/Nav'
import './RecipeID.css'
import { useUser } from '../UserContext';

function RecipeID() {
    const { _id } = useParams(); // Get username from URL
    const [recipes, setRecipes] = useState([]);
    const { user, setUser } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
    console.log(_id);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = JSON.parse(atob(token.split('.')[1]));
            setUser(userData);
        }
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:3000/recipes/recipe/${_id}`, {
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
            console.log('fetched post by _id',data);
            
            setRecipes(data);
            } 
          catch (error) {
            console.error('Error fetching data:', error);
            setIsLoggedIn(false); // Set logged out state on error
          }
        };
        fetchData();
    }, []);
    return (
        <>
          <Nav isLoggedIn={isLoggedIn} user={user} />
          <div>
            <div id="Recipe-container">
            {
            recipes.map((recipe, index) => (
              <div className="Recipe-card" key={index}>
                <img src={recipe.Image_URL} alt="Recipe" />
                <div className="Recipe-card__details">
                  <div className='Recipe-psot-line'>
                    <span className="Recipe-tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="Recipe-tag">Username: {recipe.PostedBy.username}</span>

                    {/* <svg onClick={() => toggleBookmark(recipe)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                      {
                        bookmarkedItems.includes(recipe._id) ?
                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                          :
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                      }
                    </svg> */}
                  </div>
                  <span className="tag">Category: {recipe.Category}</span>
                    <span className="tag">Cuisine: {recipe.Cuisine}</span>

                  <div className="Recipe-name">Recipes Name:
                    <p>{recipe.Recipes}</p>
                  </div>
                  <div className="Recipe-name">Ingredients:
                    <p>{recipe.Ingredients}</p>
                  </div>
                  <div className="Recipe-name">Instructions to make Recipes:
                    <p>{recipe.Instructions}</p>
                  </div>
                </div>
              </div>
            ))
          }
            </div>
          </div>
        </>
    )
}

export default RecipeID