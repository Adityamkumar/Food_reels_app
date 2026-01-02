import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../home/Home'
import CreateFood from '../foodPartner/CreateFood'
import PartnerProfile from '../foodPartner/PartnerProfile'
import PartnerDashboard from '../foodPartner/PartnerDashboard' // Import dashboard
import SavedFood from '../pages/SavedFood'
import UserProfile from '../pages/UserProfile'

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/user/register'
                    element={<UserRegister/>}/>
                <Route path='/user/login'
                    element={<UserLogin/>}/>
                <Route path='/food-partner/register'
                    element={<FoodPartnerRegister/>}/>
                <Route path='/food-partner/login'
                    element={<FoodPartnerLogin/>}/>
                <Route path='/'
                    element={<Home/>}/>
                <Route path='/create-food'
                    element={<CreateFood/>}/>
                <Route path='/food-partner/dashboard'
                    element={<PartnerDashboard/>}/>
                <Route path='/food-partner/:id'
                    element={<PartnerProfile/>}/>
                <Route path='/saved'
                    element={<SavedFood/>}/>
                <Route path='/profile'
                    element={<UserProfile/>}/>
            </Routes>
        </Router>
    )
}

export default AppRouter
