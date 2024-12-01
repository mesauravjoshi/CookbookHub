import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './DropDown.css'

function DropDown({ isToggle, showMenu }) {
    // console.log('DropDown file : ',isToggle);

    return (
        <div className={showMenu && isToggle ? 'drop-down-toogle' : 'drop-down'}>
            <Link className="nav-link" to={`/profile/MyRecipes`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="rgb(95, 78, 78)"><path d="M300-96v-389q-47-12-77.5-50.1T192-624v-240h72v240h36v-240h72v240h36v-240h72v240q0 50.8-30.5 88.9Q419-497 372-485v389h-72Zm396 0v-336H576v-240q0-79.68 56.16-135.84T768-864v768h-72Z"/></svg>
                &nbsp;&nbsp;My Recipes
            </Link>
            <Link className="nav-link" to={`/profile/EditProfile`}>
                <i className="bi bi-person-lines-fill"></i>&nbsp;&nbsp;
                Edit Profile
            </Link>
            <Link className="nav-link" to={'/profile/ChangePassword'}>
            <i className="bi bi-key"></i>&nbsp;&nbsp;
                Change Password
            </Link>

        </div>
    )
}

export default DropDown