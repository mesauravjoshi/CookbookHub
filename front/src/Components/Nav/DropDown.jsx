import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './DropDown.css'

function DropDown({isToggle,showMenu}) {
    // console.log('DropDown file : ',isToggle);
    
    return (
        <div className={showMenu && isToggle ? 'drop-down-toogle':'drop-down'}>
            <Link className="nav-link" to={`/profile/MyRecipes`}>My Recipes</Link>
            <Link className="nav-link" to={`/profile/EditProfile`}>Edit Profile&nbsp;</Link>
            <Link className="nav-link" to={'/profile/ChangePassword'}>Change Password</Link>
            
        </div>
    )
}

export default DropDown