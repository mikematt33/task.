import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import List from './List';
import CalendarLoad from './calendar/calendarLoading';

function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/list" element={<List />} />
            <Route path="/calendar" element={<CalendarLoad />} />
          </Routes>
        </Router>
      );
  }

export default App;