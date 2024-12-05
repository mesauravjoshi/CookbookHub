import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import MarkCode from '../MarkCode';
import './RecipeCat.css'
// slider 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function RecipeCat() {
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
          slidesToScroll: 1
        }
      }
    ]
  };
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [category, setCategory] = useState('Dinner');

  const handleCategory = (e) => {
    setCategory(e.target.textContent)
  }

  useEffect(() => {
    if (user && user.username) {
      const token = localStorage.getItem('token');
      const fetchData = async () => {
        try {
          // Fetch recipes
          const recipesResponse = await fetch(`http://localhost:3000/recipe_category/recipe_category?category=${category}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (recipesResponse.status === 401) {
            setIsLoggedIn(false);
            setShowSaveIcon(false)
            return; // Exit the function
          }

          if (!recipesResponse.ok) {
            throw new Error('Network response was not ok');
          }

          const recipesData = await recipesResponse.json();
          setRecipes(recipesData);
          // Fetch bookmarks for the user
          const bookmarksResponse = await fetch(`http://localhost:3000/bookmark/bookmarks/${user.username}`, {
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
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
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
                <div>
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
                    <span className="tag">Category: {(recipe.Category).substring(0, 10)}</span>
                    <span className="tag">Cuisine: {(recipe.Cuisine).substring(0, 10)}</span>
                    {/* <span className="tag">{(recipe.Created_At).substring(0, 10)}</span>
                    <span className="tag">Posted By: {recipe.PostedBy.name}</span>
                    <span className="tag">Username: {recipe.PostedBy.username}</span> */}
                    {
                      showSaveIcon &&
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

    </>
  );
}

export default RecipeCat;