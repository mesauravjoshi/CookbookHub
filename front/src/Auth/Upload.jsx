import React, { useState, useEffect } from 'react';
import './Upload.css';
import { useUser } from './UserContext'; // Import the context

function Upload() {
  const { user, setUser } = useUser(); // Get the user from context 
  const [image_URL, setImage_URL] = useState('');
  const [recipesName, setRecipesName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleForm = (e) => {
    const { name, value } = e.target;
    if (name === 'Recipes') {
      setRecipesName(value);
    }
    if (name === 'Ingredients') setIngredients(value);
    if (name === 'Instructions') setInstructions(value);
    if (name === 'Image_URL') setImage_URL(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userData = JSON.parse(atob(token.split('.')[1])); // Decode token to get user data

    const form = {
      Recipes: recipesName,
      Ingredients: ingredients,
      Instructions: instructions,
      Image_URL: image_URL,
      PostedBy: {
        name: userData.name,
        username: userData.username,
        _id: userData.id // Use userData.id or userData._id depending on your token structure
      }
    };

    const response = await fetch('http://localhost:3000/recipie_data', {
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
      setRecipesName('');
      setIngredients('');
      setInstructions('');
      setImage_URL('');
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
      <div>
        {user && 
        <>
          <h1>Hello, {user.username}</h1>
          <div id="container">
            <div className="card">
              <div className="card__details">
                <form onSubmit={handleSubmit}>
                  <div className="name">
                    Image URL:
                    <input onChange={handleForm} value={image_URL} type="text" name='Image_URL' placeholder='Image URL' required />
                  </div>
                  <div className="name">
                    Recipes:
                    <input onChange={handleForm} value={recipesName} type="text" name='Recipes' placeholder='Recipes name' required />
                  </div>
                  <div className="name">
                    <label htmlFor="">Ingredients:</label>
                    <textarea onChange={handleForm} value={ingredients} name='Ingredients' placeholder='Ingredients' required />
                  </div>
                  <div className="name">
                    Instructions to make Recipes:
                    <textarea onChange={handleForm} value={instructions} name='Instructions' placeholder='Instructions' required />
                  </div>
                  <button>Upload</button>
                </form>
              </div>
            </div>
          </div>
        </>
        }
        {!user && <h1>Please log in to see your profile.</h1>}
      </div>
    </>
  );
}

export default Upload;
