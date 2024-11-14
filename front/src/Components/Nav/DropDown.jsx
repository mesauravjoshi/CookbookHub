import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './DropDown.css'
function DropDown() {
    return (
        <div className='drop-down'>
            <Link className="nav-link" to='/recipe'>Explore Recipe</Link>
            <div className='search-icon'>
                <div className="nav-link">

                    {/* <input type="text" placeholder=' Search recipes...' /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-search"
                        viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </div>
            </div>
            <Link className="nav-link" to='/bookmark'>
                Bookmarks&nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-bookmarks" viewBox="0 0 16 16">
                    <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
                    <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
                </svg>
            </Link>
        </div>
    )
}

export default DropDown