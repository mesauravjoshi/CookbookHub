import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { url } from '../ApiUrl/Url';
import { useUser } from '../UserContext';
import MarkCode from '../MarkCode';

function RecipeNewest({ isLoggedIn, setIsLoggedIn }) {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    if (user && user.username) {
      const fetchData = async () => {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        try {
          // Fetch recipes
          const recipesResponse = await fetch(`${url}/recipe_category/recipe_by_date`, {
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
          // console.log( typeof recipesData[0].Created_At);
          recipesData.sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));
          // console.log(recipesData);
          setRecipes(recipesData);
          // Fetch bookmarks for the user
          const bookmarksResponse = await fetch(`${url}/bookmark/bookmarks/${user.username}`, {
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
          setIsLoggedIn(false);
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <>
      <h2>Newest</h2>
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
                    {/* <span className="tag">{(recipe.Created_At).substring(0, 10)}</span> */}
                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span>
                    {
                      <MarkCode
                        recipe={recipe}
                        bookmarkedItems={bookmarkedItems}
                        setBookmarkedItems={setBookmarkedItems}
                      />
                    }
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
                    <button className="read-more">Read more</button>
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

export default RecipeNewest;