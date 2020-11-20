import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text)
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure to delete this nweet?")
        if (ok) {
            //delete nweet doc reference
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentURL).delete();
        }
    }
    const toggleEditing = () => setEditing(prev => !prev)
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet)
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        })
        setEditing(false)
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewNweet(value)
    }
    return (
        <div >
            {
                editing ?
                    (<>
                        {isOwner && <><form className="container" onSubmit={onSubmit}>
                            <input onChange={onChange}
                                type="text" placeholder="edit your nweet"
                                value={newNweet} required />
                        <input type="submit" value="Update Nweet"/></form>
                        <button onClick={toggleEditing}>Cancel</button></>}
                    </>)
                    :
                    <div className="nweetField">
                        <h4 id="nweet">{nweetObj.text}</h4>
                        {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} width="50px" height="50px" alt=""/>}
                        {isOwner && (
                            <div className="nweetBtn">
                                <button onClick={toggleEditing}>Edit Nweet</button>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                            </div>)}
                    </div>

            }
        </div>
    );
}
export default Nweet;