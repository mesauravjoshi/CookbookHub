import React from 'react'
import './LoadingCard.css'

function LoadingCard() {
    return (
        <div id="container">
            <div className="dumy-card-loading" >
                <div className="lds-ripple">
                    <div></div><div></div>
                </div>
            </div>
            <div className="dumy-card-loading" >
                <div className="lds-ripple">
                    <div></div><div></div>
                </div>
            </div>
            <div className="dumy-card-loading" >
                <div className="lds-ripple">
                    <div></div><div></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingCard