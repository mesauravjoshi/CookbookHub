import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'

function Signup() {
  const [form, setForm] = useState({})
  const [alreadyEmail, setAlreadyEmail] = useState(false)
  const navigate = useNavigate();

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (response.ok) {
      console.log(data);
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
      <center> <h3>SIGN UP</h3> </center>

      <div className='form-outside'>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input onChange={handleForm} type="text" name='name' className="form-control" placeholder="Enter Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input onChange={handleForm} type="text" name='username' className="form-control" aria-describedby="emailHelp" placeholder="Enter email" required />
            {!alreadyEmail ?
              <small id="emailHelp" className="form-text ">We'll never share your email with anyone else.</small> : <small id="emailHelp" className="form-text text-muted">Username already taken</small>
            }
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input onChange={handleForm} type="text" name='password' className="form-control" placeholder="Password" required />
          </div>
          <button type="submit" className="btn btn-primary">SIGN UP</button>
        </form>
      </div>
    </>
  )
}

export default Signup