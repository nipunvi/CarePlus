import React, { useState } from 'react';
import PageLayout from "./PageLayout";
import '../CssStyles/App.css';
import { useNavigate } from 'react-router-dom';
import medilogo from '../assets/carepluslogo.png'
import logo from '../assets/carepluslogo.png'

const Login = () => {
  
  const [username, setUsername] = useState('doctor');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const yearGenerator = () => {
   
    const date = new Date()
    return date.getFullYear()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username !== 'doctor' || password !== 'doc123') {
      setError('Invalid username or password');
    } else {
      setError('');
      // Handle successful login here
      alert('Login successful!');
    }
  };
const handlelogin = () =>{
 console.log("Hiran...................")
 if(username === 'doctor' && password == 'doc123' ){
 
  navigate("/home")

}else{
  alert("Login Failed")
} 
 
  
}
  return (
    <>
      <div className="d-flex justify-content-center align-items-center page-bg">
      <div className="image-container">
        <img className="ms-1"
            src={logo}  
            style={{ width: '150px', height: 'auto' }} 
          />
    </div>
        <div className="card card-body"  style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className="text-center">User Login</h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form >
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="floatingInput">User Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="submit" className="btn btn-success w-100" onClick={handlelogin}>Submit</button>
          </form>
        </div>
      </div>
     
      <small className="footer" style={{textAlign:"center",justifyContent:"center",backgroundColor:"lightblue"}}>
          
          &copy; {yearGenerator()} NEX7 IT Services & Consulting | 
          <span>
          <img className="ms-1"
            src={medilogo}  
            
          /> {' '} v1.0 
          </span>
        </small>
     
   </>
  );
};

export default Login;
