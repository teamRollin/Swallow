import {dbService, storageService} from "fbase";
import { v4 as uuidv4} from "uuid";
import React, {useEffect, useState} from "react";
import Swallow from "components/Swallow";

const Home = ({userObj}) => {
    const [swallow, setSwallow] = useState("");
    const [swallows, setSwallows] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        dbService
            .collection("swallows")
            .onSnapshot(snapshot => {
                const swallowArray = snapshot
                    .docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setSwallows(swallowArray);
            });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
       
        const swallowObj ={
            text: swallow, createdAt: Date.now(), creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService
            .collection("swallows")
            .add(swallowObj);
        setSwallow("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target: {
                value
            }} = event;
        setSwallow(value);
    };
    const onFileChange = (event) => {
        const {target : {files}, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishiedEvent) => {
            const {
                currentTarget: {result},
            } = finishiedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment("")

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={swallow}
                    onChange={onChange}
                    placeholder="What's on your mind?"
                    maxLength={120}/>

                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Swallow"/>
                {attachment && 
                <div>
                    <img src={attachment} width="50px" height="50px" alt="upload_image"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                }
            </form>
            <div>
                {
                    swallows.map((swallow) => (
                        <Swallow key={swallow.id} swallowObj={swallow} isOwner={swallow.creatorId === userObj.uid}/>
                    ))
                }
            </div>
        </div>
    );

};

export default Home;