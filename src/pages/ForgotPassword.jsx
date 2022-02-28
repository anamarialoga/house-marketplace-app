import React, { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { Link } from "react-router-dom"

export const ForgotPassword  = () => {
    const [email, setEmail] = useState('');
    const onChange = (e) =>{
        setEmail(e.target.value);
        console.log(email);
    }


    const onSubmit = async (e) =>{
        e.preventDefault();
        try{
            const auth = getAuth();
            await sendPasswordResetEmail (auth, email);
            toast.success ('A reset password link was sent via E-mail!');
        } catch (error) {
            toast.error('Could not send the reset passwork link!');
        }
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader" style={{marginLeft: '0cm'}}>Forgot Password</p>
            </header>
            <main>
                <form>
                <div  style={{marginRight: '0.09cm', marginLeft: '0.09cm'}}>
                <input  type={'email'} id='email' value={email} className='emailInput' placeholder="E-mail" onChange={onChange}/>
                </div>
                    <div className="resetPassBar" >
                        <p className="resetPassText" >
                            Send Reset Link
                        </p>
                        <button onClick={onSubmit} className="resetPassButton">
                        <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                    </button>
                    </div>
                </form>
                <div >
                    <Link to='/signin' style={{color:  '#00cc66', fontSize: '16px'}}>
                        Did you reset? Sign in
                    </Link>
                </div>
            </main>
        </div>
    )
}