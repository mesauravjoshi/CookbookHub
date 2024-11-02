import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Nav.css'

function Nav() {
    const { user, setUser } = useUser();

    return (
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="#">CookbookHub </a>
            <Link className="nav-link" to='/home'>Home <span className="sr-only">(current)</span></Link>
            <Link className="nav-link" to='#'>About Us <span className="sr-only">(current)</span></Link>
            <Link className="nav-link" to='#'>Contact Us <span className="sr-only">(current)</span></Link>
            {
                !user &&
                <>
                    <Link to='/signup'>
                        <button className='nav-but'>Sign UP</button>
                    </Link>
                    <Link to='/login'>
                        <button className='nav-but'>Login</button>
                    </Link>
                </>
            }
            {
                user &&
                <div>
                    <Link to={`/profile/${user.username}`}>
                        <button className='nav-but'> My profile </button>
                    </Link>
                </div>
            }
        </nav>
    )
}

export default Nav