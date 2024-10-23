import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

function Home() {
  const { user, setUser } = useUser();
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to extract user data if needed
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData); // Set user from token if needed
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/data', {
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
        console.log(data);
        setRecipes(data); // Set the recipes state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the fetch function
  }, [setUser]);

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">Recipes </a>
        <Link className="nav-link" to='/signup'>Sign UP <span className="sr-only">(current)</span></Link>
        <Link className="nav-link" to='/login'>Login <span className="sr-only">(current)</span></Link>
        <Link to='/upload'>
          <button className='nav-but'> Upload recipie </button>
        </Link>
      </nav>

      <div>
        {user && <h1>Hello, {user.username}</h1>}
        {!user && <h1>Please log in to see your profile.</h1>}
      </div>
      <div id="container">
        {
          recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <img src={recipe.Image_URL} alt="Lago di Braies" />
              <div className="card__details">
                <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                <span className="tag">Username: {recipe.PostedBy.username}</span>
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
    </>
  );
}

export default Home;
