import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

const FoodPartnerLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:3000/api/auth/food-partner/login', {
                email,
                password
            }, {withCredentials: true});

            setEmail('');
            setPassword('');

            navigate('/create-food');
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h2>Partner Login</h2>
                    <p>Access your restaurant dashboard</p>
                </div>
                <form className='auth-form'
                    onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>Business Email</label>
                        <input type='email' id='email' className='form-input' placeholder='Enter business email' required
                            value={email}
                            onChange={
                                (e) => setEmail(e.target.value)
                            }/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='password'>Password</label>
                        <input type='password' id='password' className='form-input' placeholder='Enter password' required
                            value={password}
                            onChange={
                                (e) => setPassword(e.target.value)
                            }/>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type='submit' className='submit-btn'>Login to Dashboard</button>
                </form>
                <div className='auth-footer'>
                    <p>
                        New to our platform?
                        <Link to='/food-partner/register' className='auth-link'>Register Partner</Link>
                    </p>
                    <p style={
                        {marginTop: '10px'}
                    }>
                        Not a partner?
                        <Link to='/user/login' className='auth-link'>User Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FoodPartnerLogin
