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
    const name = localStorage.getItem('name');
    console.log(name);
    
    const userData = JSON.parse(atob(token.split('.')[1])); // Decode token to get user data
    console.log(userData.username);
    console.log(userData.name);
    
    const form = {
      Recipes: recipesName,
      Ingredients: ingredients,
      Instructions: instructions,
      Image_URL: image_URL,
      PostedBy: {
        name: name,
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

        {/* if not login  */}
        {!user && 
          <section class="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div class="text-center">
                    <h2 class="d-flex justify-content-center align-items-center gap-2 mb-4">
                      <span class="display-1 fw-bold">4</span>
                      <i class="bi bi-exclamation-circle-fill text-danger display-4"></i>
                      <span class="display-1 fw-bold bsb-flip-h">4</span>
                    </h2>
                    <h3 class="h2 mb-2">Oops! You're lost.</h3>
                    <h4>Please login first.. </h4>
                    <a class="btn bsb-btn-5xl btn-dark rounded-pill px-5 fs-6 m-0" href="#!" role="button">Back to Home</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      </div>
    </>
  );
}

export default Upload;
