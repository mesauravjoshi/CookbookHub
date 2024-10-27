import React, { useState, useEffect } from 'react'
import { useUser } from './UserContext';

function Bookmark() {
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes
  const { user, setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('line 11', token);

    if (token) {
      // Decode token to extract user data if needed
      const userData = JSON.parse(atob(token.split('.')[1]));
      // setUser(userData); // Set user from token if needed
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/bookmarked', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the header
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data);

        const postIds = data.map(item => item.post_id); // object of bookmark_id
        console.log(postIds);

        const bookmark_post_api = await fetch('http://localhost:3000/bookmarked_recipies', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the header
            'Content-Type': 'application/json'
          }
        });
        if (!bookmark_post_api.ok) {
          throw new Error('Network response was not ok');
        }
        const bookmark_post = await bookmark_post_api.json();
        console.log(bookmark_post);  // all recipie api 

        
        const filteredPosts = bookmark_post.filter(post => postIds.includes(post._id));
        console.log(filteredPosts);

        setRecipes(filteredPosts)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the fetch function
  }, [setUser]);
  

  return (
    <div>
      {user ? (
        <h1>Welcome back, {user.username}!</h1>
      ) : (
        <h1>Please log in.</h1>
      )}
      
      <div id="container">
        {
          recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <img src={recipe.Image_URL} alt="Lago di Braies" />
              <div className="card__details">
                <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                <span className="tag">Username: {recipe.PostedBy.username}</span>
                <svg onClick={() => handleBookMark(recipe._id, recipe.PostedBy.username)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
                <div className="name">{recipe._id}</div>
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
                <button>Read more</button>
              </div>

            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Bookmark