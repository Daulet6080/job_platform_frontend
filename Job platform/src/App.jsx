import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import JobListPage from './pages/JobListPage';
import './App.css';
import { useEffect, useState } from 'react';
import Register from './pages/Register';
import JobDetailPage from './pages/JobDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ApplyPage from './pages/ApplyPage';
import { JobsProvider } from './context/JobsContext'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      setLoggedIn(false);
      return;
    }
    if (new Date(user.expiresAt) < new Date()) {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="App">
      {}
      <JobsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
            <Route path='/signup' element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
            <Route path="/jobs" element={<JobListPage />} /> 
            <Route path="/jobs/:id" element={<JobDetailPage />} /> 
            <Route path="/favorites" element={<FavoritesPage />} /> 
            <Route path="/apply" element={<ApplyPage />} /> 
          </Routes>
        </BrowserRouter>
      </JobsProvider>
    </div>
  );
}

export default App;