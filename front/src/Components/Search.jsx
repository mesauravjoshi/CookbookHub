import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [activeRecipeId, setActiveRecipeId] = useState(null); // State to track which recipe's dropdown is active

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleQuerySearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(searchQuery);
    if (!token) {
      console.log('Token is missing or expired');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/search/search?query=${searchQuery}`, {
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
      console.log(data);
      setRecipes(data)
      return data;
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {
  }, []);

  return (
    <div>
      <form action="" onSubmit={handleQuerySearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button>submit</button>
      </form>

      <div id="container">
          {
            recipes.map((recipe, index) => (
              <div className="my-card" key={index}>

                <div onClick={() => handleThreeDot(recipe._id)} className='three-dot'> <i className="bi bi-three-dots-vertical"></i> </div>
                {
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

    </div>
  )
}

export default Search