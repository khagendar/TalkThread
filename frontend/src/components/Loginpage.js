import {useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css'

const Loginpage = () => {
    const [username,setUser]=useState('');
    const [password,setPass]=useState('');
    const navigate=useNavigate();
    const handlelog=(e)=>{
        e.preventDefault();    
        axios.post('http://localhost:3090/login',{username,password})
        .then(res=>{
            console.log(res.data)
            if(res.data.msg==="Login success"){
                navigate('/home');
            }
            else{
                alert(res.data.msg);
            }
        })
        .catch(err=>console.log(`axios err ${err.message}`));
    }
    return ( 
        <div className="login">
                <form onSubmit={(e)=>handlelog(e)}>
                    <h1>LOGIN</h1>
                    <input type="text" required
                        value={username}
                        onChange={(e)=>setUser(e.target.value)}
                        placeholder='Username'
                    />
                    <input type='password' required
                        value={password}
                        onChange={(e)=>setPass(e.target.value)}
                        placeholder='Password'
                    />
                    <button>LogIn</button>
                </form>
                <div>
                <p>Create a new acount</p><Link to="/SignUp">SignUp</Link>
                </div>
        </div>
     );
}
 
export default Loginpage;