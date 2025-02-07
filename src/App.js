import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartPage from "./pages/StartPage";
import SpotPage from "./pages/SpotPage";
import TaskPage from "./pages/TaskPage";
import CommentPage from "./pages/CommentPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminTaskPage from "./pages/AdminTaskPage";
import AdminTaskListPage from "./pages/AdminTaskListPage";
import ReportPage from "./pages/ReportPage";
import AdminTaskTypePage from "./pages/AdminTaskTypePage";
import AdminTaskOther from "./pages/AdminTaskOther";
import AdminNowPage from "./pages/AdminNowPage";
import AdminEmployee from "./pages/AdminEmployee";
import Plots from "./pages/Plots";
import NotTask from "./pages/NotTask";
import UsersLoginPage from "./pages/UsersLoginPage";

const ProtectedRouteUser = ({ element }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return element;
};

const ProtectedRouteAdmin = ({ element }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      // Redirect to the login page if not authenticated
      navigate("/");
    }
  }, [isAdmin, navigate]);
  return element;
};

function App() {
  
    return (
      <div className="name">
      
      <Router>
        <Routes>
          <Route path="/" element={<UsersLoginPage />} />
          <Route path="/start" element={<ProtectedRouteUser element={<StartPage />}/>} />
          <Route path="/login" element={<ProtectedRouteUser element={<LoginPage />}/>} />
          <Route path="/spot/:id" element={<ProtectedRouteUser element={<SpotPage />}/>} />
          <Route path="/task/:id/:employeeId" element={<ProtectedRouteUser element={<TaskPage />}/>} />
          <Route path="/comment/:id/:employeeId/:taskId/" element={<ProtectedRouteUser element={<CommentPage />}/>} />
          <Route path="/admin-page" element={<ProtectedRouteAdmin element={<AdminPage />}/>} />
          <Route path="/admin-task-type" element={<ProtectedRouteAdmin element={<AdminTaskTypePage/>}/>} />
          <Route path="/admin-task/:type" element={<ProtectedRouteAdmin element={<AdminTaskPage/>}/>} />
          <Route path="/admin-task/other" element={<ProtectedRouteAdmin element={<AdminTaskOther/>}/>} />
          <Route path="/admin-task-list" element={<ProtectedRouteAdmin element={<AdminTaskListPage/>}/>} />
          <Route path="/admin-now-task-list" element={<ProtectedRouteAdmin element={<AdminNowPage/>}/>} />
          <Route path="/admin-employee" element={<ProtectedRouteAdmin element={<Plots/>}/>} />
          <Route path="/admin-employee/:id" element={<ProtectedRouteAdmin element={<AdminEmployee/>}/>} />
          <Route path="/report" element={<ProtectedRouteAdmin element={<ReportPage/>}/>} />
          <Route path="/not-task" element={<ProtectedRouteUser element={<NotTask />}/>} />

        </Routes>


      </Router>
      </div>
    );
}

export default App;