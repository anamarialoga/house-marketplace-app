import { useEffect, useRef, useState } from "react"
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export const CreateListing  = () => {
    const [geolocation, setGeolocation] = useState(true);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        type: 'sell',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address:'',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0, 
    });

    //destructure listing
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude, 
    } = formData;

    const auth= getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    console.log(auth.currentUser.displayName);
    useEffect(()=>{
        //if the user is authenticated
        if(isMounted){
            onAuthStateChanged(auth, (user)=>{
                //add a new field 'userRef' into the listing, containing the user ID;
                if(user){
                    setFormData({...formData, userRef: user.uid});
                }
                //else, send to authentication
                else{
                    navigate('/signin');
                }
            })
        }
        setLoading(false);
        return () => {
            isMounted.current = false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const onMutate = (e) => {
        let boolean = null;
        if(e.target.value === 'true')
        {    boolean=true;  }
        if(e.target.value === 'false')
        {    boolean=false;  }

        if(e.target.files ){
            setFormData((prevState) =>({...prevState, images: e.target.files}));
        }
        if(!e.target.files){
            setFormData((prevState)=> ({...prevState, [e.target.id]: boolean ?? e.target.value}))
        }
    }

    return (loading) ? (<Spinner/>) : ( 
        <div className="profile">
            <header>
                <p className="profileHeader">{auth.currentUser.displayName}, add a listing </p>
            </header>
            <main>
                <form>
                    <label className="formLabel">Sell / Rent</label>
                    <div className="formButtons">
                        <button 
                        type="button" 
                        className={type === 'sell' ? 'formButtonActive': 'formButton'}
                        id='type'
                        value='sell'
                        onClick={onMutate}
                        >
                            Sell
                        </button>
                        <button 
                        type="button" 
                        className={type === 'rent' ? 'formButtonActive': 'formButton'}
                        id='type'
                        value='rent'
                        onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className="formLabel">
                        Name
                        <input
                        className="formInputName"
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                        />
                    </label>

                    <div className='formRooms flex'>
                        <div>
                        <label className='formLabel'>Bedrooms</label>
                        <input
                            className='formInputSmall adjust'
                            type='number'
                            id='bedrooms'
                            value={bedrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                        </div>
                        <div>
                        <label className='formLabel'>Bathrooms</label>
                        <input
                            className='formInputSmall adjust'
                            type='number'
                            id='bathrooms'
                            value={bathrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                        </div>
                    </div>

                    <label className='formLabel'>Parking spot</label>
                    <div className='formButtons'>
                        <button
                        className={parking ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onMutate}
                        min='1'
                        max='50'
                        >
                        Yes
                        </button>
                        <button
                        className={
                            !parking && parking !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='parking'
                        value={false}
                        onClick={onMutate}
                        >
                        No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        <button
                        className={furnished ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onMutate}
                        >
                        Yes
                        </button>
                        <button
                        className={
                            !furnished && furnished !== null
                            ? 'formButtonActive'
                            : 'formButton'
                        }
                        type='button'
                        id='furnished'
                        value={false}
                        onClick={onMutate}
                        >
                        No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress adjust'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    {!geolocation && (
                        <div className='formLatLng flex'>
                        <div>
                            <label className='formLabel'>Latitude</label>
                            <input
                            className='formInputSmall adjust'
                            type='number'
                            id='latitude'
                            value={latitude}
                            onChange={onMutate}
                            required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Longitude</label>
                            <input
                            className='formInputSmall adjust'
                            type='number'
                            id='longitude'
                            value={longitude}
                            onChange={onMutate}
                            required
                            />
                        </div>
                        </div>
                    )}

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                        className={offer ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                        >
                        Yes
                        </button>
                        <button
                        className={
                            !offer && offer !== null ? 'formButtonActive' : 'formButton'
                        }
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                        >
                        No
                        </button>
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv adjust'>
                        <input
                        className='formInputSmall'
                        type='number'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                        <label className='formLabel'>Discounted Price</label>
                        <input
                            className='formInputSmall adjust'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo adjust'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile adjust'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button 
                    type='submit' 
                    className='primaryButton createListingButton' 
                    onClick={onSubmit}>
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    )
}