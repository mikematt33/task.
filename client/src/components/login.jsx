import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SignIn from './signIn.jsx';
import SignUp from "./signUp.jsx";

function Login() {
  const [currentForm, setCurrentForm] = useState("signIn");
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/list');
    }
  }, [isLoggedIn, navigate]);

  const toggleForm = (form) => {
    setCurrentForm(form);
  };

  const handleLogin = () => {
    navigate('/list');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div>
          {currentForm === "signIn" ? (
            <SignIn onFormSwitch={toggleForm} onLogin={handleLogin} />
          ) : (
            <SignUp onFormSwitch={toggleForm} onLogin={handleLogin} />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Login;
