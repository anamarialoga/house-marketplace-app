import React, { useState } from "react"
import { SignIn } from "./SignIn"
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

export const Profile = () => {
    const auth= getAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: auth.currentUser ? auth.currentUser.displayName : '',
        email:auth.currentUser ? auth.currentUser.email : '',
    });
    const [changeDetails, setChangeDetails] = useState(false);
    const {name, email} = formData;

    const onLogOut = ()=> {
        auth.signOut();
        console.log(name, " logged out");
        navigate('/signin');
    }

    const onSubmit = async () => {
        try{
            if(auth.currentUser.displayName !== name)
            //update the displayName in firebase;
            await updateProfile(auth.currentUser, {
                displayName: name
            });
            //update in firestore;
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                name
            }) 
        }catch(error){
            toast.error("Could not update Profile Details");
        }
    }

    return (formData.name !== '') ? ( 
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                    <button onClick={onLogOut} className="logOut">
                        Log Out
                    </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p>Personal Details</p>
                    <p 
                    className="changePersonalDetails" 
                    onClick={()=>{
                        setChangeDetails(!changeDetails);
                        onSubmit();
                    }}>
                        {changeDetails? 'done': 'change'}
                    </p>
                </div>
                <br/>
                <div className="editPersonalDetails">
                    <p className="detail">Name</p>
                    <form className="profileCard">
                        <input type="text" id="name" 
                        className={!changeDetails ? 'profileName profileNameInactive' : 'profileName' } 
                        disabled={!changeDetails ? true : false} 
                        value={name}
                        onChange={(e)=>setFormData({
                            ...formData, 
                            [e.target.id]: e.target.value
                        })}
                        />
                    </form>
                </div>
                    <br/>
                <div className="editPersonalDetails">
                    <p className="detail">E-mail</p>
                    <form className="profileCard" >
                        <input type="text" id="email" 
                            className= 'profileEmail profileEmailInactive' 
                            disabled={!changeDetails ? true : false} 
                            value={email}
                            onChange={(e)=>setFormData({
                                ...formData, 
                                [e.target.id]: e.target.value
                            })}
                            />
                    </form>
                </div>
            </main>
        </div>
    ):
    <SignIn />
};