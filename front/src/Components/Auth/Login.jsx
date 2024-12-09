import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { url } from '../ApiUrl/Url';
import './Login.css';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [form, setForm] = useState({});
  const [failLoginMess, setFailLoginMess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser  from context

  const notify = () => {
    toast.success('Successfully Login!', {
      duration: 2000,
      position: "top-right",
      style: {
        border: '1px solid #713200',
        padding: '10px',
        color: '#713200',
        fontSize: '0.9rem',
      },
    });
  };

  const notifyFail = () => {
    toast.error('Incorrect Username or Password', {
      duration: 1500,
      position: "top-right",
      style: {
        border: '1px solid #713200',
        padding: '10px',
        color: '#713200',
        fontSize: '0.9rem',
      },
    });
  };

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();

      // Store token in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.user.name);
      setUser(data.user); // Set the user data in context
      notify()
      setTimeout(() => {
        navigate(`/`); // Redirect to profile
      }, 2000); // 10000 milliseconds = 10 seconds
    } catch (error) {
      console.error('Login failed', error.message);
      notifyFail();
      setFailLoginMess(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="login-page">
        <center>
          <h3>Log In</h3>
        </center>
        <div className="form">
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              onChange={handleForm}
              name="username"
              type="text"
              placeholder="Username"
              required
            />
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
      <Toaster />
    </>
  );
}

export default Login;