import React, { useEffect, useState } from "react"
import { SignIn } from "./SignIn"
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg'
import { ListingItem } from "../components/ListingItem";

export const Profile = () => {
    const auth= getAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: auth.currentUser ? auth.currentUser?.displayName : '',
        email:auth.currentUser ? auth.currentUser?.email : '',
    });
    const [changeDetails, setChangeDetails] = useState(false);
    const [userListings, setUserListings] = useState();
    const [loading, setLoading]=useState(true);
    const {name, email} = formData;


    useEffect(()=>{
        const fetchUsersListings = async () =>{
                    //access the listings collections from the DB
                    const listingsRef = collection(db, 'listings');
                    //create a query to list the items 
                    const q = query(
                        listingsRef, 
                        where('userRef', '==',  auth?.currentUser?.uid), 
                        orderBy('timestamp', 'desc'), 
                    );
                    //execute the query
                    const querySnap = await getDocs(q);
                    let listings = [];

                    querySnap.forEach((doc)=>{
                        return listings.push({
                            id: doc.id, 
                            data: doc.data()
                        })
                    })
                    setUserListings(listings);
                    setLoading(false);
        }
        fetchUsersListings();
    }, [auth.currentUser?.uid])
    //console.log(userListings);

    const onLogOut = ()=> {
        auth.signOut();
        console.log(name, " logged out");
        navigate('/signin');
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
          await deleteDoc(doc(db, 'listings', listingId))
          const updatedListings = userListings.filter(
            (listing) => listing.id !== listingId
          )
          setUserListings(updatedListings)
          toast.success('Successfully deleted listing')
        }
      }
      const onEdit = (listingId) => navigate(`/editlisting/${listingId}`)

    if(auth?.currentUser?.displayName !== undefined) console.log("user:", auth?.currentUser?.displayName);

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
            <header className="profileBar">
                <p className="exploreHeader" >My Profile</p>
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
                <Link to='/createlisting' className="createListing">
                    <img src={homeIcon} alt='home'/>
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow"/>
                </Link>

                {!loading && userListings?.length > 0 && (
                <>
                    <p className='profileDetailsHeader' style={{marginTop:'1cm'}}>Your Listings</p>
                    <ul className='listingsList'>
                    {userListings.map((listing) => (
                        <ListingItem
                            key={listing.id}
                            item={listing}
                            onDelete={() => {onDelete(listing.id)}}
                            onEdit={() => onEdit(listing.id)}
                        />
                    ))}
                    </ul>
                </>
                )}
            </main>
        </div>
    ):
    <SignIn />
};