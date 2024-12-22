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

function Recipes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { totalRecipe } = useFetchData();
  const { detalRecipe, serDetalRecipe } = useState('');

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  const handleDeleteRecipe = async (recipe_id) => {
    console.log(recipe_id);
    try {
      const response = await fetch(`${url}/admin/delete_recipe/${recipe_id}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}`,
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
  return (
    <>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
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
                <TableCell align="right" className="table-cell" >Delete</TableCell>
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
                      {row.Ingredients.slice(0, 30)}
                    </TableCell>
                    <TableCell align="left" className="table-cell">{row.Instructions.slice(0, 30)}</TableCell>
                    <TableCell align="left" className="table-cell">
                      Username: {row.PostedBy.username} <br />
                      User ID: {row.PostedBy._id}
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      <Link to={row.Image_URL}> IMAGE URL</Link>
                    </TableCell>
                    <TableCell align="right" className="table-cell">
                      <div onClick={() => handleDeleteRecipe(row._id)} className='trash-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <h1>Detail Recipe</h1>

      </div>
    </>
  )
}

export default Recipes