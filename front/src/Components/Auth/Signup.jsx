import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'

function Signup() {
  const [form, setForm] = useState({});
  const [alreadyEmail, setAlreadyEmail] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

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
    const usernameExists = await checkUsernameExists(form.username);
    console.log(usernameExists)
    if (usernameExists) {
      console.log('user pda hai bhai');
      setAlreadyEmail(true); // Display email already registered error
      setIsPasswordValid(false); // Ensure password error is cleared if username check fails
      return;
    }
    setAlreadyEmail(false); // Display email already registered error
    console.log('nahi pdaa');

    // Now that we know the username is valid, validate password
    if (!validatePassword(form.password)) {
      setIsPasswordValid(true); // Set password validation error
      return;
    }

    // Proceed with user registration since both username and password are valid
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/login'); // Redirect to /login
    } else {
      setAlreadyEmail(true); // Show error if the backend response indicates username exists
      console.log('Error: User already exists.');
    }
  };

  // Function to check if the username already exists in the database
  const checkUsernameExists = async (username) => {
    const response = await fetch(`http://localhost:3000/auth/usernameExists/${username}`);
    const data = await response.json();
    console.log(data);
    return data.exists; // Assume backend returns { exists: true/false }
  };


  return (
    <>
      <div className="login-page">
        <center><h3>SIGN IN</h3></center>
        <div className="form">
          <form className="login-form" onSubmit={handleSubmit}>
            <input onChange={handleForm} name="name" type="text" placeholder="Name" required />
            <input onChange={handleForm} name="username" type="text" placeholder="Username" required />
            <input onChange={handleForm} name="password" type="text" placeholder="Password" required />

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