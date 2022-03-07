import {doc, getDoc} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {db} from '../firebase.config'

export const ContactLandlord= () =>{
    const [message, setMessage] = useState('');
    const [landlord, setLandlord] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const params = useParams();

    useEffect(()=>{
    const getLandlord = async () =>{
        const docRef = doc(db, 'users', params.landlordId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setLandlord(docSnap.data())
        }else{
            toast.error('Could not get landlord data');
        }
    }
    getLandlord();
    },[params.landlordId])

    const onChange = (e)=>{
        setMessage(e.target.value);
    }
    //console.log(message);

    console.log(landlord?.email);
    return (
    <div>
        <header style={{  fontSize: '26px',fontWeight: '800',marginTop: '1cm',marginBottom: '2.5rem',padding: '1rem'}}>
            Contact Landlord
        </header>
        {landlord !== null && (
            <main>
                <div className="contactLandlord">
                    <p className="landlordName">
                        Leave a message for {landlord.name}
                    </p>
                </div>
                <form className='messageForm'>
                    <div className="messageDiv">
                        <label htmlFor="message" className="messageLabel"></label>
                        <textarea name='message' id='message' className='textarea' value={message} onChange={onChange}></textarea>
                    </div>
                    <div className='sendMessage'>
                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`} style={{color:'white'}}> 
                            Send
                        </a>
                    </div>
                </form>
            </main>
        )}
    </div>)
}