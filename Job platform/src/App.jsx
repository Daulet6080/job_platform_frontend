import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard.jsx';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import JobListPage from './pages/JobListPage';
import './App.css';
import {useEffect, useState} from 'react';
import RegistrationPage from './pages/RegistrationPage';
import JobDetailPage from './pages/JobDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ApplyPage from './pages/ApplyPage';
import {JobsProvider} from './context/JobsContext';
import JobSeekerProfilePage from './pages/profile/JobSeekerProfilePage.jsx';
import EmployerProfilePage from './pages/profile/EmployerProfilePage';
import CreateVacancy from "./pages/vacancies/CreateVacancy.jsx";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoggedIn(!!(user && user.token));
        setUsername(user?.username || "");
        setUserRole(user?.role || null);
    }, []);

    return (
        <div className="App">
            {}
            <JobsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={<JobSeekerDashboard username={username} loggedIn={loggedIn}
                                                         setLoggedIn={setLoggedIn}/>}
                        />
                        <Route path="/" element={<JobSeekerDashboard username={username} loggedIn={loggedIn}
                                                                     setLoggedIn={setLoggedIn}/>}/>
                        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername}
                                                             setUserRole={setUserRole}/>}/>
                        <Route path='/signup'
                               element={<RegistrationPage setLoggedIn={setLoggedIn} setUsername={setUsername}
                                                          setUserRole={setUserRole}/>}/>
                        <Route path="/jobs" element={<JobListPage/>}/>
                        <Route path="/jobs/:id" element={<JobDetailPage/>}/>
                        <Route path="/favorites" element={<FavoritesPage/>}/>
                        <Route path="/apply" element={<ApplyPage/>}/>

                        {/* Защищенные маршруты для авторизованных пользователей */}
                        <Route
                            path="/profile/jobseeker"
                            element={loggedIn && userRole === 'jobseeker' ? <JobSeekerProfilePage/> :
                                <Navigate to="/login" replace/>}
                        />
                        <Route
                            path="/profile/employer"
                            element={<EmployerProfilePage/>}
                            // element={loggedIn && userRole === 'employer' ? <EmployerProfilePage /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/employer/dashboard"
                            element={<EmployerDashboard />} // пока тексерип жатырм если че озгерте койындар
                            // element={loggedIn && userRole === 'employer' ? <EmployerDashboard /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/vacancies/create"
                            element={<CreateVacancy />}
                            // element={loggedIn && userRole === 'employer' ? <CreateVacancy /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/jobseeker/dashboard"
                            element={loggedIn && userRole === 'jobseeker' ? <JobSeekerDashboard username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> : <Navigate to="/login" replace />}
                        />
                    </Routes>
                </BrowserRouter>
            </JobsProvider>
        </div>
    );
}

export default App;