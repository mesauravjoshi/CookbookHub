import React, { useState } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useFetchData } from '../FetchContext';
// import Home from '../../Home'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'
import { useAuth } from '../Auth/AuthContext';
import NotLogin from '../Auth/NotLogin';

function Dashboard() {
    const { isLoggedIn } = useAuth(); // Get isLoggedIn and logout function
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const { totalUsers, totalRecipe, totalRBookmarkRecipe, recipeAddedToday } = useFetchData();
    const token = localStorage.getItem('admin token');
    const decodeToken = JSON.parse(atob(token.split('.')[1]));

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }

    return (
        <>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            {
                isLoggedIn ?
                    <div className='main-container'>
                        <h3> {decodeToken.username_admin} </h3>
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
                                    <h3>BOOKMARKED RECIPES</h3>
                                    <BsFillArchiveFill className='card_icon' />
                                </div>
                                <h1>{totalRBookmarkRecipe.length}</h1>
                            </div>
                            <div className='card'>
                                <div className='card-inner'>
                                    <h3>RECIPE ADDED TODAY </h3>
                                    <BsFillBellFill className='card_icon' />
                                </div>
                                <h1> {recipeAddedToday} </h1>
                            </div>

                        </div>
                        <div className='main-cards'>
                            <div className='card'>
                                <div className='card-inner'>
                                    <h3>REPORT</h3>
                                    <BsPeopleFill className='card_icon' />
                                </div>
                                <h1>{totalUsers.length}</h1>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='main-container'>
                        <NotLogin />
                    </div>
            }
        </>
    )
}

export default Dashboard