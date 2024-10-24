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
        <a className="navbar-brand" href="/">CookbookHub </a>
        <Link className="nav-link" to='/signup'>Sign UP <span className="sr-only">(current)</span></Link>
        <Link className="nav-link" to='/login'>Login <span className="sr-only">(current)</span></Link>
        {
          user &&
          <Link to={`/profile/${user.username}`}>
            <button className='nav-but'> My profile </button>
          </Link>

        }
      </nav>

      <div>
        {user && <h1>Welcome, {user.username}</h1>}
        {!user && <> <h1>Welcome to CookbookHub </h1><h1>Sign to Post your Recipes</h1> </>}
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

      {/* BY DEFAUTL POST  */}
      <div id="container">
        <div className="card" >
          <img src='https://images.pexels.com/photos/8105093/pexels-photo-8105093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt="Lago di Braies" />
          <div className="card__details">
            <span className="tag">Posted By: CookbookHub</span>
            <div className="name">Recipes Name:
              <p>
                Dalgona coffee
              </p>
            </div>
            <div className="name">Ingredients:
              <p>

              2 tablespoons instant coffee <br />
               2 tablespoons sugar <br />
              2 tablespoons hot water <br />
              Milk (dairy or non-dairy, for serving) <br />
              Ice (optional, for iced coffee) <br />
              </p>
            </div>
            <div className="name">Instructions to make Recipes:
              <p>
                Combine Ingredients: In a mixing bowl, combine the instant coffee, sugar, and hot water. <br />
                Whip the Mixture: Using a hand mixer or a whisk, whip the mixture until it becomes light, fluffy, and forms stiff peaks. This usually takes about 2-5 minutes with a mixer or longer by hand. <br />
                Prepare the Milk: In a glass, fill it halfway with milk (hot or cold, depending on your preference) and add ice if desired. <br />
                Top with Coffee Foam: Spoon the whipped coffee mixture on top of the milk. <br />
                Mix and Enjoy: Stir the whipped coffee into the milk before drinking. Enjoy your creamy, frothy Dalgona coffee! <br />
              </p>
            </div>
            <button>Read more</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
