import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("")
    const [attachment, setAttachment] = useState("")
    const onSubmit = async (event) => {
        event.preventDefault()
        let attachmentURL = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url")
            attachmentURL = await response.ref.getDownloadURL()
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentURL,
        }
        await dbService.collection("nweets").add(nweetObj)
        setNweet("")
        setAttachment("");
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value)
    }
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0] // file 한개이니까 
        //file reader API 사용해서 이 파일을 읽자
        //onloadend event handler it occurs everytime reading finishes. 
        //finishedEvent target -> result file => URL converted result. 
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }
    const onClearAttachmentClick = () => setAttachment("");
    return (
        <form onSubmit={onSubmit}>
            <input
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" />
            {attachment &&
                <div><img src={attachment} width="50px" height="50px" alt="" />
                    <button onClick={onClearAttachmentClick}>Clear Picture</button></div>}
        </form>
    )
}

export default NweetFactory;