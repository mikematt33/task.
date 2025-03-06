import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const SignIn = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setError('');
    
        try {
            const response = await fetch('http://localhost:3006/api/v1/auth/loginCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 400) {
                    setTimeout(() => setError(data.error), 200);
                } else if (response.status === 500) {
                    console.error(data.error);
                }
                throw new Error(data.error);
            }
    
            const data = await response.json();

            localStorage.setItem('token', data.token);

            navigate('/list');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };    

    return (
        <div className="container" style={{ 
            backgroundImage: 'url("/images/backgroundsignin.png")'
        }}>
            <div className="gray-square">
                <div className="row g-0 justify-content-center align-items-center">
                    <div className="col-md-6">
                        <div className="col-md-6" style={{ marginLeft: '30%', color: 'white'}}>
                            <form className="sign-in-form" onSubmit={handleSubmit}>
                                <h4 className="sign-in mb-3">Sign In</h4>
                                <input type="email" className="form-control custom-form" id="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" className="form-control custom-form" id="password" placeholder="*****" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit" className="login-btn">Sign In</button>
                                <p className="sign-up-text" onClick={() => props.onFormSwitch('singUp')}>Don't have an account? <span className="sign-up-link">Sign up here</span></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
