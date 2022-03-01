import React, { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import { Spinner } from "../components/Spinner"
import { ListingItem } from "../components/ListingItem"
import {BsCashCoin} from "react-icons/bs"

export const Offers= () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchListings = async() =>{
            try{
                //access the listings collections from the DB
                const listingsRef = collection(db, 'listings');
                //create a query to list the items 
                const q = query(
                    listingsRef, 
                    where('offer', '==', true), 
                    orderBy('timestamp', 'desc'), 
                    limit(10));
                //execute the query
                const querySnap = await getDocs(q);
                const newListings = [];
                querySnap.forEach((doc)=>{
                    return newListings.push({
                        id: doc.id, 
                        data: doc.data()
                    })
                })
                setListings(newListings);
                setLoading(false);
            }catch(error){
                toast.error('Items could not be displayed!')
            }
        }
        fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (loading) ? <Spinner/> :
    (loading === false && listings.length ===0) ? 
    (<div className="categoryListings">No items to display</div>) :  
        (<div className="category">
                <header style={{display: 'flex'}}>
                    <p className="categoryHeader">
                        Sales
                    </p>
                    <button disabled={true} style={{color:'black', fontSize:'0.8cm', paddingTop:'0.2cm'}}>
                        <BsCashCoin/>
                    </button>
                </header>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                           <ListingItem item={listing} key={listing.id}/>
                    ))}
                </ul>
        </div>)
}