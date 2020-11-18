import { authService, storageService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj,refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [profilePic, setProfilePic] = useState(userObj.photoURL);
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut()  
        history.push("/")
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0]
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setProfilePic(result)
            console.log(result)
        }
        reader.readAsDataURL(theFile)
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        let profileURL = "";    
        if (
            userObj.displayName !== newDisplayName ||
            userObj.photoURL !== profilePic
          ) {
            try {
              if (userObj.photoURL !== profilePic) {
                const photoURLRef = storageService
                  .ref()
                  .child(`profile/${userObj.uid}`);
                const response = await photoURLRef.putString(profilePic, 'data_url');
                profileURL = await response.ref.getDownloadURL();
      
                await userObj.updateProfile({
                  displayName: newDisplayName,
                  photoURL: profileURL,
                });
              }
      
              await userObj.updateProfile({
                displayName: newDisplayName,
              });
            } catch (error) {
              console.error(error.message);
            }
          }
          refreshUser();
    }
    
    return (
        <>
        <div>
            <h4>{userObj.displayName}</h4>
            <img src={userObj.photoURL} width="60px" height="60px"alt="" ></img>
        </div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange}
                    type="text" placeholder="New Profile Name" 
                    value={newDisplayName}/>
                <input type="file" accept="/image*" onChange={onFileChange} />
                {profilePic && <img src={profilePic} width="50px" height="50px" alt=""/>}
                <input type="submit" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>)
};

export default Profile;