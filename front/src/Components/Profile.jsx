import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css'

function Profile() {
  const { username } = useParams(); // Get username from URL
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  const { user, setUser } = useUser();
  const [recipes, setRecipes] = useState([]);

  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    setIsLoggedIn(false); // Update login status
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }
    console.log(user);
    

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recipes/user_data/${username}`, {
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
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoggedIn(false); // Set logged out state on error
      }
    };

    fetchData();
  }, [setUser, username]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="#">CookbookHub</a>
        <Link className="nav-link" to='/home'>Home <span className="sr-only">(current)</span></Link>
        <Link className="nav-link" to='/upload'>Upload Recipe <span className="sr-only">(current)</span></Link>

        <Link className="nav-link" to='/bookmark'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmarks" viewBox="0 0 16 16">
            <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
            <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
          </svg>
        </Link>
        <Link to='/home'>
          <button onClick={handleLogOut} className='nav-but'>Log Out</button>
        </Link>
      </nav>

      <div>
        {isLoggedIn && user ? (
          <h1>Hello {user.username}!</h1>
        ) : (
          <h1>Please log in to see your profile.</h1>
        )}
      </div>

      <div id="container">
        <div className="heading">
          <center> <h3>My recipes </h3> </center>
        </div>
        {
          recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <img src={recipe.Image_URL} alt="Recipe" />
              <div className="card__details">
                <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                <span className="tag">Username: {recipe.PostedBy.username}</span>
                <svg onClick={() => handleBookMark(recipe._id, recipe.PostedBy.username)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
                <div className="name">{recipe._id}</div>
                <div className="name">Recipe Name:
                  <p>{recipe.Recipes}</p>
                </div>
                <div className="name">Ingredients:
                  <p>{recipe.Ingredients}</p>
                </div>
                <div className="name">Instructions to make Recipe:
                  <p>{recipe.Instructions}</p>
                </div>
                <button>Read more</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Profile;