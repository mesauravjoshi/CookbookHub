import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import './RecipeCat.css'
import MarkCode from '../MarkCode'; 

function RecipeCat() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [category, setCategory] = useState('Beverage');

  const handleCategory = (e) => {
    setCategory(e.target.textContent)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      setShowSaveIcon(true)
    }

    const fetchData = async () => {
      try {
        // Fetch recipes
        const recipesResponse = await fetch(`http://localhost:3000/recipe_category/recipe_category?category=${category}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (recipesResponse.status === 401) {
          setIsLoggedIn(false);
          setShowSaveIcon(false)
          return; // Exit the function
        }

        if (!recipesResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const recipesData = await recipesResponse.json();
        setRecipes(recipesData);
        // Fetch bookmarks for the user
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
          // console.log(bookmarksData);
          
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
  }, [category]);

  return (
    <>

      <center>
        <h2>CATEGORY</h2>
      </center>
      
      <div className="category-wrapper">
        <div className="category">
          <p onClick={handleCategory}>Dinner</p>
          <p onClick={handleCategory}>Lunch</p>
          <p onClick={handleCategory}>Breakfast</p>
          <p onClick={handleCategory}>Beverage</p>
          <p onClick={handleCategory}>Main Course</p>
          <p onClick={handleCategory}>Dessert</p>
          <p onClick={handleCategory}>Snack</p>
          <p onClick={handleCategory}>Salad</p>
        </div>
      </div>

      {
        // isLoggedIn &&
        <div id="container">
          {
            recipes.map((recipe, index) => (
              <div className="card" key={index}>
                <div className="car-iamge">
                  <img src={recipe.Image_URL} alt="Recipe" />
                </div>
                <div className="card__details">
                  <div className='psot-line'>
                    <span className="tag">Category: {(recipe.Category).substring(0, 10)}</span>
                    <span className="tag">Cuisine: {(recipe.Cuisine).substring(0, 10)}</span>
                    {/* <span className="tag">{(recipe.Created_At).substring(0, 10)}</span>
                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span> */}
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

    </>
  );
}

export default RecipeCat;