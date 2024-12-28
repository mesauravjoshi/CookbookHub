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

function Bookmarks() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [detalBookmarkecRecipe, setDetalBookmarkecRecipe] = useState(false);
    const {totalRBookmarkRecipe } = useFetchData();
    const {isLoggedIn } = useAuth(); // Get isLoggedIn and logout function
    // console.log(totalRBookmarkRecipe);
    
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    const scrollToElement = async (id, recipe_id) => {
        // e.preventDefault();
        const element = document.getElementById(id);
        element.scrollIntoView({ behavior: 'smooth' });
        try {
          const response = await fetch(`${url}/admin/detail_bookmarkRecipe/${recipe_id}`, {
            method: 'GET',
            headers: {
              // 'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          console.log(result.recipe);
        //   setDetalBookmarkecRecipe(result.recipe);
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
                      <div onClick={() => scrollToElement('detail-recipe', row._id)} className="view-basic-info" style={{ cursor: 'pointer' }}>View</div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
            <br />  

            <div id='detail-recipe'>
                <h1>View Full Bookmarked detail of Recipe</h1>
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