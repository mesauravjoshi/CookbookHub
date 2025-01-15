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
import { useFetchData } from '../Component/FetchContext';
import axios from 'axios';

export default function BasicTable({}) {

const [userBasicInfo, setUserBasicInfo] = useState({});
const [userActivitySummary, setUserActivitySummary] = useState({});
const [userBookmarkedRecipes, setUserBookmarkedRecipes] = useState({});
const [isViewClicked, setIsViewClicked] = useState(false);
const { totalUsers,setTotalUsers } = useFetchData();

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

const handleDeleteUser = async (user_id, username) => {
  const userConfirmed = confirm(`Are you sure you want to delete user ${username}?`);
  
  if (userConfirmed) {
    const token = localStorage.getItem('admin token');
    
    try {
      const response = await axios.delete(`${url}/admin_auth/delete_user/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // If the deletion is successful, handle the result here
      // console.log('User deleted', response.data);

    } catch (error) {
      console.error('Error deleting user:', error);
    }

    try {
        const userResponse = await axios.get(`${url}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (userResponse.status === 401) {
            return;
        }

        setTotalUsers(userResponse.data.users);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
};

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="table-cell">User ID </TableCell>
            <TableCell className="table-cell" align="right">Name</TableCell>
            <TableCell className="table-cell" align="right">Username</TableCell>
            <TableCell className="table-cell" align="right">No. of recipe</TableCell>
            <TableCell className="table-cell" align="right">View Details</TableCell>
            <TableCell className="table-cell" align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalUsers.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell className="table-cell" component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell className="table-cell" align="right">{row.name}</TableCell>
              <TableCell className="table-cell" align="right">{row.username}</TableCell>
              <TableCell className="table-cell" align="right">{row.recipes}</TableCell>
              <TableCell className="table-cell" align="right"> <p onClick={() => scrollToElement('Detailed-User-data', row._id)} style={{ cursor: 'pointer' }} >View</p></TableCell>
              <TableCell className="table-cell" align="right"> 
              <div onClick={() => handleDeleteUser(row._id,row.username)} className='trash-icon'>
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