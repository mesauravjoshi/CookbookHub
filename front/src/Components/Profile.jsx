import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from './UserContext';

function Profile() {
  const { username } = useParams(); // Get username from URL
  const { user, setUser } = useUser();
  const [recipes, setRecipes] = useState([]);

  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user_data/${username}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [setUser, username]);

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">CookbookHub</a>
        <Link to='/home'>
          <button className='nav-but'>HOME</button>
        </Link>
        <Link to='/upload'>
          <button className='nav-but'>Upload Recipe</button>
        </Link>
        <Link to='/home'>
          <button onClick={handleLogOut} className='nav-but'>Log Out</button>
        </Link>
      </nav>

      <div>
        {user && <h1>Hello {user.username}! </h1>}
        {!user && <h1>Please log in to see your profile.</h1>}
      </div>
      <div id="container">
        <center> <h3>My recipes </h3> </center>
      
        {
          recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <img src={recipe.Image_URL} alt="Recipe" />
              <div className="card__details">
                <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                <span className="tag">Username: {recipe.PostedBy.username}</span>
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
