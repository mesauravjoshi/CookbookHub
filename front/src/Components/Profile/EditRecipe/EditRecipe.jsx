import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Form from 'react-bootstrap/Form';
import { url } from '../../ApiUrl/Url';
import { useUser } from '../../UserContext';
import PageNotFound from '../../PageNotFound/PageNotFound';
import Nav from '../../Nav/Nav';
import toast, { Toaster } from 'react-hot-toast';

function EditRecipe() {
  const { user } = useUser(); // Get the user from context 
  const [recipe, setRecipe] = useState({
    Image_URL: '',
    Recipes: '',
    Ingredients: '',
    Instructions: '',
    Category: '',
    Cuisine: ''
  });
  const { _id } = useParams(); // Get recipe id from URL
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate(); // Use useNavigate hook

  const notify = () => {
    toast.success('Recipe Updated Successfully!', {
      duration: 2000,
      position: "top-right",
      style: {
        border: '1px solid #713200',
        padding: '10px',
        color: '#713200',
        fontSize: '0.9rem',
      },
    });
  };

  // Fetch recipe details when component mounts
  useEffect(() => {
    if (user && user.username) {
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token');  // Get token from localStorage
          if (!token) {
            throw new Error('No authentication token found');
          }
  
          const response = await fetch(`${url}/recipes/edit_recipe/${_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (response.status === 401) {
            setIsLoggedIn(false);
            return;
          }
  
          if (!response.ok) {
            throw new Error('Failed to fetch recipe');
          }
  
          const data = await response.json();

          if (data.PostedBy.username === user.username) {
            setRecipe({
              Image_URL: data.Image_URL,
              Recipes: data.Recipes,
              Ingredients: data.Ingredients,
              Instructions: data.Instructions,
              Category: data.Category,
              Cuisine: data.Cuisine
            });
          }
        } catch (error) {
          console.error('Error fetching recipe:', error);
          setIsLoggedIn(false); // If error, user is logged out
        }
      };
      fetchRecipe();
    }
  }, [user,_id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // console.log('sending', recipe);

      const response = await fetch(`${url}/recipes/edit_recipe/${_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe) // Send updated recipe
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      const updatedRecipe = await response.json();
      // console.log('Updated recipe:', updatedRecipe);

      // Redirect after successful update using navigate()
      notify()
      setTimeout(() => {
        navigate(`/recipe/${_id}`); // Redirect to the updated recipe's detail page
      }, 2000); // 10000 milliseconds = 10 seconds
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };
  // console.log('line 110',recipe);

  const handleCancel = () => {
    navigate(`/profile/MyRecipes`);
  }

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />
      <div className="upload">
        {
          user ?
            <Form onSubmit={handleSaveChanges}>
              <Form.Control
                size="lg"
                type="text"
                name="Image_URL"
                value={recipe.Image_URL}
                placeholder="Image URL"
                onChange={handleInputChange}
                required
              />
              <br />
              <Form.Control
                size="lg"
                type="text"
                name="Recipes"
                value={recipe.Recipes}
                placeholder="Recipe Name"
                onChange={handleInputChange}
                required
              />
              <br />
              <Form.Group className="mb-3">
                <Form.Control
                  size="lg"
                  as="textarea"
                  rows={3}
                  name="Ingredients"
                  value={recipe.Ingredients}
                  placeholder="Ingredients"
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  size="lg"
                  as="textarea"
                  rows={3}
                  name="Instructions"
                  value={recipe.Instructions}
                  placeholder="Instructions"
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Select
                size="lg"
                name="Category"
                value={recipe.Category}
                onChange={handleInputChange}
              >
                <option value="" disabled>Category</option>
                <option value="Beverage">Beverage</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dessert">Dessert</option>
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Main Course">Main Course</option>
                <option value="Salad">Salad</option>
                <option value="Snack">Snack</option>
              </Form.Select>
              <br />
              <Form.Select
                size="lg"
                name="Cuisine"
                value={recipe.Cuisine}
                onChange={handleInputChange}
              >
                <option value="" disabled>Cuisine</option>
                <option value="American">American</option>
                <option value="Asian">Asian</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Korean">Korean</option>
              </Form.Select>
              <div className="buttons-container">
                <div className="upload-button">
                  <button type="submit">Save Changes</button>
                </div>
                <div className="upload-button">
                  <button onClick={handleCancel} type="">Cancel</button>
                </div>
              </div>
            </Form>
            : <PageNotFound />
        }
      </div>
      <Toaster />
    </>
  );
}

export default EditRecipe;
