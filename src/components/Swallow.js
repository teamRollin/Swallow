import {dbService, storageService} from "fbase";
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Swallow = ({ swallowObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSwallow, setNewSwallow] = useState(swallowObj.text);
    const onDeleteClick = async () => {
      const ok = window.confirm("Are you sure you want to delete this swallow?");
      if (ok) {
        await dbService.doc(`swallows/${swallowObj.id}`).delete();
        await storageService.refFromURL(swallowObj.attachmentUrl).delete();
      }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
      event.preventDefault();
      await dbService.doc(`swallows/${swallowObj.id}`).update({
        text: newSwallow,
      });
      setEditing(false);
    };
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNewSwallow(value);
    };
    return (
        <div className="swallow">
            {
                editing
                    ? (<>
                     {isOwner && (<>
                     < form onSubmit = {
                        onSubmit
                    }className="container swallowEdit" >
											<h4 className="username" >{swallowObj.creatorName}</h4>
										<input type = "text" placeholder = "Edit your swallow" value = {
                        newSwallow
                    }
                    required autoFocus onChange = {
                        onChange
                    } className="formInput" /> <input type ="submit" value="Update Swallow" className="formBtn"/> </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span> </>)}
                </>): <>
                    <h4 className="username"> {swallowObj.creatorName}'s swallows</h4>     
										<h4> {
                        swallowObj.text
                    }
                    </h4> 
                    {swallowObj.attachmentUrl && 
                    <img src={swallowObj.attachmentUrl} alt="upload"/>}
                    
                    {
                        isOwner && (<div className="swallow__actions"> < span onClick = {
                            onDeleteClick
                        } ><FontAwesomeIcon icon={faTrash} /></span> <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </span>
                    </div>
                )}</>}
        </div>
    );
  };
  
  export default Swallow;