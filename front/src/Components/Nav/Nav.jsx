import React, { useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Nav.css'

function Nav( {isLoggedIn,user} ) {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        // setIsLoggedIn(false); // Update login status
        navigate('/')
    }

    // console.log('nav.jsx line 8',isLoggedIn);
    // console.log('nav.jsx line 9',user);

    return (
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="#">C<span>oo</span>kb<span>oo</span>kHub </a>   
            <Link className="nav-link" to='/home'>Explore Recipes:</Link>
            <div>

            {/* <input type="text" placeholder=' Search recipes...' />  */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
            </div>
            {
                user && isLoggedIn ?
                <>
                <Link className="nav-link" to='/bookmark'>
                Bookmarks&nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-bookmarks" viewBox="0 0 16 16">
                    <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
                    <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
                </svg>
                </Link>
                <Link className="nav-link" to={`/profile/${user.username}`} >My profile 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg> 
                </Link>
                <Link className="nav-link" to={`/upload/`} >
                Upload&nbsp;
                <i className="bi bi-upload"></i>
                </Link>
                <div className='nav-but'>
                    <Link to={`/`}>
                        <button onClick={handleLogOut} className='nav-but'> Logout </button>
                    </Link>
                </div>
                </>
                :
                <>
                    <Link to='/signup'>
                        <button className='nav-but'>Sign UP</button>
                    </Link>
                    <Link to='/login'>
                        <button className='nav-but'>Login</button>
                    </Link>
                </>
            }
        </nav>
    )
}

export default Nav