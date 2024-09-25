import Loginpage from './components/Loginpage';
import SignUp from './components/Signup';
import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './components/Home';
import { CCol } from '@coreui/react';
import NavBar from './components/NavBar';
import Post from './components/post';
function App() {
  return (
    <div className="App" style={{ display: 'flex-grow', height: 'auto' }}>
      {/* <CCol style={{ width: '250px' }}>
        <NavBar /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/post" element={<Post/>}/>
          </Routes>
        </BrowserRouter>
      {/* </CCol> */}
    </div>
  );
}

export default App;
