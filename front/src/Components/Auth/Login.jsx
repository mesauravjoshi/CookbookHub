import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Login.css'

function Login() {
  const [form, setForm] = useState({})
  const [failLoginMess, setFailLoginMess] = useState(false)
  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser from context

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log('Login successful', data);

      // Store token in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.user.name);
      console.log(data.token);
      console.log(data.user.name);
      console.log(data.user);
      
      setUser(data.user); // Set the user data in context
      navigate(`/`);  //Redirect to profile

    } catch (error) {
      console.error('Login failed', error.message);
      setFailLoginMess(true);
    }
  };

  return (
    <>
      {/* Form code  sign up*/}

      <div className="login-page">
        <center> <h3>Log In</h3> </center>
        <div className="form">
          <form className="login-form" onSubmit={handleSubmit}>
            <input onChange={handleForm} name='username' type="text" placeholder="Username" required />
            <input onChange={handleForm} name='password' type="text" placeholder="Password" required />
            {/* <span>Incorrect Username or Password</span> */}
            {!failLoginMess ?
              <small id="emailHelp" className="form-text ">&nbsp;</small> : <small id="emailHelp" className="form-text text-muted">Incorrect Username or Password</small>
            }
            <button type="submit" >login</button>
            <p className="message">Not registered? <a href="/signup">Create an account</a></p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login