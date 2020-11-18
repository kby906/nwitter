import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const toggleAccount = () => {
        setNewAccount((previous_value) => !previous_value)
    }
    const onSocialClick = async (event) => {
        const {target: {name} } = event;
        let provider;
        if (name === 'google') {
            provider = new firebaseInstance.auth.GoogleAuthProvider()
        } else if (name === 'github') {
            provider = new firebaseInstance.auth.GithubAuthProvider()
        }
        const data = await authService.signInWithPopup(provider)
        console.log(data)
    }
    return (
        <div>
            <AuthForm />
            {error}
            <span onClick={toggleAccount}>{newAccount ? "Log in" : "Create Account"}</span>
            <div>
                <button onClick = {onSocialClick} name="google">Continue with Google</button>
                <button onClick = {onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    );
}
export default Auth;