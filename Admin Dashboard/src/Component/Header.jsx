import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css';
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'
import {useAuth } from './Auth/AuthContext'

function Header({OpenSidebar}) {
  const { isLoggedIn, logout } = useAuth(); // Get isLoggedIn and logout function
  // const token = localStorage.getItem('admin token');
  // if (token){
  //   const decodeToken = JSON.parse(atob(token.split('.')[1]));
  // }

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            {/* <BsSearch  className='icon'/> */}
        </div>
        <div className='header-right'>
            {/* <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/> */}
            {isLoggedIn ? (
            <div className='login-but'>
              {
              //   decodeToken &&
              // <h5> {decodeToken.username_admin} </h5>
              }
              <Link onClick={logout}>Logout <BsPersonCircle className='icon'/> </Link>
            </div>
          ) : (
            <div className='login-but'>
              <Link to="/login">Login <BsPersonCircle className='icon'/> </Link>
            </div>
          )}
            
        </div>
    </header>
  )
}

export default Header