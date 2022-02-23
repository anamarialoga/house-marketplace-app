import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

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

    return (
        <>
        <div className="page-container">
            <header>
                <p className="pageHeader">
                    Welcome! 
                </p>
            </header>
            <form>
                <div  style={{marginRight: '0.5cm', marginLeft: '0.5cm'}}>
                <input  type={'text'} id='name' value={formData.name} className='nameInput' placeholder="Name" onChange={handleObjState}/>
                <input  type={'email'} id='email' value={formData.email} className='emailInput' placeholder="E-mail" onChange={handleObjState}/>
                </div>
                <div className="passwordInputDiv" style={{marginRight: '0.5cm', marginLeft:'0.5cm'}}>
                    <input type={'password'} id='password' value={formData.password} className='passwordInput' placeholder="Password" onChange={handleObjState}/>
                    <img src = {visibilityIcon} alt="visibility" className="showPassword" onClick={()=>setShowPass(!showPass)}/>
                </div>
                <div className="signUpBar">
                    <p className="signUpText" style={{fontSize: '23px', fontWeight: '650'}}>Sign Up</p>
                    <button className="signUpButton">
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                    </button>
                </div>          
            </form>
            <div style={{marginLeft: '0.5cm'}}>
                <Link to='/SignIn' style={{color:  '#00cc66', fontSize: '16px'}}>
                    Already having an account? Sign in
                </Link>
            </div>
        </div>
        </>
    )
}