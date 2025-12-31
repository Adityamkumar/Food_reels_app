import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

const FoodPartnerRegister = () => {

    const [formData, setFormData] = useState({
        name: '',
        contactName: '',
        phone: '',
        address: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', 
                formData,
                {withCredentials: true}
            )

            console.log(response.data)

            setFormData({
                name: '',
                contactName: '',
                phone: '',
                address: '',
                email: '',
                password: ''
            })

            navigate('/create-food')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='auth-container'>
            <div className='auth-card auth-card-wide'>
                <div className='auth-header'>
                    <h2>Partner Registration</h2>
                    <p>Grow your business with us</p>
                </div>
                <form className='auth-form auth-form-grid'
                    onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='businessName'>Business Name</label>
                        <input type='text' id='businessName' name='name' className='form-input' placeholder='Enter business name' required
                            value={formData.name}
                            onChange={handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='contactName'>Contact Name</label>
                        <input type='text' id='contactName' name='contactName' className='form-input' placeholder='Enter contact person name' required
                            value={formData.contactName}
                            onChange={handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='phone'>Phone No</label>
                        <input type='tel' id='phone' name='phone' className='form-input' placeholder='Enter phone number' required
                            value={formData.phone}
                            onChange={handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>Business Email</label>
                        <input type='email' id='email' name='email' className='form-input' placeholder='Enter business email' required
                            value={formData.email}
                            onChange={handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='address'>Address</label>
                        <input type='text' id='address' name='address' className='form-input' placeholder='Enter business address' required
                            value={formData.address}
                            onChange={handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' className='form-input' placeholder='Create a strong password' required
                            value={formData.password}
                            onChange={handleChange}/>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type='submit' className='submit-btn' disabled={loading}>
                        {loading ? 'Registering...' : 'Register Business'}
                    </button>
                </form>
                <div className='auth-footer'>
                    <p>
                        Already a partner?
                        <Link to='/food-partner/login' className='auth-link'>Login</Link>
                    </p>
                    <p style={
                        {marginTop: '10px'}
                    }>
                        Not a partner?
                        <Link to='/user/register' className='auth-link'>Register User</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FoodPartnerRegister
