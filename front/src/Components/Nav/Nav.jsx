import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from './DropDown';
import SearchBox from './SearchBox';
import './Nav.css'

function Nav({ isLoggedIn, user }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)
    const [isToggle, setIsToggle] = useState(false)
    const [hideDropDown, setHideDropDown] = useState(true)
    const [isModeDark, setIsModeDark] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Add state to track if search is open

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen); // Toggle search box visibility
    };

    const handleCross = () => {
        setIsSearchOpen(false); // Toggle search box visibility
    }

    const handleMouseEnter = () => {
        setHideDropDown(false)
    }

    const handleMouseLeave = () => {
        setHideDropDown(true)
    }

    const handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        // setIsLoggedIn(false); // Update login status
        navigate('/')
        window.location.reload();
    }

    const handleToggle = () => {
        setShowMenu(!showMenu)
        setIsToggle(prev => !prev)
    }
    const setDarkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Save theme in localStorage
    };

    const setLightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); // Save theme in localStorage
    };

    const handleToggleTheme = (e) => {
        setIsModeDark(prev => !prev)
        if (isModeDark)
            setLightMode();
        else {
            setDarkMode(); // Set dark mode if it was light before
        }
    }
    useEffect(() => {
        const storedMode = localStorage.getItem('theme');
        console.log(storedMode);
        
        if (storedMode === 'light') {
            setLightMode();
            setIsModeDark(false);
        } else {
            setDarkMode();
            setIsModeDark(true);
        }
    }, []);

    return (
        <nav className="navbar navbar-dark bg-Dark">
            <Link className="navbar-brand" to='/'>C<span>oo</span>kb<span>oo</span>kHub</Link>

            {
                user && isLoggedIn ?
                    <>
                        <div className={showMenu ? 'center-nav menu-mobile' : 'center-nav'}  >
                            <Link className="nav-link" to='/recipe'>Explore Recipe</Link>

                            {/* search  */}
                            <Link onClick={handleSearchClick} className="nav-link fix-search" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-search"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                                Search
                            </Link>

                            {/* <SearchBox/> */}
                            {/* search  */}

                            <Link className="nav-link" to='/bookmark'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-bookmarks" viewBox="0 0 16 16">
                                    <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
                                    <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
                                </svg>&nbsp;
                                Bookmarks
                            </Link>
                            <div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} className='My-profile'>
                                <Link className="nav-link" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                    My profile
                                </Link>
                                {isToggle}
                                {
                                    !hideDropDown &&
                                    <DropDown isToggle={isToggle} showMenu={showMenu} />
                                    // <div className='drop_down' >
                                    // </div>
                                }
                            </div>
                            <Link className="nav-link" to={`/upload/`} >
                                <i className="bi bi-upload fs-6"></i>&nbsp;
                                Upload
                            </Link>
                        </div>
                        <div className={showMenu ? 'nav-but-right menu-mobile-logout' : 'nav-but-right'} >
                            <Link to={`/`}>
                                <button onClick={handleLogOut} className='nav-but'><i className="bi bi-power"></i> Logout</button>
                            </Link>
                        </div>
                    </>

                    :

                    <>
                        <div className={showMenu ? 'center-nav menu-mobile' : 'center-nav menu-web'} >
                            <Link className="nav-link" to='/recipe'>Explore Recipe</Link>
                            {/* search  */}
                            <Link className="nav-link fix-search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-search"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                                Search
                            </Link>
                        </div>
                        <div className={showMenu ? 'nav-but-right menu-mobile-logout' : 'nav-but-right'}>
                            <Link to='/login'>
                                <button className='nav-but'><i className="bi bi-person-circle"></i> Login</button>
                            </Link>
                        </div>
                    </>
            }
            <div onClick={handleToggle} className="ham-menu">
                {
                    isToggle ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>

                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list-task" viewBox="0 0 16 16">
                            <path d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z" />
                            <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
                            <path d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z" />
                        </svg>
                }
            </div>
            {/* dark mode  */}
            <div className='dark-mode-icon' onClick={handleToggleTheme}>
                {
                    isModeDark ?
                        <i className="bi bi-moon"></i> :
                        <i className="bi bi-sun"></i>
                }
            </div>
            <div onClick={handleSearchClick} className='search-box'>
                <Link className="nav-link" >
                    <center>

                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-search"
                            viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        Search
                    </center>
                </Link>
            </div>

            {isSearchOpen && (
                <SearchBox isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            )}

        </nav>
    )
}

export default Nav