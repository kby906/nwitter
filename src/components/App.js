import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  // authService.currentUser -> currentUser : user? null => user state 알려줌
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile: (args) =>
            user.updateProfile(args),
        })
      } else{
        setIsLoggedIn(false);
      }
      setInit(true)
    })
  }, [])
  const refreshUser = () =>{
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile: (args) =>
        user.updateProfile(args),
    })
    // setUserObj(Object.assign({}, user));
  }
  return (
    <>
    {init? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser}/> : "Initiazliaing"}    
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
