import { useState } from 'react';
import './login.css';
import image from './google.png'; 
import n from './name1.jpg';
import e from './email1.webp';
import p from './lock.jpg';
import ec from './eyeclose3.jpg';
import eo from './eyeopen1.webp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Routes/AuthContex'; // Ensure the path is correct

export default function Login({ action }) {
  const [passwordType, setPasswordType] = useState("password");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth(); // Use auth context

  const togglePasswordVisibility = () => {
    setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (action === "Sign In") {
        await auth.login(details); // Call the login method from AuthContext
        toast.success("Sign In Successful");
        navigate('/chat'); // Navigate to the chat page after login
      } else {
        await auth.signup(details);
        toast.success("Sign up Successful");
        navigate('/signin'); 
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "An error occurred";
      setMessage(msg);
      toast.error(msg);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div className='page'>
      <h1 className='title_name'>TalkThread</h1>
      <div className='login-page'>
        <div className='photo'>
          <div className='g-signin'>
            <img className='goog' src={image} alt='Google sign-in' />
            <p>{action} with Google</p>
          </div>
        </div>
        <div className='login'>
          <div className='name'>
            <h1>{action}</h1>
            <div className='underline'></div>
          </div>
          <form onSubmit={handleFormSubmit}>
            {action === "Sign Up" && (
              <div className='inpname'>
                <label>Name:</label>
                <div className='icon-photo'>
                  <img src={n} className='icon' alt='Name icon' />
                  <input
                    type='text'
                    name='name'
                    placeholder='Enter Name'
                    required
                    value={details.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div className='inpname'>
              <label>Email:</label>
              <div className='icon-photo'>
                <img src={e} className='icon' alt='Email icon' />
                <input
                  type='email'
                  name='email'
                  placeholder='Enter Email'
                  required
                  value={details.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='inpname'>
              <label>Password:</label>
              <div className='icon-photo'>
                <img src={p} className='icon' alt='Password icon' />
                <input
                  type={passwordType}
                  name='password'
                  placeholder='Enter Password'
                  required
                  value={details.password}
                  onChange={handleInputChange}
                />
                <img
                  src={passwordType === "password" ? ec : eo}
                  className='icon'
                  onClick={togglePasswordVisibility}
                  alt='Toggle visibility'
                />
              </div>
            </div>
            {action === "Sign In" && (
              <div className='forgot'>
                <a href='###'>Forgot Password</a>
              </div>
            )}
            {action === "Sign Up" && (
              <div className='check-box'>
                <input
                  type='checkbox'
                  name='terms'
                  required
                  className='largercheckbox'
                />
                <label>
                  Yes, I agree to the <a href='#'>Terms and Conditions</a>
                </label>
              </div>
            )}
            <div className='sub'>
              <button type="submit">{action}</button>
            </div>
          </form>
          <div className='heading'>
            {action === "Sign In" && (
              <p>
                Create an Account? <span className='link' onClick={handleSignUpClick}>Sign Up</span>
              </p>
            )}
            {action === "Sign Up" && (
              <p>
                Already have an account? <span className='link' onClick={handleSignInClick}>Sign In</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
