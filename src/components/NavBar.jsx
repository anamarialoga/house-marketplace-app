import { useNavigate, useLocation } from "react-router-dom"
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'  
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'  
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'  

//NAVIGATE THROUGH PAGES WITH THE NAVBAR COMPONENT

export const NavBar = () => {

    const navigate = useNavigate(); //navigate between pages hook
    const location = useLocation(); //current page hook

    const focusIcon = (path) => {
        if(path === location.pathname)
            return true;
    }

    return (
    <footer className="navbar">
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={()=> navigate('/')}>
                    <ExploreIcon fill={focusIcon('/') || focusIcon('/category/rent') || focusIcon('/category/sell') ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p style={focusIcon('/') || focusIcon('/category/rent') || focusIcon('/category/sell') ? {color: '#2c2c2c'}:{color:'#8f8f8f' , marginTop: '0.25rem', fontSize: '14px', fontWeight: 600}}>Explore</p>
                </li>
                <li className="navbarListItem" onClick={()=> navigate('/offers')}>
                    <OfferIcon fill={focusIcon('/offers') ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p style={focusIcon('/offers') ? {color: '#2c2c2c'}:{color:'#8f8f8f' , marginTop: '0.25rem', fontSize: '14px', fontWeight: 600}}>Offers</p>
                </li>
                <li className="navbarListItem" onClick={()=> navigate('/profile')}>
                    <PersonOutlineIcon fill={(focusIcon('/profile')|| focusIcon('/signin') || focusIcon('/signup') || focusIcon('/forgotpass')) ? '#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                    <p style={focusIcon('/profile') || focusIcon('/signin') || focusIcon('/signup') || focusIcon('/forgotpass') ? {color: '#2c2c2c'}:{color:'#8f8f8f' , marginTop: '0.25rem', fontSize: '14px', fontWeight: 600}}>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>)
}