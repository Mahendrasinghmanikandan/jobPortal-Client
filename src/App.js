import "../src/styles/index.css";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import Home from "./components/home/Home";
import Layout from "./components/layout/Layout";
import Logout from "./components/authentication/Logout";
import Candidate from "./components/home/hr/Candidate";
import Company from "./components/home/hr/Company";
import Createjob from "./components/home/hr/createJob";
import Applyjobs from "./components/home/candidate/Applyjobs";
import Appliedjobs from "./components/home/candidate/appliedJobs";
import ShowSkills from "./components/home/candidate/showskills";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <Home />
                <Layout />
              </>
            }
          />
          
        </Routes>
        <Routes>
          <Route
            path="/createjob"
            element={
              <>
                <Layout />
                <Createjob />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/applyjob"
            element={
              <>
                <Layout />
                <Applyjobs />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/appliedjob"
            element={
              <>
                <Layout />
                <Appliedjobs />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/candidate"
            element={
              <>
                <Layout />
                <Candidate />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/company"
            element={
              <>
                <Layout />
                <Company />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/logout"
            element={
              <>
                <Logout />
                <Layout />
              </>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/showskills"
            element={
              <>
                <ShowSkills />
                <Layout />
              </>
            }
          />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
