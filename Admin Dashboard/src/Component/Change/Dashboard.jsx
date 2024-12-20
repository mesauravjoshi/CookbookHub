import React, { useState, useEffect } from 'react'
import { url } from '../ApiUrl/Url';
import Header from '../Header'
import Sidebar from '../Sidebar'
// import Home from '../../Home'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'

function Dashboard() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalRecipe, setTotalRecipe] = useState([]);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`${url}/admin/users`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (userResponse.status === 401) {
                    return;
                }
                if (!userResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const usersData = await userResponse.json();
                setTotalUsers(usersData.users)
                // console.log(usersData.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchRecipeData = async () => {
            try {
                const recipesResponse = await fetch(`${url}/admin/recipes`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (recipesResponse.status === 401) {
                    return;
                }
                if (!recipesResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const recipesData = await recipesResponse.json();
                setTotalRecipe(recipesData.recipes)
                // console.log(recipesData.recipes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
        fetchRecipeData();
    }, [])

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
                            <h3>TOTAL RECIPES</h3>
                            <BsFillGrid3X3GapFill className='card_icon' />
                        </div>
                        <h1>{totalRecipe.length} </h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>USERS</h3>
                            <BsPeopleFill className='card_icon' />
                        </div>
                        <h1>{totalUsers.length}</h1>
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