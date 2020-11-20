import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === 'email') {
            setEmail(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //create account
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                )
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(
                    email, password
                )
            }
        } catch (error) {
            setError(error.message)
        }

    };
    const toggleAccount = () => {
        setNewAccount((previous_value) => !previous_value)
    }
    return (
        <>
            <div className="authHeader"><h2>NWITTER</h2></div>
            <form onSubmit={onSubmit} className="container">
                <input name="email"
                    type="email" 
                    placeholder='Email' 
                    required value={email}
                    onChange={onChange} 
                    />
                <input 
                name="password" 
                type="password" 
                placeholder='Password'
                    required 
                value={password} 
                onChange={onChange} />
                <input 
                id="login"
                type="submit" 
                value={newAccount ? "Create Account" : "Log In"} />
                {error && <span>{error}</span>}
            </form>            
            <span id="togglelogin" onClick={toggleAccount}>{newAccount ? "Log in" : "Create Account"}</span>

        </>
    )
}

export default AuthForm;