import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

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

    return (
        <>
        <div className="page-container">
            <header>
                <p className="pageHeader">
                    Welcome back! 
                </p>
            </header>
            <form>
                <div  style={{marginRight: '0.5cm', marginLeft: '0.5cm'}}>
                <input  type={'email'} id='email' value={formData.email} className='emailInput' placeholder="E-mail" onChange={handleObjState}/>
                </div>
                <div className="passwordInputDiv" style={{marginRight: '0.5cm', marginLeft:'0.5cm'}}>
                    <input type={'password'} id='password' value={formData.password} className='passwordInput' placeholder="Password" onChange={handleObjState}/>
                    <img src = {visibilityIcon} alt="visibility" className="showPassword" onClick={()=>setShowPass(!showPass)}/>
                </div>
                <Link to='/forgotPassword' className="forgotPasswordLink">Forgot Password</Link>
                <div className="signInBar">
                    <p className="signInText" style={{fontSize: '23px', fontWeight: '650'}}>Sign In</p>
                    <button className="signInButton">
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                    </button>
                </div>          
            </form>
            <div style={{marginLeft: '0.5cm'}}>
                <Link to='/SignUp' style={{color:  '#00cc66', fontSize: '16px'}}>
                    Not having an account yet? Sign up
                </Link>
            </div>
        </div>
        </>
    )
}