import { authService, storageService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
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
        }
        reader.readAsDataURL(theFile)
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        let profileURL = "";
        if (userObj.displayName !== newDisplayName
            || userObj.photoURL !== profilePic) {
            if (
                userObj.displayName !== newDisplayName) {
                await userObj.updateProfile({
                    displayName: newDisplayName,
                });
            }
            if (userObj.photoURL !== profilePic) {
                const photoURLRef = storageService
                    .ref()
                    .child(`profile/${userObj.uid}`);
                const response = await photoURLRef.putString(profilePic, 'data_url');
                profileURL = await response.ref.getDownloadURL();
                await userObj.updateProfile({
                    photoURL: profileURL,
                });
            }
            refreshUser();
            // setProfilePic(userObj.photoURL);
            // setNewDisplayName(userObj.displayName);
        }
    }

    return (
        <>
            <div className="profilebox">
                <h3>USER NAME</h3>
                <h4>{userObj.displayName}</h4>
                <h3>PROFILE PICTURE</h3>
                <img src={userObj.photoURL} width="60px" height="60px" alt="" ></img>
            </div>
            <div className="container">
            <form className="profileform" id="profileform" sonSubmit={onSubmit} >
            {profilePic && <img src={profilePic} width="50px" height="50px" alt="" />}
                <input id="profilename" onChange={onChange}
                    type="text" placeholder="New Profile Name"
                    value={newDisplayName} />
                <input id="profilepicture" type="file" accept="/image*" onChange={onFileChange} />
                <input id="profilesubmit" type="submit" />
            </form>
            <button id="logout" onClick={onLogOutClick}>Log Out</button>
            </div>
        </>)
};

export default Profile;