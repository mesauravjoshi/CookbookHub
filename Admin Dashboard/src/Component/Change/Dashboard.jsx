import React, { useState, useEffect } from 'react'
import { url } from '../ApiUrl/Url';
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useFetchData } from '../FetchContext';
// import Home from '../../Home'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'

function Dashboard() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const { totalUsers , totalRecipe} = useFetchData();
    
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    return (
        <>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className='main-container'>
                <div className='main-title'>
                    <h3>DASHBOARD</h3>
                </div>

                <div className='main-cards'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>USERS</h3>
                            <BsPeopleFill className='card_icon' />
                        </div>
                        <h1>{totalUsers.length}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>TOTAL RECIPES</h3>
                            <BsFillGrid3X3GapFill className='card_icon' />
                        </div>
                        <h1>{totalRecipe.length} </h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            {/* <h3>ALERTS</h3> */}
                            <BsFillBellFill className='card_icon' />
                        </div>
                        {/* <h1>42</h1> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard