import React, { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import { Spinner } from "../components/Spinner"
import { ListingItem } from "../components/ListingItem"
import {BsCashCoin} from "react-icons/bs"

export const Offers= () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState();

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
                //save the last fetched listing
                const lastVizible = querySnap.docs[querySnap.docs.length -1]
                setLastFetchedListing(lastVizible);

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


  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(3)
      )
      // Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

    return (loading) ? <Spinner/> :
    (loading === false && listings.length ===0) ? 
    (<div className="categoryListings">No items to display</div>) :  
        (<div className="category">
                <header style={{display: 'flex'}}>
                    <p className="exploreHeader">
                        Sales
                    </p>
                    <button disabled={true} style={{color:'black', fontSize:'0.8cm', paddingTop:'0.8cm'}}>
                        <BsCashCoin/>
                    </button>
                </header>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                           <ListingItem item={listing} key={listing.id}/>
                    ))}
                </ul>
                {lastFetchedListing && (
                    <p className='loadMore' onClick={onFetchMoreListings}>
                    Load More
                    </p>
                )}
        </div>)
}