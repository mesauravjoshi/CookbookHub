import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Import the context

function App() {
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
        const response = await fetch('http://localhost:3000/login', {
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
        localStorage.setItem('token', data.token,'name',data.user.name);
        localStorage.setItem('name',data.user.name);
        console.log(data.token);
        console.log(data.user.name);

        setUser(data.user); // Set the user data in context
        navigate(`/profile/${data.user.username}`);  //Redirect to profile


    } catch (error) {
        console.error('Login failed', error.message);
        setFailLoginMess(true);
    }
};


  return (
    <>
      {/* Form code  sign up*/}
      <center> <h3>LOG IN</h3> </center>
      <div className='form-outside'>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input onChange={handleForm} name='username' type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input onChange={handleForm} name='password' type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" required/>
            { !failLoginMess ?
              <small id="emailHelp" className="form-text ">&nbsp;</small> : <small id="emailHelp" className="form-text text-muted">Incorrect Username or Password</small>
            }
          </div>
          
          <button type="submit" className="btn btn-primary">LOG IN</button>
          &nbsp; &nbsp; &nbsp;  New here?
          <Link to='/signup'>
            <button className="btn btn-primary">SIGN UP</button>
          </Link>
        </form>
      </div>
    </>
  )
}

export default App