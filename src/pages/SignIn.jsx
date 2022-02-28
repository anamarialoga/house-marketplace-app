import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { OAuth } from "../components/OAuth";


export const SignIn = () => {
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
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
    // console.log(showPass);
    // console.log(formData);

    const onSubmit = async (e) =>{
        e.preventDefault();
        try{
            const auth = getAuth();
            const userCredential  = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            if(userCredential.user){
                navigate('/');
            }

            console.log(userCredential.user.displayName, " authenticated");

        }catch(error){
            toast.error('Bad user credentials!');
        }
    }

    return (
        <>
        <div className="page-container">
            <header>
                <p className="pageHeader">
                    Welcome back! 
                </p>
            </header>
            <form>
                <div  className="emailInputDiv">
                <input  type={'email'} id='email' value={formData.email} className='emailInput' placeholder="E-mail" onChange={handleObjState}/>
                </div>
                <div className="passwordInputDiv">
                    <input type={'password'} id='password' value={formData.password} className='passwordInput' placeholder="Password" onChange={handleObjState}/>
                    <img src = {visibilityIcon} alt="visibility" className="showPassword" onClick={()=>setShowPass(!showPass)}/>
                </div>
                <Link to='/forgotpass' className="forgotPasswordLink">Forgot Password</Link>
                <div style={{display: 'block'}}>
                    <div className="signInBar">
                        <p className="signInText">Sign In</p>
                        <button onClick={onSubmit} className="signInButton">
                            <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                        </button>      
                    </div>
                    <OAuth/>
                </div>   
            </form> 
            <div style={{marginLeft: '0.5cm'}}>
                <Link to='/signup' style={{color:  '#00cc66', fontSize: '16px'}}>
                    Not having an account yet? Sign up
                </Link>
            </div>
        </div>
        </>
    )
}