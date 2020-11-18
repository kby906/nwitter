import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => { 

    const [nweet, setNweet] = useState("")
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    // useEffect()안에 바로 쓰는 게 아니라 따로 빼줘서 왜냐 async 해줘야하기 때문
    // const getNweets = async () => {
    //     const dbNweets = await dbService.collection("nweets").get()
    //     dbNweets.forEach(document => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //         setNweets(prev => [nweetObject, ...prev])
    //     })
    // } => 이건 onSnapshot 에 비해 old way.

    useEffect(() => {
        //onsnapshot => listener method. db changes realtime notice.
        //read delete update anything 
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            setNweets(nweetArray)
        })
    }, [])
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
        <div>
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
            <div>
                {nweets.map((nweet) =>
                    (<Nweet key={nweet.id} nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid} />)
                )}
            </div>
        </div>

    )
}
export default Home;