import { useState } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
// import Home from '../../Home'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'


function Products() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    return (
        <>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className='main-container'>
                <div className='main-title'>
                    <h3>PRODUCTS</h3>
                </div>

                <div className='main-cards'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>PRODUCTS</h3>
                            <BsFillArchiveFill className='card_icon' />
                        </div>
                        <h1>300</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>CATEGORIES</h3>
                            <BsFillGrid3X3GapFill className='card_icon' />
                        </div>
                        <h1>12</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>CUSTOMERS</h3>
                            <BsPeopleFill className='card_icon' />
                        </div>
                        <h1>33</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>ALERTS</h3>
                            <BsFillBellFill className='card_icon' />
                        </div>
                        <h1>42</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products