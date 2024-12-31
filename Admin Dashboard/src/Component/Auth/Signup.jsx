import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../ApiUrl/Url';
import './Signup.css'

function Signup() {
  const [form, setForm] = useState({});
  const [alreadyEmail, setAlreadyEmail] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // state for login status

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if username is already taken
    // const usernameExists = await checkUsernameExists(form.username);
    // // console.log(usernameExists)
    // if (usernameExists) {
    //   setAlreadyEmail(true); // Display email already registered error
    //   // notifyFail()
    //   setIsPasswordValid(false); // Ensure password error is cleared if username check fails
    //   return;
    // }
    // setAlreadyEmail(false);
    console.log(form);
    // Now that we know the username is valid, validate password
    if (!validatePassword(form.password)) {
      setIsPasswordValid(true); // Set password validation error
      notifyPasswordValid();
      return;
    }

    // Proceed with user registration since both username and password are valid
    const response = await fetch(`${url}/admin_auth/signup`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      console.log('ok response');
      // notify()
      setTimeout(() => {
        // navigate(`/login`); // Redirect to login
      }, 2000); // 10000 milliseconds = 10 seconds
    } else {
      setAlreadyEmail(true); // Show error if the backend response indicates username exists
      // notifyFail();
      console.log('Error: User already exists.');
    }
  };

  // Function to check if the username already exists in the database
  const checkUsernameExists = async (username) => {
    const response = await fetch(`${url}/auth/usernameExists/${username}`);
    const data = await response.json();
    // console.log(data);
    return data.exists; // Assume backend returns { exists: true/false }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>

      <div className="login-page">
        <center><h3>SIGN IN</h3></center>
        <div className="form">
          <form className="login-form" onSubmit={handleSubmit}>
            <input onChange={handleForm} name="username_admin" type="text" placeholder="Username" required />
            <div className="password-container">
              <input
                onChange={handleForm}
                name="password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                placeholder="Password"
                required
              />
              <span onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? '👁️' : '👁️‍🗨️'} {/* Change icons based on visibility */}
              </span>
            </div>
            {alreadyEmail && (
              <small id="emailHelp" className="form-text text-muted">
                This email is already registered
              </small>
            )}

            {isPasswordValid && (
              <small id="emailHelp" className="form-text text-muted">
                Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character
              </small>
            )}

            <button type="submit">SIGN IN</button>
            <p className="message">Already registered? <a href="/login">Log In</a></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup