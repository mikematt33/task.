import React, { useState } from "react";

const SignUp = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [emailError, setError] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [empty, setEmpty] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setEmpty('');
        setError('');
        setErrorPassword('');
        setShowError(false);

        if (!email || !password || !password2) {
            setTimeout(() => {
                setEmpty('Invalid email or password')
                setShowError(true);
            }, 200);
            return; 
        }

        if (password !== password2) {
            setTimeout(() => {
                setErrorPassword("Passwords do not match")
                setShowError(true);
                }, 200);
            return;
        }

        try {
            const response = await fetch('http://localhost:3006/api/v1/auth/registerUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 400) {
                    setError('');
                    setShowError(false);
                    setTimeout(() => { 
                        setError(data.error)
                        setShowError(true);
                    }, 200);
                } else if (response.status === 500) {
                    console.error(data.error);
                }
                throw new Error(data.error);
            } else {
                const data = await response.json();

                localStorage.setItem('token', data.token);

                props.onLogin();
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

    return (
        <div className="container" style={{ 
            backgroundImage: 'url("/images/backgroundsignin.png")'
        }}>
            <div className="gray-square">
                <div className="row g-0 justify-content-center align-items-center">
                    <div className="col-md-6">
                        <div className="col-md-6" style={{ marginLeft: '30%',  color: 'white'}}>
                            <form className="sign-up-form" onSubmit={handleSubmit}>
                                <h4 className="sign-up mb-3">Sign Up</h4>
                                <input type="email" className="form-control custom-form" id="email" placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" className="form-control custom-form" id="password" placeholder="*****" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <input type="password" className="form-control custom-form" id="Re-enter Password" placeholder="*****" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                                {showError && (emailError ? <div className="emailError">{emailError}</div> : (errorPassword ? <div className="passError">{errorPassword}</div> : (empty && <div className="empty">{empty}</div>)))}
                                <button type="submit" className="signUp-btn">Enter</button>
                                <p className="sign-up-text" onClick={() => props.onFormSwitch('signIn')}>Already have an account? <span className="sign-up-link">Sign in here</span></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;



