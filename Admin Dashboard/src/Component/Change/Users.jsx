import React, { useState, useEffect } from 'react'
import { url } from '../ApiUrl/Url';
import { Link } from 'react-router-dom';
import Header from '../Header'
import Sidebar from '../Sidebar'
import Table from '../../Table/Table'
import { useFetchData } from '../FetchContext';
import { useAuth } from '../Auth/AuthContext'; // Import the custom hook
import NotLogin from '../Auth/NotLogin';

function Users() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { totalUsers } = useFetchData();
  const { isLoggedIn } = useAuth(); // Get isLoggedIn and logout function

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='main-container'>
        {
          isLoggedIn?
          <Table totalUsers={totalUsers} />
          :
          <>
          <NotLogin/>
          </>
        }
      </div>
    </>
  )
}

export default Users