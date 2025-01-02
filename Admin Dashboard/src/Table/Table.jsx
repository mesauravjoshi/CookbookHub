import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import {url} from '../Component/ApiUrl/Url'

export default function BasicTable({totalUsers}) {

const [userBasicInfo, setUserBasicInfo] = useState({});
const [userActivitySummary, setUserActivitySummary] = useState({});
const [userBookmarkedRecipes, setUserBookmarkedRecipes] = useState({});
const [isViewClicked, setIsViewClicked] = useState(false);

const scrollToElement = async (id, user_id) => {
  const token = localStorage.getItem('admin token');
  // e.preventDefault();
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: 'smooth' });
  try {
    const response = await fetch(`${url}/admin/Detailed-User-data/${user_id}`, {
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
    // console.log(result);
    setUserBasicInfo(result.user_info[0]);
    setUserActivitySummary(result.user_recipe);
    setUserBookmarkedRecipes(result.user_recipe_bookmark);
    setIsViewClicked(true);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID </TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">No. of recipe</TableCell>
            <TableCell align="right">View Details</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalUsers.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.username}</TableCell>
              <TableCell align="right">{row.recipes}</TableCell>
              <TableCell align="right"> <p onClick={() => scrollToElement('Detailed-User-data', row._id)} style={{ cursor: 'pointer' }} >View</p></TableCell>
              <TableCell align="right"> <Link> Delete user </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div id='Detailed-User-data'>
    {
    isViewClicked &&
      <>
      <h1>Basic info</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
          <TableBody>
            <TableRow>
              <TableCell className="table-cell" component="th" scope="row"><strong>User ID:</strong></TableCell>
              <TableCell className="table-cell">{userBasicInfo._id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell" component="th" scope="row"><strong>Name:</strong></TableCell>
              <TableCell className="table-cell">{userBasicInfo.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell" component="th" scope="row"><strong>Username:</strong></TableCell>
              <TableCell className="table-cell">{userBasicInfo.username}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <h1>User Activity</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="detail recipe table">
          <TableBody>
            <TableRow>
              <TableCell className="table-cell" component="th" scope="row"><strong>Recipe Posted:</strong></TableCell>
              <TableCell className="table-cell">{userActivitySummary.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell" component="th" scope="row"><strong>Total bookmarked recipes:</strong></TableCell>
              <TableCell className="table-cell">{userBookmarkedRecipes.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      </>
    }
    </div>
    </>
  );
}