import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { url } from './ApiUrl/Url';
import { useUser } from './UserContext'; // Import the context
import PageNotFound from './PageNotFound/PageNotFound';
import Nav from './Nav/Nav';
import './Upload.css';
import toast, { Toaster } from 'react-hot-toast';

function Upload() {
  const { user, setUser } = useUser(); // Get the user from context 
  const [image_URL, setImage_URL] = useState('');
  const [recipesName, setRecipesName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status
  // tags 
  const [tags, setTags] = useState('');
  const [multiSel, setMultiSel] = useState([]);
  const [isDisable, setIsDisable] = useState(false);

  // Function to show toast
  const notify = () => {
    toast.success('Recipe Uploaded Successfully!', {
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

  const notifyFail = () => {
    toast.error('Error saving recipe', {
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

  const handleTagChange = (e) => {
    // console.log(e.target.value);
    setTags(e.target.value)
  }

  const handleAddTags = (e) => {
    e.preventDefault();
    if (tags && !multiSel.includes(tags)) {
      if (multiSel.length < 4) {
        // Append new tag to multiSel array and update state
        setMultiSel((prevTags) => [...prevTags, tags]);
        setTags(''); // Clear input after adding tag
      }

      // Disable input and button once 4 tags are added
      if (multiSel.length + 1 >= 4) {
        setIsDisable(true);
      }
    }
  }

  const handleRemoveTag = (item) => {
    const udatedMultiSel = multiSel.filter((prevTag) => prevTag != item)
    setMultiSel(udatedMultiSel)
    setIsDisable(true);
    // console.log(udatedMultiSel);

    if (udatedMultiSel.length < 4) {
      setIsDisable(false);
    }
  }

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
    e.preventDefault();
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    // console.log(name);

    const userData = JSON.parse(atob(token.split('.')[1])); // Decode token to get user data

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
        _id: userData.id
      },
      Tags: multiSel
    };
    // console.log(form);
    const response = await fetch(`${url}/recipes/recipie_data`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include token in the header
      }
    });

    if (response.ok) {
      setImage_URL('');
      setRecipesName('');
      setIngredients('');
      setInstructions('');
      setCategory('');
      setCuisine('');
      setMultiSel([]);
      notify()
    } else {
      // console.log('Error saving recipe');
      notifyFail();
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
          // user &&
          <Form onSubmit={handleSubmit}>
            <Form.Control size="lg" onChange={handleForm} value={image_URL} type="text" name='Image_URL' placeholder='Image URL' required autoFocus />
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
            <Form.Select size="lg" onChange={handleForm} value={cuisine} type="text" name='Cuisine' required  >
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
            <br />
            <div className='Optional'>
              <p>(Optional)</p>
            </div>

            <div className='multiple-select'>
              <Form.Control size="lg"
                placeholder={isDisable ? 'All items added successfully' : 'Add Tags (e.g., Quick, Vegan, Party, Summer)'} value={tags} onChange={handleTagChange}
                disabled={isDisable}
              />
              <button onClick={handleAddTags} disabled={isDisable}
                style={{ cursor: isDisable ? 'not-allowed' : 'pointer' }} > Add</button>
              <div className="tag-list">
                {
                  multiSel.map((item, index) => {
                    return (
                      <div className='tag-list-item' key={index}>
                        <p> {item}</p>
                        <svg onClick={() => handleRemoveTag(item)} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            <div className="upload-button">
              <button  > Upload</button>
            </div>
          </Form>
        }

        {/* if not login  */}
        {!user &&
          <PageNotFound />
        }
      </div>
      <Toaster />
    </>
  );
}

export default Upload;