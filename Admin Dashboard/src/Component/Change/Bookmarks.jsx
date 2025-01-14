import React, { useState} from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useFetchData } from '../FetchContext';
import { useAuth } from '../Auth/AuthContext';
import NotLogin from '../Auth/NotLogin';
import { Link } from 'react-router-dom';
import { url } from '../ApiUrl/Url';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';

function Bookmarks() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [detalBookmarkecRecipe, setDetalBookmarkecRecipe] = useState(false);
    const [recipeNameToView, setRecipeNameToView] = useState('');
    const [recipeIDToView,   setRecipeIDToView] = useState('');

    const {totalRBookmarkRecipe } = useFetchData();
    const {isLoggedIn } = useAuth(); // Get isLoggedIn and logout function
    // console.log(totalRBookmarkRecipe);
    
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    const scrollToElement = async (id, recipe_id,recipeName) => {
        const token = localStorage.getItem('admin token');
        // e.preventDefault();
        const element = document.getElementById(id);
        element.scrollIntoView({ behavior: 'smooth' });
        try {
          const response = await axios.get(`${url}/admin_bookmark/detail_bookmarkRecipe/${recipe_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const result = response.data;
          setDetalBookmarkecRecipe(result.recipe);
          setRecipeNameToView(recipeName);
          setRecipeIDToView(recipe_id);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

  return (
    <>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className='main-container'>
          {
            isLoggedIn ?
            <>
            <h1> Bookmarks Recipes</h1>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="table-cell">Recipe Name</TableCell>
                <TableCell className="table-cell">Recipe ID </TableCell>
                <TableCell className="table-cell">Bookmarked By </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                totalRBookmarkRecipe.map((row) => (
                  <TableRow
                    key={row._id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" className="table-cell">{row.Recipes}</TableCell>
                    <TableCell align="left" className="table-cell">{row._id}</TableCell>
                    <TableCell component="th" scope="row" className="table-cell"> 
                      <div onClick={() => scrollToElement('detail-recipe', row._id,row.Recipes)} className="view-basic-info" style={{ cursor: 'pointer' }}>View</div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
            <br />  
            
            <div id='detail-recipe'>
              {
                detalBookmarkecRecipe.length >= 1 &&
                <>
                <h1>View Full Bookmarked detail of Recipe</h1>
                {
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
                    <TableBody>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe Name:</strong></TableCell>
                        <TableCell className="table-cell">{recipeNameToView}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Recipe ID:</strong></TableCell>
                        <TableCell className="table-cell">{recipeIDToView}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="table-cell" component="th" scope="row"><strong>Bookmarked By: </strong></TableCell>
                        <TableCell className="table-cell">
                          {detalBookmarkecRecipe.length} Users Bookmarked this recipe
                          <br />
                          {
                            detalBookmarkecRecipe.map((item, index) => {
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
                }
                </>
              }
            </div>
            </>
            :
            <>
              <NotLogin/>
            </>
          }
        </div>

    </>
  )
}

export default Bookmarks