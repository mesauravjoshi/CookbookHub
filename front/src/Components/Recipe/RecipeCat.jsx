import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { url } from '../ApiUrl/Url';
import { useUser } from '../UserContext';
import MarkCode from '../MarkCode';
import './RecipeCat.css'
// slider 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast, { Toaster } from 'react-hot-toast';
import LoadingCard from '../Loading/LoadingCard';

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

function RecipeCat() {
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [category, setCategory] = useState('Dinner');
  const [laoding, setLoading] = useState(false)

  const handleCategory = (e) => {
    setCategory(e.target.textContent)
  }

  useEffect(() => {
    // if (user && user.username) {
    setLoading(true)
    // for category recipe endpoint
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch recipes
        const recipesResponse = await fetch(`${url}/recipe_category/recipe_category?category=${category}`, {
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
        const recipesData = await recipesResponse.json();
        // console.log(recipesData);
        setLoading(false)
        setRecipes(recipesData);
      } catch (error) {
        setLoading(true)
        console.error('Error fetching data:', error);
      }

      // for bookmark endpoint
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
          const bookmarksData = await bookmarksResponse.json();
          // console.log(bookmarksData);

          const bookmarkIds = bookmarksData.map(item => item.Post_id); // Assuming Post_id is the identifier
          // console.log(bookmarkIds);
          setBookmarkedItems(bookmarkIds);
        } else {
          console.log('Failed to fetch bookmarks');

        }
      } catch (error) {
        console.error('Error fetching bookamrk:', error);
      }
    };

    fetchData();
    // }
  }, [category, user]);

  const listCategory = [
    'Dinner', 'Lunch', 'Breakfast', 'Beverage', 'Main Course', 'Dessert', 'Snack', 'Salad'
  ]

  return (
    <>
      <center>
        <h2>CATEGORY</h2>
      </center>

      <div className="category">
        <Slider {...settings}>
          {
            listCategory.map((item, index) => {
              return (
                <div key={index}>
                  <center>
                    <p onClick={handleCategory}>{item}</p>
                  </center>
                </div>
              )
            })
          }
        </Slider>
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
                    <span className="tag">Posted By: {(recipe.PostedBy.name)}</span>
                    {/* <span className="tag">{(recipe.Created_At).substring(0, 10)}</span>
                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span> */}
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

export default RecipeCat;