import React, { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Spinner } from "../components/Spinner"
import { ListingItem } from "../components/ListingItem"

export const Category= () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(()=>{
        const fetchListings = async() =>{
            try{
                //access the listings collections from the DB
                const listingsRef = collection(db, 'listings');
                //create a query to list the items 
                const q = query(
                    listingsRef, 
                    where('type', '==', params.categoryName), 
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
    }, [params.categoryName]);

    return (loading) ? <Spinner/> :
    (loading === false && listings.length ===0) ? 
    <div className="categoryListings">No items to display</div> :  
        (<div className="category">
            <header>
                <p className="categoryHeader">
                    {
                        params.categoryName === 'sell' ? 'Houses for sale' : "Houses for rental"
                    }
                </p>
            </header>  
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                           <ListingItem item={listing} key={listing.id}/>
                    ))}
                </ul>
        </div>
    )
}