import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import './signup.css';

const SignUp = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res=await axios.post('http://localhost:3090/signup', { username, email, password });
            console.log(res);
            alert("Registered successfully");
            navigate('/login');
        }
        catch(err){
            console.log(err);
        }
    };
    return (
        <div className="signup">
            <div>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <input
                    type="text"
                    required
                    value={username}
                    placeholder="UserName"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    required
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"  // Change the input type to "password"
                    required
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPass(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            </div>
            <div className="below_block">
                <p>Have an account<Link to="/login"> login</Link> ? </p>
            </div>
        </div>
    );
};

export default SignUp;
