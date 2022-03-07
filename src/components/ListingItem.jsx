import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import { Link } from 'react-router-dom'

export const ListingItem = ({item, onDelete, onEdit}) => {
    return ( 
        <>

        <li className='categoryListing'>
        <div style={{display: 'block', justifyContent: 'space-between', marginLeft:'-0.3cm'}}>
            {onDelete && <DeleteIcon onClick={()=>onDelete(item?.id, item?.data?.name)}/>}
            {onEdit && <EditIcon onClick={()=>onEdit(item?.id)}/>}
        </div>
            <Link to={`/category/${item?.data?.type}/${item?.id}`} className='categoryListingLink'>
                <img 
                    src={item?.data?.imgUrls[0]} 
                    alt={item?.data?.name}
                    className={'categoryListingImg'}
                />
                <div className='categoryListingDetails'>
                    <p className='categoryListingLocation'>
                        {item?.data?.location}
                    </p>
                    <p className='categoryListingName'>
                        {item?.data?.name}
                    </p>
                    <p className='categoryListingPrice'>
                        ${item?.data?.offer ? item?.data?.discountedPrice : item?.data?.regularPrice}
                        {item?.data?.type ==='rent' ? ' /Month' : ''}
                    </p>
                    <div className='categoryListingInfoDiv'>
                        <img src={bedIcon} alt='bed'/>
                        <p className='categoryListingInfoText'>
                            {item?.data?.bedrooms > 1? `${item?.data?.bedrooms} bedrooms` : '1 bedroom'}
                        </p>
                        <img src={bathtubIcon} alt='bath'/>
                        <p className='categoryListingInfoText'>
                            {item?.data?.bathrooms > 1 ? `${item?.data?.bathrooms} bathrooms` : `1 bathroom`}
                        </p>
                    </div>
                </div>
            </Link>
        </li>
        </>
    )
}