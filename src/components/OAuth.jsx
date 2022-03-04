import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import { toast } from "react-toastify";
import googleIcon from '../assets/svg/googleIcon.svg'
import { useLocation, useNavigate } from "react-router-dom";

export const OAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
 
    const onGoogleClickUp = async (e)=>{
        e.preventDefault();
        try{
            const auth = getAuth().onAuthStateChanged();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            //verify if the user already exists in DB
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            //if the user doesn't exist, create the user
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }else {
                toast.error('User already exists!');
            }
            toast.success('Registered with success!')
            navigate('/');
        } catch(error){
            toast.error('Could not authorize with Google!');
        }
    };

    const onGoogleClickIn = async (e)=>{
        e.preventDefault();
        try{
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            //verify if the user already exists in DB
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            //if the user doesn't exist, create the user
            if(docSnap.exists()){
                navigate('/');
            }else {
                toast.error('User is not registered!');
            }
        } catch(error){
            toast.error('Could not authorize with Google!');
        }
    };


    return (
        <div className="signInAuthBar">
            <p className="signInAuthText">Sign {location.pathname==='/signup' ? 'Up':'In'} with Google</p>
            <button className="signInAuthButton" onClick={location.pathname==='/signup'? onGoogleClickUp : onGoogleClickIn}>
                <img className="socialIconImg" src={googleIcon} alt='google'/>
            </button>
        </div>);
}