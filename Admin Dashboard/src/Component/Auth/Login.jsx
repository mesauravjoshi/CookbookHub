import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../ApiUrl/Url';
import { Link } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext'; // Import the custom hook

function Login() {
  const [username_admin, setUsername_admin] = useState('');
  const [password, setPassword] = useState('');
  const [failLoginMess, setFailLoginMess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  const handleForm = (e) => {
    const { name, value } = e.target;
    if (name === 'username_admin') setUsername_admin(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username_admin,
      password
    };

    try {
      const response = await fetch(`${url}/admin_auth/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      // Store token in local storage
      localStorage.setItem('admin token', data.token);
      localStorage.setItem('admin name', data.admin.username_admin);

      // Update the logged-in state using context
      login();

      // Redirect to another page after successful login
      navigate('/home'); // Change to the page you want to redirect to
    } catch (error) {
      console.error('Login failed', error.message);
      setFailLoginMess(true);
    } finally {
      setUsername_admin('');
      setPassword('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='main-container'>

    <div className="login-page">
      <center>
        <h3>Log In</h3>
      </center>
      <div className="form">
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            onChange={handleForm}
            value={username_admin}
            name="username_admin"
            type="text"
            placeholder="Username"
            required
          />
          <div className="password-container">
            <input
              onChange={handleForm}
              value={password}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
            />
            <span onClick={togglePasswordVisibility} className="eye-icon">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
          {!failLoginMess ? (
            <small id="emailHelp" className="form-text">&nbsp;</small>
          ) : (
            <small id="emailHelp" className="form-text text-muted">Incorrect Username or Password</small>
          )}
          <button type="submit">login</button>
          <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
