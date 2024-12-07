import React, { useState, useEffect } from 'react'
import { Link, useParams, } from 'react-router-dom';
import Nav from './Nav/Nav';
import { url } from './ApiUrl/Url';
import { useUser } from './UserContext';

function Search() {
  const { searchRecipe } = useParams(); // Get recipe id from URL
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchQuery = async () => {
      const token = localStorage.getItem('token');
      // console.log(searchQuery);
      if (!token) {
        console.log('Token is missing or expired');
        return;
      }

      try {
        const res = await fetch(`${url}/search/search?query=${searchRecipe}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await res.json();
        // console.log(data);
        setRecipes(data)
        return data;
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchQuery()
  }, [searchQuery,searchRecipe]);

  return (
    <div>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <center>

        {/* <h2>you seach {searchRecipe}</h2> */}
        {/* <form action="" onSubmit={handleQuerySearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button>submit</button>
      </form> */}
      </center>

      {
        recipes.length > 0 ?
          <>
            <center> <h1>{searchRecipe} recipes</h1> </center>
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
                          showSaveIcon &&
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
          </>
          :
          <div>
            <center>
              <h1>No result</h1>
            </center>
          </div>
      }


    </div>
  )
}

export default Search