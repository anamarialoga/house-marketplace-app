import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from '../firebase.config.js';
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { OAuth } from "../components/OAuth";

export const SignUp = () => {
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    });
    const navigate = useNavigate();

    const handleObjState = (e) => {
        setFormData((prevState)=> ({
             ...prevState, //preserves object state, avoids warnings and errors
            [e.target.id]: e.target.value,
            //use the id from the inputs so we can change the value based on that; email/password
        }))
    }

    //Performs POST - posts a new user in the firebase authentication
    const onSubmit = async (e) =>{
        e.preventDefault();
        try{
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password );
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: formData.name
            })

            //ADD THE NEW USER TO FIRESTORE
            //Create a copy of the formData obj, to avoid modifying the state;
            const formDataCopy = {...formData};
            //Avoid posting the password to the db - remove it from the obj;
            delete formDataCopy.password;
            //Add a timestamp property to the obj;
            formDataCopy.timestamp = serverTimestamp();
            //UPDATE the database - setDoc returns a promise; 
            //1st param: our imported db, name of the collection we want to add to, and the new UID of the new user;
            //2nd param: email, name of the new user; 
            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            console.log(userCredential.user.displayName, " registered");
            toast.success("Registered with success!")
            navigate('/');
        }catch(error){
            toast.error('Something went wrong!');
        }
    }

    return (
        <>
        <div className="page-container">
            <header>
                <p className="pageHeader">
                    Welcome! 
                </p>
            </header>
            <form >
                <div  className="emailInputDiv">
                <input  type={'text'} id='name' value={formData.name} className='nameInput' placeholder="Name" onChange={handleObjState}/>
                <input  type={'email'} id='email' value={formData.email} className='emailInput' placeholder="E-mail" onChange={handleObjState}/>
                </div>
                <div className="passwordInputDiv">
                    <input type={'password'} id='password' value={formData.password} className='passwordInput' placeholder="Password" onChange={handleObjState}/>
                    <img src = {visibilityIcon} alt="visibility" className="showPassword" onClick={()=>setShowPass(!showPass)}/>
                </div>
                <div className="signUpBar">
                    <p className="signUpText">Sign Up</p>
                    <button onClick = {onSubmit} className="signUpButton">
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                    </button>
                </div>
                <OAuth />          
            </form>
            <div style={{marginLeft: '0.5cm'}}>
                <Link to='/signin' style={{color:  '#00cc66', fontSize: '16px'}}>
                    Already having an account? Sign in
                </Link>
            </div>
        </div>
        </>
    )
}