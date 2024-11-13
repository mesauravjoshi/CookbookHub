import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'

function Signup() {
  const [form, setForm] = useState({})
  const [alreadyEmail, setAlreadyEmail] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const navigate = useNavigate();

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      // Log the error message to the console
      console.log('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsPasswordValid(true)
      return;
    }

    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (response.ok) {
      // console.log(data);
      navigate('/login'); // Redirect to /login
    } else {
      // console.error('line 30: ',data.message); // Log the error message
      setAlreadyEmail(true)
      console.log('already hai bahi');
    }
  }
  return (
    <>
      {/* Form code  sign up*/}
      <div className="login-page">
        <center> <h3>SIGN IN</h3> </center>
        <div className="form">
          <form className="login-form" onSubmit={handleSubmit}>
            <input onChange={handleForm} name='name' type="text" placeholder="Name" required />
            <input onChange={handleForm} name='username' type="text" placeholder="Username" required />
            <input onChange={handleForm} name='password' type="text" placeholder="Password" required />
            {/* <span>Incorrect Username or Password</span> */}
            {alreadyEmail &&
              <small id="emailHelp" className="form-text text-muted">This email is Already registered</small>
            }
            {!isPasswordValid ?
              null : <small id="emailHelp" className="form-text text-muted"> Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character </small>
            }
            <button type="submit" >SIGN IN</button>
            <p className="message">Already registered? <a href="/login">Log In</a></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup