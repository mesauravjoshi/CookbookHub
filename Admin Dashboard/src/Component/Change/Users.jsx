import React, { useState, useEffect } from 'react'
import { url } from '../ApiUrl/Url';
import Header from '../Header'
import Sidebar from '../Sidebar'
import Table from '../../Table/Table'
import { useFetchData } from '../FetchContext';


function Users() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { totalUsers ,setTotalUsers, totalRecipe, setTotalRecipe } = useFetchData();
  // const { totalUsers} = useFetchData();
  console.log(totalUsers);
  
  const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <>
    <Header OpenSidebar={OpenSidebar} />
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
    <div className='main-container'>
        <h1>Uses</h1>
        <Table totalUsers={totalUsers} />
    </div>
    </>
  )
}

export default Users