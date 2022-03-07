import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import shareIcon from '../assets/svg/shareIcon.svg'
import { Spinner } from "../components/Spinner";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Navigation, Pagination, A11y, Scrollbar])

export const Listing = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLink, setShareLink] = useState(false);
    const params = useParams();
    const navigate= useNavigate();
    const auth = getAuth();

    useEffect(()=>{
        const fetchListing = async()=>{
            //takes the listing by the listing ID from the URL
            const docRef = doc(db, 'listings', params.listingId);
            console.log('docRef:', docRef)
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


    return loading? <Spinner/> : ( 
        <main>
             <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
            <div className="shareIconDiv" onClick={()=>{
                navigator.clipboard.writeText(window.location.href);
                setShareLink(true);
                setTimeout(()=>{
                    setShareLink(false);
                }, 2000)
            }}>
                <img src={shareIcon} alt="shareIcon"/>
            </div>

            {shareLink && <p className="linkCopied">Link copied!</p>}

            <div className="listingDetails">
                <p className="listingName">
                    {listing.name}
                    <br/>
                    {listing.offer? listing.discountedPrice: listing.regularPrice}{listing.type === 'sell'? '$' : '$ /Month'}
                </p>
                <p className="listingLocation">
                    {listing.location}
                </p>
                <p className="listingType">
                    {listing.type === 'rent'? 'For Rent': 'For Sale'}
                </p>
                {listing.offer && 
                <p className="discountPrice">
                    {listing.regularPrice-listing.discountedPrice}$ Discount
                </p>}
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1? `${listing.bedrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>
                        {listing.parking &&  'Parking Spot'}
                    </li>
                    <li>
                        {listing.furnished &&  'Furnished'}
                    </li>
                </ul>
                <p className="listingLocationTitle">
                    Location
                </p>

                <div className="leafletContainer">
                    <MapContainer style={{height:'100%', width:'100%'}} center={[listing?.latitude, listing?.longitude]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker
                            position={[listing.latitude, listing.longitude]}>
                        </Marker>
                        {/* <Popup>{listing.location}</Popup> */}
                    </MapContainer>
                </div>

                <button className="primaryButton" onClick={()=>{navigate(`/category/${listing.type}`)}}>
                    Back
                </button> 

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    )
}