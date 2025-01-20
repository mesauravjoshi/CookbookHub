import React, { useState, useEffect, useRef } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useFetchData } from '../FetchContext';
import { Link } from 'react-router-dom';
import { url } from '../ApiUrl/Url';
import './Recipe.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAuth } from '../Auth/AuthContext'; // Import the custom hook
import NotLogin from '../Auth/NotLogin';
import axios from 'axios';

function Recipes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const {totalRecipe, setTotalRecipe} = useFetchData();
  const [detalRecipe, setDetalRecipe] = useState({});
  const [recipeBookmark, setRecipeBookmark] = useState({});
  const { isLoggedIn } = useAuth(); // Get isLoggedIn and logout function
  const [isEdit, setIsEdit] = useState(false);

  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isViewClicked, setIsViewClicked] = useState(false);
    
  const inputRef = useRef(null);
  
  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleSaveClick = async (recipe_id) => {
    setDetalRecipe(prevState => ({
      ...prevState,
      Recipes: recipeName,
      Category: category,
      Cuisine: cuisine,
      Ingredients: ingredients,
      Instructions: instructions,
  }));
  setIsEdit(false);
  console.log(recipe_id);

  const token = localStorage.getItem('admin token');
  try {
    const response = await axios.put(`${url}/admin_update_user/username/${recipe_id}`, {
        recipe_id: recipe_id,  // Send recipe_id directly here in the body
        recipeName: recipeName,
        category: category,
        cuisine: cuisine,
        ingredients: ingredients,
        instructions: instructions
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const result = response.data;
    console.log('Recipe updated:', result);
} catch (error) {
    if (error.response && error.response.status === 401) {
        return;
    }
    console.error('Error fetching data:', error);
}
  };

  useEffect(() => {
      if (detalRecipe && detalRecipe.Recipes && detalRecipe.Category  && detalRecipe.Cuisine && detalRecipe.Ingredients && detalRecipe.Instructions ) {
        setRecipeName(detalRecipe.Recipes); 
        setCategory(detalRecipe.Category);
        setCuisine(detalRecipe.Cuisine);
        setIngredients(detalRecipe.Ingredients)
        setInstructions(detalRecipe.Instructions)
      }
      if (isEdit && inputRef.current) {
        inputRef.current.focus(); // Focus when isEdit is true
      }
    }, [detalRecipe,isEdit]);

  const handleNameChange = (e) => {
    if (e.target.name == 'recipeName') setRecipeName(e.target.value); 
    if (e.target.name == 'category') setCategory(e.target.value); 
    if (e.target.name == 'cuisine') setCuisine(e.target.value); 
    if (e.target.name == 'ingredients') setIngredients(e.target.value); 
    if (e.target.name == 'instructions') setInstructions(e.target.value); 
    // else setUsername(e.target.value); // Update state with user input
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleDeleteRecipe = async (recipe_id) => {
    const token = localStorage.getItem('admin token');
    try {
      const response = await axios.delete(`${url}/admin/delete_recipe/${recipe_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = response.data;
      // console.log('Post deleted', result);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return;
      }
      console.error('Error fetching data:', error);
    }

    try {
      const recipesResponse = await axios.get(`${url}/admin/recipes`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      const recipesData = recipesResponse.data;
      // console.log(recipesData.recipes);
      setTotalRecipe(recipesData.recipes)
  } catch (error) {
      // Handle errors from axios, including 401 or other non-2xx status codes
      if (error.response && error.response.status === 401) {
          return;
      }
      console.error('Error fetching data:', error);
  }
  }

  const scrollToElement = async (id, recipe_id) => {
    const token = localStorage.getItem('admin token');
    // e.preventDefault();
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    try {
      const response = await axios.get(`${url}/admin/detail-recipe/${recipe_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = response.data;
      // console.log(result.recipe[0]);
      setDetalRecipe(result.recipe[0]);
      setRecipeBookmark(result.recipe_bookmark);
      setIsViewClicked(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to split ingredients and instructions by newline (\n)
  const formatText = (text) => {
    return text.replace(/\n/g, '<br/>');
  };

  return (
    <>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      {
        isLoggedIn ?
          <div className='main-container'>
        <h1>Recipes</h1>
        {/* table  */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="table-cell">Name </TableCell>
                <TableCell className="table-cell">Recipe ID </TableCell>
                <TableCell className="table-cell">Ingredients</TableCell>
                <TableCell align="left" className="table-cell" >Instructions</TableCell>
                <TableCell align="left" className="table-cell" >PostedBy</TableCell>
                <TableCell align="left" className="table-cell" >Recipe Image URL</TableCell>
                <TableCell align="left" className="table-cell" >Created Date</TableCell>
                <TableCell align="right" className="table-cell" >Delete</TableCell>
                <TableCell align="right" className="table-cell" >View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                totalRecipe.map((row) => (
                  <TableRow
                    key={row._id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" className="table-cell">{row.Recipes}</TableCell>
                    <TableCell align="left" className="table-cell">{row._id}</TableCell>
                    <TableCell component="th" scope="row" className="table-cell">
                      { 
                        row.Ingredients && row.Ingredients.slice(0, 30)
                      }
                    </TableCell>
                    <TableCell component="th" scope="row" className="table-cell">
                      { 
                        row.Instructions	 && row.Ingredients.slice(0, 30)
                      }
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      Username: {row.PostedBy.username} <br />
                      User ID: {row.PostedBy._id}
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      <Link to={row.Image_URL}> IMAGE URL</Link>
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      Date:&nbsp;
                      {new Date(row.Created_At).toLocaleString('en-GB', {
                        day: 'numeric',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      &nbsp;
                      {new Date(row.Created_At).toLocaleString('en-GB', {
                        month: 'short',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      &nbsp;
                      {new Date(row.Created_At).toLocaleString('en-GB', {
                        year: 'numeric',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      <br />
                      Time:&nbsp;
                       {new Date(row.Created_At).toLocaleString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true, // Optional: if you want AM/PM format
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                    </TableCell>

                    <TableCell align="right" className="table-cell">
                      <div onClick={() => handleDeleteRecipe(row._id)} className='trash-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </div>
                    </TableCell>
                    <TableCell align="left" className="table-cell"
                      onClick={() => scrollToElement('detail-recipe', row._id)}
                    >
                      <div className="view-basic-info" style={{ cursor: 'pointer' }}>View</div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <div id='detail-recipe'>
          {
            isViewClicked && (
              <>
                <h1>Detail Recipe</h1>
                <div className='edit-header'>
              <button
                style={{ cursor: 'pointer' }}
                onClick={handleEditClick}
                >
              Edit
              </button>
              {isEdit && (
                <button style={{ cursor: 'pointer' }} 
                onClick={() => handleSaveClick(detalRecipe._id)} 
                > Save</button>
              )}
            </div>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
                    <TableBody>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe ID:</strong></TableCell>
                        <TableCell className="table-cell">{detalRecipe._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Name:</strong></TableCell>
                        <TableCell style={{ padding: '2px 12px' }} className="table-cell">
                          <input
                            style={{ color: 'white', width: '100%' , height: '3em', backgroundColor: '#2e7d32' }}
                            type="text"
                            name='recipeName'
                            value={recipeName}
                            onChange={handleNameChange}
                            disabled={!isEdit} // Disable input if not in edit mode
                            ref={inputRef} 
                          />
                          {/* {detalRecipe.Recipes} */}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe Image URL:</strong></TableCell>
                        <TableCell className="table-cell">
                          <a style={{color: '#251d34'}} href={detalRecipe.Image_URL} target="_blank" rel="noopener noreferrer">{detalRecipe.Image_URL}</a>
                          {/* {detalRecipe.Image_URL} */}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Category:</strong></TableCell>
                        <TableCell 
                        className="table-cell">
                        <input
                            style={{ color: 'white', width: '100%' , height: '3em', backgroundColor: '#2e7d32' }}
                            type="text"
                            name='category'
                            value={category}
                            onChange={handleNameChange}
                            disabled={!isEdit} // Disable input if not in edit mode
                            // autoFocus 
                            // ref={inputRef} 
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Cuisine:</strong></TableCell>
                        <TableCell className="table-cell">
                        <input
                        style={{ color: 'white', width: '100%' , height: '3em',    backgroundColor: '#2e7d32' }}
                          type="text"
                          name='cuisine'
                          value={cuisine}
                          onChange={handleNameChange}
                          disabled={!isEdit} // Disable input if not in edit mode
                          // autoFocus 
                          // ref={inputRef} 
                        />
                        </TableCell>
                      </TableRow>
                      {/* <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Tags:</strong></TableCell>
                        <TableCell className="table-cell">
                        {detalRecipe.Tags[0]} <br />
                        {detalRecipe.Tags[1]} <br />
                        {detalRecipe.Tags[2]} <br />
                        {detalRecipe.Tags[3]} <br />
                        </TableCell>
                      </TableRow> */}

                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Ingredients:</strong></TableCell>
                        <TableCell className="table-cell">
                          <textarea style={{ color: 'white', width: '100%' , height: '7em',  backgroundColor: '#2e7d32' }}
                          name="ingredients" 
                          value={ingredients}
                          onChange={handleNameChange}
                          disabled={!isEdit} 
                          >
                          {/* {detalRecipe.Ingredients} */}
                          </textarea>
                          {/* <p dangerouslySetInnerHTML={{ __html: formatText(detalRecipe.Ingredients) }} /> */}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Instructions:</strong></TableCell>
                        <TableCell className="table-cell">
                          {/* {detalRecipe.Instructions} */}
                          <textarea style={{ color: 'white', width: '100%' , height: '7em',    backgroundColor: '#2e7d32' }}
                          name="instructions"
                          value={instructions}
                          onChange={handleNameChange}
                          disabled={!isEdit} 
                          >
                          {/* {detalRecipe.Instructions} */}
                          </textarea>
                          {/* <p dangerouslySetInnerHTML={{ __html: formatText(detalRecipe.Instructions) }} /> */}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Created Date	:</strong></TableCell>
                        {/* <TableCell className="table-cell">
                          {new Date(detalRecipe.Created_At).toLocaleString('en-GB', {
                        day: 'numeric',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      &nbsp;
                      {new Date(detalRecipe.Created_At).toLocaleString('en-GB', {
                        month: 'short',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      &nbsp;
                      {new Date(detalRecipe.Created_At).toLocaleString('en-GB', {
                        year: 'numeric',
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                      <br />
                      Time:&nbsp;
                       {new Date(detalRecipe.Created_At).toLocaleString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true, // Optional: if you want AM/PM format
                      }).replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>')}
                        </TableCell> */}
                        <TableCell className="table-cell">
                          <input type="datetime-local" id="birthdaytime" name="birthdaytime"/>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Posted By:</strong></TableCell>
                        <TableCell className="table-cell">Username: {detalRecipe.PostedBy.username} <br />User ID: {detalRecipe.PostedBy._id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Bookmarked By: </strong></TableCell>
                        <TableCell className="table-cell">
                          {recipeBookmark.length} Users
                          <br />
                          {
                            recipeBookmark.map((item, index) => {
                              return (
                                <div key={index}>
                                  <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="table-cell" component="th" scope="row">
                                            <strong>Name:</strong> : {item.BookmarkBy.username} &nbsp; &nbsp; &nbsp;
                                            <strong>User ID:</strong> : {item.BookmarkBy._id}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              )
                            })
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )
          }
        </div>

          </div>
        :
        <div className='main-container'>
          <NotLogin/>
        </div>
      }
    </>
  )
}

export default Recipes