import { useEffect, useRef, useState } from "react"
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {v4 as uuidv4} from 'uuid'
import {serverTimestamp, doc, updateDoc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'

const API_URL="AIzaSyCU8A9UY3mqht9a8h9ZAPpvnWoSrvtoZzw"

export const EditListing = () => {
    const [geolocationActive, setGeolocationActive] = useState(true);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [listing, setlisting] = useState(true);
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
        images: [],
        latitude: 0,
        longitude: 0, 
        geoloc: true, 
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
        geoloc
    } = formData;

    const auth= getAuth();
    const params = useParams();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    console.log("User:", auth.currentUser?.displayName);

    //fetch listing to edit
    useEffect(()=>{
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId );
            const docSnap = await getDoc(docRef);

            if(docSnap.exists())
            {
                setlisting(docSnap.data());
                setFormData({...docSnap.data(), address: docSnap.data().location});
                setLoading(false);
            }else{
                navigate('/')
                toast.error('Listing does not exist');
            }
        }
        fetchListing();
    },[params.listingId, navigate])


    //sets the user to logged in
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

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          // ACCESS STORAGE
          const storage = getStorage()
          // WHAT DO WE STORE?
          const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
          // WHERE DO WE STORE?
          const storageRef = ref(storage, 'images/' + fileName)
          const uploadTask = uploadBytesResumable(storageRef, image)
  
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused')
                  break
                case 'running':
                  console.log('Upload is running')
                  break
                default:
                  break
              }
            },
            (error) => {
              reject(error)
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL)
              })
            }
          )
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        //console.log(formData);
        if(offer && (discountedPrice>=regularPrice)){
            setLoading(false);
            toast.error("The regular price must be higher than the discounted price!");
        }else if(images?.length>6 || images?.length<1){
            setLoading(false);
            toast.error("You must upload at least 1 image, but not more than 6!");
        }else if(name === ''){
            setLoading(false);
            toast.error('You must enter a name for your listing!');
        }

        let geolocation={};
        let location;

        if(geolocationActive === true){
            const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_URL}`)
            const data = await resp.json();
            console.log(data);
            geolocation.lat=data.results[0]?.geometry.location.lat ?? 0;
            geolocation.long=data.results[0]?.geometry.location.lng ?? 0;

            if (data.status === 'ZERO_RESULTS'){
                location='';
            } else {
                location=address;
            }
            if(location===''){
                setLoading(false);
                toast.error('Please enter a valid address!');
            }
        }
        else{
            geolocation.lat=latitude;
            geolocation.long= longitude;
            location = address; 
        }


        const imgUrls = await Promise.all(
            [...images]?.map((image) => storeImage(image))
          ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
          })
        //console.log(imgUrls);

        // A COPY OF THE FORMDATA WILL BE STORED AS A LISTING
        const listingCopy = {
            ...formData,
            //ADDING ImgUrls , timestamp PARAMS TO THE OBJ
            imgUrls, 
            timestamp: serverTimestamp()
        }
        //console.log(location);

        //REMOVE UNWANTED PARAMS FROM THE OBJ WE UPLOAD
        delete listingCopy.images
        delete listingCopy.address
        listingCopy.latitude= geolocation.lat
        listingCopy.longitude=geolocation.long
        !listingCopy.offer && delete listingCopy.discountedPrice
        //ADD A HUMAN-FRIENDLY LOCATION STRING TO THE OBJ
        location && (listingCopy.location=location)

        //ADD THE NEW OBJ TO THE COLLECTION
        const docRef = doc(db, 'listings', params.listingId);
        await updateDoc(docRef, listingCopy)
        //console.log('docRef:', docRef)
        setLoading(false);
        toast.success("Your listing has been updated!")

        console.log("user:", auth.currentUser?.displayName);
        navigate(`/category/${listingCopy.type}/${docRef.id}`);
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

    const onSetLocationServices = (e) => {
        //console.log(typeof e.target.value, e.target.value);
        let bool=null;
        if(e.target.value === 'true'){
            bool=true;
        }
        if(e.target.value === 'false'){
            bool=false;
        }
        setFormData((prevState)=>({...prevState, [e.target.id]: bool ?? e.target.value }))
        if(bool === false){
            setGeolocationActive(false);
        }else if (bool === true){
            setGeolocationActive(true);
        }
    }

    return (loading) ? (<Spinner/>) : ( 
        <div className="profile">
            <header>
                <p className="profileHeader">{auth.currentUser.displayName}, edit a listing </p>
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

                    <label className='formLabel'>Turn on location services</label>
                    <div className='formButtons'>
                        <button
                        className={geoloc ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='geoloc'
                        value={true}
                        onClick={onSetLocationServices}
                        >
                        Accept
                        </button>
                        <button
                        className={!geoloc ? 'formButtonActive' : 'formButton'}
                        type='button'
                        id='geoloc'
                        value={false}
                        onClick={onSetLocationServices}
                        >
                        Decline
                        </button>
                    </div>

                    {!geolocationActive && (
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
                        Update Listing
                    </button>
                    <button 
                    type='cancel' 
                    className='primaryButton createListingCancelButton' 
                    onClick={()=>{navigate('/profile'); }}>
                        Cancel
                    </button>
                </form>
            </main>
        </div>
    )
}