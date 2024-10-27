import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css'
function Home() {
  const { user, setUser } = useUser();
  const [isBooked, setIsBooked] = useState(false);
  const [track_postId, setTrack_postId] = useState([]);
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes

  const handleBookMark = async (post_id, saved_by) => {

    // const track_postId = [];
    // // Check if the post_id is already in the array to avoid duplicates
    // if (!track_postId.includes(post_id)) {
    //   // Update the track_postId state with the new post_id
    //   setTrack_postId(prevTrackPostId => [...prevTrackPostId, post_id]);
    // }
    // console.log(track_postId);

    const savedPost = {
      post_id: post_id,
      saved_by: saved_by
    }
    // console.log(post_id);
    // console.log(saved_by);

    const response = await fetch('http://localhost:3000/bookmark', {
      method: 'POST',
      body: JSON.stringify(savedPost),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    } else {
      console.log('already hai bahi');
    }
    setIsBooked(true)
    if (isBooked) {
      setIsBooked(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('line 11', token);

    if (token) {
      // Decode token to extract user data if needed
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData); // Set user from token if needed
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes/data', {
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
        setRecipes(data); // Set the recipes state with fetched data

// fetch bookmark's post id ***************************************************
        const users_saved = await fetch('http://localhost:3000/bookmarked', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the header
            'Content-Type': 'application/json'
          }
        });
        if (!users_saved.ok) {
          throw new Error('Network response was not ok');
        }
        const users_saved_data = await users_saved.json();
        // console.log(data);

        const postIds = users_saved_data.map(item => item.post_id); // object of bookmark_id

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
        // console.log(bookmark_post);  // all recipie api 

        const filteredPosts = bookmark_post.filter(post => postIds.includes(post._id));
        // console.log(filteredPosts);
        setTrack_postId(filteredPosts);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the fetch function
  }, [setUser]);
  // console.log(recipes);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="#">CookbookHub </a>
        <Link className="nav-link" to='/home'>Home <span className="sr-only">(current)</span></Link>
        <Link className="nav-link" to='#'>About Us <span className="sr-only">(current)</span></Link>
        <Link className="nav-link" to='#'>Contact Us <span className="sr-only">(current)</span></Link>
        {
          !user &&
          <>
            <Link to='/signup'>
              <button className='nav-but'>Sign UP</button>
            </Link>
            <Link to='/login'>
              <button className='nav-but'>Login</button>
            </Link>
          </>
        }
        {
          user &&
          <Link to={`/profile/${user.username}`}>
            <button className='nav-but'> My profile </button>
          </Link>
        }
      </nav>

      <div>
        {user &&
          <div className="heading">
            <center><h1>Welcome, {user.username}</h1></center>
          </div>
        }
        {!user &&
          <div className="heading">
            <center> <h1>Welcome to CookbookHub </h1><h1>LogIn to Post your Recipes</h1></center> </div>
        }
      </div>

      <div id="container">
        {
          recipes.map((recipe, index) => (
            <div className="card" key={index}>
              <img src={recipe.Image_URL} alt="Lago di Braies" />
              <div className="card__details">
                <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                <span className="tag">Username: {recipe.PostedBy.username}</span>

                {
                  !isBooked ?
                    <svg onClick={() => handleBookMark(recipe._id, recipe.PostedBy.username)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                    :
                    <svg onClick={() => handleBookMark(recipe._id, recipe.PostedBy.username)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                    </svg>
                }

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