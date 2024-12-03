import "./CssStyles/App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Components/Home";
import PatientDetails from "./Components/PatientDetails";
import PatientRegistration from "./Components/PatientRegistration";
import Login from "./Components/Login";
import { useEffect, useState } from "react";
import User from "./Components/User";



function App() {
  const [btnClicked,setBtnClicked] = useState<boolean>(false)
  useEffect(()=>{
  },[btnClicked])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<Home setBtnClicked={setBtnClicked} btnClicked={btnClicked}/>} />
        <Route path="/patientDetails/:id" element={<PatientDetails/>} />
        <Route path="/Patientregistration" element={<PatientRegistration />}/>
        <Route path="/user" element={<User/>} />
        <Route path="/" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
