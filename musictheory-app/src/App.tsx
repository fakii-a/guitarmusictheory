import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { routes } from './routes';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <header className="main-header">
      <div className="button-group">
        {routes.map((route) => (
          <Link 
            key={route.path}
            to={route.path}
            className={`nav-button ${location.pathname === route.path ? 'active' : ''}`}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <main className="app-main">
          <Routes>
            {routes.map((route) => (
              <Route 
                key={route.path}
                path={route.path} 
                element={<route.component />} 
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;