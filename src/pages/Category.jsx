import React, { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Spinner } from "../components/Spinner"
import { ListingItem } from "../components/ListingItem"

export const Category= () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState();
    const params = useParams();
    const navigate=useNavigate();

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
                    limit(3));
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
    }, [params.categoryName]);


  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
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
    <div style={{marginLeft:'0.5cm', marginTop:'1.5cm'}}>
        <p style={{color: 'black', fontWeight:'700', fontSize:'24px'}}>
            No listings avalabile
        </p>
        <button className="primaryButton" onClick={()=>{navigate('/')}}>
                    Back
        </button> 
    </div> :  
        (<div className="category">
            <header>
                <p className="exploreHeader">
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
            {lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
            )}
        </div>
    )
}