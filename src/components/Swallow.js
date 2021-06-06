import {dbService, storageService} from "fbase";
import React, {useState} from "react";

const Swallow = ({swallowObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newSwallow, setNewSwallow] = useState(swallowObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this swallow?");
        if (ok) {
            await dbService
                .doc(`swallows/${swallowObj.id}`)
                .delete();
            await storageService.refFromURL(swallowObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(swallowObj, newSwallow);
        await dbService.doc(`swallows/${swallowObj.id}`).update({
            text:newSwallow,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {target: {
                value
            }} = event;
        setNewSwallow(value);
    };
    return (
        <div>
            {
                editing
                    ? (<>
                     {isOwner && (<>
                     < form onSubmit = {
                        onSubmit
                    } > <input type = "text" placeholder = "Edit your s wallow" value = {
                        newSwallow
                    }
                    required onChange = {
                        onChange
                    } /> <input type ="submit" value="Update Swallow"/> </form>
                <button onClick={toggleEditing}>Cancel</button> </>)}
                </>): <><h4> {
                        swallowObj.text
                    }
                    </h4 > 
                    {swallowObj.attachmentUrl && (
                    <img src={swallowObj.attachmentUrl} width="50px" height="50px" alt="upload"/>)}
                    
                    {
                        isOwner && (<> < button onClick = {
                            onDeleteClick
                        } > Delete Swallow</button> < button onClick = {
                            toggleEditing
                        } > Edit Swallow</button> </>
                )}</>}
        </div>
    );
}

export default Swallow;