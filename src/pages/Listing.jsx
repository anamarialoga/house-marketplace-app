import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

export const Listing = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const navigate= useNavigate();
    const auth = getAuth();

    useEffect(()=>{
        const fetchListing = async()=>{
            //takes the listing by the listing ID from the URL
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                // console.log(docSnap.data());
                setListing(docSnap.data());
                setLoading(false);
            }
        }

        fetchListing();
    }, [navigate, params.listingId])

    console.log(listing);


    return ( 
    <main>
        Listing
    </main>
    )
}