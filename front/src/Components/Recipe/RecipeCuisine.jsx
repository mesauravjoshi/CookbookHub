import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { url } from '../ApiUrl/Url';
import MarkCode from '../MarkCode';
import './RecipeCuisine.css'
// slider 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast, { Toaster } from 'react-hot-toast';
import LoadingCard from '../Loading/LoadingCard';

function RecipeCuisine() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 4,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2.5
        }
      }
    ]
  };
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [cuisine, setCuisine] = useState('Indian');
  const [laoding, setLoading] = useState(false)

  const handleCategory = (e) => {
    // console.log("clicked");
    // console.log(typeof e.target.textContent);
    setCuisine(e.target.textContent)
  }

  useEffect(() => {
    // if (user && user.username) {
    setLoading(true)
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch recipes
        const recipesResponse = await fetch(`${url}/recipe_category/recipe_cuisine?cuisine=${cuisine}`, {
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

        setLoading(false)
        const recipesData = await recipesResponse.json();
        // console.log(recipesData);
        setRecipes(recipesData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(true);
      }

      try {
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
      }
    };

    fetchData();
    // }
  }, [cuisine, user]);

  const listCuisine = [
    'Indian', 'American', 'Italian', 'Asian', 'Korean'
  ]
  return (
    <>
      <center>
        <h2>CUISINE</h2>
      </center>
      <div className="cuisine">
        <Slider {...settings}>
          {
            listCuisine.map((item, index) => {
              return (
                <div key={index}>
                  <center>
                    <p key={index} onClick={handleCategory}>{item}</p>
                  </center>
                </div>
              )
            })
          }
        </Slider>
      </div>
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
                    <span className="tag">Posted By: {(recipe.PostedBy.name)}</span>
                    {
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
            {
        laoding &&
        <LoadingCard/>
      }
      <Toaster />
    </>
  );
}

export default RecipeCuisine;