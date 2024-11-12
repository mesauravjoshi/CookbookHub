import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import './Upload.css';
import { useUser } from './UserContext'; // Import the context
import PageNotFound from './PageNotFound/PageNotFound';
import Nav from './Nav/Nav';

function Upload() {
  const { user, setUser } = useUser(); // Get the user from context 
  const [image_URL, setImage_URL] = useState('');
  const [recipesName, setRecipesName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status

  const handleForm = (e) => {
    const { name, value } = e.target;
    // console.log(e.target.value);

    if (name === 'Recipes') {
      setRecipesName(value);
    }
    if (name === 'Ingredients') setIngredients(value);
    if (name === 'Instructions') setInstructions(value);
    if (name === 'Image_URL') setImage_URL(value);
    if (name === 'Category') setCategory(value);
    if (name === 'Cuisine') setCuisine(value);
  };

  const handleSubmit = async (e) => {
    // console.log('clicked');
    // console.log(category);

    e.preventDefault();
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    console.log(name);

    const userData = JSON.parse(atob(token.split('.')[1])); // Decode token to get user data
    // console.log(userData.username);
    // console.log(userData.name);

    const form = {
      Recipes: recipesName,
      Ingredients: ingredients,
      Instructions: instructions,
      Image_URL: image_URL,
      Category: category,
      Cuisine: cuisine,
      PostedBy: {
        name: name,
        username: userData.username,
        _id: userData.id // Use userData.id or userData._id depending on your token structure
      }
    };
    console.log(form);

    const response = await fetch('http://localhost:3000/recipes/recipie_data', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include token in the header
      }
    });

    if (response.ok) {
      alert('Recipe saved');
      const data = await response.json();
      console.log(data);
      setImage_URL('');
      setRecipesName('');
      setIngredients('');
      setInstructions('');
      setCategory('');
      setCuisine('');
    } else {
      console.log('Error saving recipe');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData); // Set user from token if needed
    }
  }, [setUser]);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} user={user} />

      <div className='upload'>
        {
          user &&
          <Form onSubmit={handleSubmit}>
            <Form.Control size="lg" onChange={handleForm} value={image_URL} type="text" name='Image_URL' placeholder='Image URL' require />
            <br />
            <Form.Control size="lg" onChange={handleForm} value={recipesName} type="text" name='Recipes' placeholder='Recipes name' required />
            <br />
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control size="lg" onChange={handleForm} value={ingredients} name='Ingredients' placeholder='Ingredients' required as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control size="lg" onChange={handleForm} value={instructions} name='Instructions' placeholder='Instructions' as="textarea" rows={3} required />
            </Form.Group>

            <Form.Select size="lg" aria-label="Category Select" value={category} name="Category" onChange={handleForm} >
              <option disabled value="">
                Category (e.g., Dessert, Main Course)
              </option>
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
            <Form.Select size="lg" onChange={handleForm} value={cuisine} type="text" name='Cuisine' require  >
              <option disabled value="">
                Cuisine (e.g., Indian, Italian)'
              </option>
              <option value="American">American</option>
              <option value="Asian">Asian</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Korean">Korean</option> 
              <option value="Western">Western</option> 
            </Form.Select>
            <div className="uplaod-button">
              <button>Upload</button>
            </div>
          </Form>

        }

        {/* if not login  */}
        {!user &&
          <PageNotFound />
        }
      </div>
    </>
  );
}

export default Upload;
