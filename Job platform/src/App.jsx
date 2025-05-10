import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard.jsx';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import JobListPage from './pages/JobListPage';
import './App.css';
import {useContext, useEffect} from 'react';
import RegistrationPage from './pages/RegistrationPage';
import JobDetailPage from './pages/JobDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ApplyPage from './pages/ApplyPage';
import {JobsProvider} from './context/JobsContext';
import JobSeekerProfilePage from './pages/profile/JobSeekerProfilePage.jsx';
import EmployerProfilePage from './pages/profile/EmployerProfilePage';
import CreateVacancy from "./pages/vacancies/CreateVacancy.jsx";
import { AuthProvider, AuthContext } from './context/AuthContext';
import CompaniesListPage from './pages/CompaniesListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, loading } = useContext(AuthContext);
    
    if (loading) {
        return <div>Загрузка...</div>;
    }
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

function AppContent() {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="App">
            <JobsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<JobSeekerDashboard />} />
                        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
                        <Route path='/signup' element={!currentUser ? <RegistrationPage /> : <Navigate to="/" />} />
                        <Route path="/jobs" element={<JobListPage />} />
                        <Route path="/jobs/:id" element={<JobDetailPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/apply" element={<ApplyPage />} />
                        
                        <Route
                            path="/profile/jobseeker"
                            element={
                                <ProtectedRoute requiredRole="jobseeker">
                                    <JobSeekerProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/employer"
                            element={
                                <ProtectedRoute requiredRole="employer">
                                    <EmployerProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/employer/dashboard"
                            element={
                                <ProtectedRoute requiredRole="employer">
                                    <EmployerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vacancies/create"
                            element={
                                <ProtectedRoute requiredRole="employer">
                                    <CreateVacancy />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/jobseeker/dashboard"
                            element={
                                <ProtectedRoute requiredRole="jobseeker">
                                    <JobSeekerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/companies" element={<CompaniesListPage />} />
                        <Route path="/companies/:id" element={<CompanyDetailPage />} />
            

                    </Routes>
                </BrowserRouter>
            </JobsProvider>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;