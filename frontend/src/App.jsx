// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddAccountPage from './components/AddAccountPage';
import DataPage from './components/DataPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AddAccountPage />} />
                <Route path="/data" element={<DataPage />} />
            </Routes>
        </Router>
    );
}

export default App;
