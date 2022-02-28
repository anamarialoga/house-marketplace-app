import React from "react"
import { Link } from "react-router-dom"
import rentCategory from '../assets/jpg/rentCategory.jpg'
import sellCategory from '../assets/jpg/sellCategory.jpg'


export const Explore = () => {
    return (
        <div className="explore">
            <header>
                <p className="exploreHeader">Explore</p>
            </header>
            <main>
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to='/category/rent'>
                        <img src={rentCategory} alt='rent' className="exploreCategoryImg"/>
                        <p className="exploreCategoryName">Houses for rental</p>
                    </Link> 
                    <Link to='/category/sell'>
                        <img src={sellCategory} alt='sell' className="exploreCategoryImg"/>
                        <p className="exploreCategoryName">Houses for sell</p>
                    </Link> 
                </div>
            </main>
        </div>
    )
}