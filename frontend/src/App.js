import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Home from './pages/Home';
import History from './pages/History';
import Tutorial from './pages/Tutorial';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-layout">
          <aside className="sidebar">
            <h2>📚 StudySnap</h2>
            <nav>
              <Link to="/">🏠 Home</Link>
              <Link to="/history">📁 History</Link>
              <Link to="/tutorial">📘 Tutorial</Link>
            </nav>
            <ThemeContext.Consumer>
              {({ theme, toggleTheme }) => (
                <button onClick={toggleTheme} style={{ marginTop: '2rem' }}>
                  {theme === 'dark' ? '🌞 Light Mode' : '🌚 Dark Mode'}
                </button>
              )}
            </ThemeContext.Consumer>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
