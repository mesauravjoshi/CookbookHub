import React, { useState, useEffect } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useFetchData } from '../FetchContext';
import { Link } from 'react-router-dom';
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
  const { detalRecipe, serDetalRecipe} = useState('');
  // console.log(totalRecipe);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
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
                <TableCell align="right" className="table-cell" >Instructions</TableCell>
                <TableCell align="right" className="table-cell" >PostedBy</TableCell>
                <TableCell align="right" className="table-cell" >Recipe Image URL</TableCell>
                <TableCell align="right" className="table-cell" >Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                totalRecipe.slice(0, 1).map((row) => (
                  <TableRow
                    key={row._id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" className="table-cell">{row.Recipes}</TableCell>
                    <TableCell align="left" className="table-cell">{row._id}</TableCell>
                    <TableCell component="th" scope="row" className="table-cell">
                      {row.Ingredients.slice(0, 30)}
                    </TableCell>
                    <TableCell align="right" className="table-cell">{row.Instructions.slice(0, 30)}</TableCell>
                    <TableCell align="right" className="table-cell">
                      Username: {row.PostedBy.username} <br />
                      User ID: {row.PostedBy._id}
                    </TableCell>
                    <TableCell align="right" className="table-cell">
                      <Link to={row.Image_URL}> IMAGE URL</Link>
                    </TableCell>
                    <TableCell align="right" className="table-cell">
                      <Link> Delete user </Link>
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