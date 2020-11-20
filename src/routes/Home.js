import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);
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

    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div className="nweetlist">
                {nweets.map((nweet) =>
                    (<Nweet key={nweet.id} 
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                        userObj={userObj} />)
                )}
            </div>
        </div>

    )
}
export default Home;