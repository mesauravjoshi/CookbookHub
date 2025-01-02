import React, { useState, useEffect } from 'react'
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

function Recipes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const {totalRecipe} = useFetchData();
  const [detalRecipe, setDetalRecipe] = useState({});
  const [recipeBookmark, setRecipeBookmark] = useState({});
  const { isLoggedIn } = useAuth(); // Get isLoggedIn and logout function

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleDeleteRecipe = async (recipe_id) => {
    const token = localStorage.getItem('admin token');
    try {
      const response = await fetch(`${url}/admin/delete_recipe/${recipe_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // console.log('Post deleted', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const scrollToElement = async (id, recipe_id) => {
    const token = localStorage.getItem('admin token');
    // e.preventDefault();
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    try {
      const response = await fetch(`${url}/admin/detail-recipe/${recipe_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // console.log(result.recipe_bookmark);
      setDetalRecipe(result.recipe);
      setRecipeBookmark(result.recipe_bookmark);
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
            detalRecipe.length === 1 && (
              <>
                <h1>Detail Recipe</h1>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
                    <TableBody>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Name:</strong></TableCell>
                        <TableCell className="table-cell">{detalRecipe[0].Recipes}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe ID:</strong></TableCell>
                        <TableCell className="table-cell">{detalRecipe[0]._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Ingredients:</strong></TableCell>
                        <TableCell className="table-cell">
                          {detalRecipe[0].Ingredients}
                          <p dangerouslySetInnerHTML={{ __html: formatText(detalRecipe[0].Ingredients) }} />
                          </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Instructions:</strong></TableCell>
                        <TableCell className="table-cell">
                          {/* {detalRecipe[0].Instructions} */}
                          <p dangerouslySetInnerHTML={{ __html: formatText(detalRecipe[0].Instructions) }} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Posted By:</strong></TableCell>
                        <TableCell className="table-cell">Username: {detalRecipe[0].PostedBy.username} <br />User ID: {detalRecipe[0].PostedBy._id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe Image URL:</strong></TableCell>
                        <TableCell className="table-cell">
                          <a href={detalRecipe[0].Image_URL} target="_blank" rel="noopener noreferrer">IMAGE URL</a>
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