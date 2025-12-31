import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import '../styles/auth.css'


const UserRegister = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await axios.post('http://localhost:3000/api/auth/user/register', {
                fullName,
                email,
                password
            }, {withCredentials: true})

            setFullName('')
            setEmail('')
            setPassword('')

            navigate('/')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Registration failed')
        }
    }


    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h2>Create Account</h2>
                    <p>Join us to explore delicious food reels</p>
                </div>
                <form className='auth-form'
                    onSubmit={submitHandler}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='name'>Full Name</label>
                        <input type='text' id='name' className='form-input' placeholder='Enter your full name' required
                            value={fullName}
                            onChange={
                                (e) => setFullName(e.target.value)
                            }/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>Email Address</label>
                        <input type='email' id='email' className='form-input' placeholder='Enter your email' required
                            value={email}
                            onChange={
                                (e) => setEmail(e.target.value)
                            }/>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='password'>Password</label>
                        <input type='password' id='password' className='form-input' placeholder='Create a strong password' required
                            value={password}
                            onChange={
                                (e) => setPassword(e.target.value)
                            }/>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type='submit' className='submit-btn'>Sign Up</button>
                </form>
                <div className='auth-footer'>
                    <p>
                        Already have an account?
                        <Link to='/user/login' className='auth-link'>Login</Link>
                    </p>
                    <p style={
                        {marginTop: '10px'}
                    }>
                        Food Partner?
                        <Link to='/food-partner/register' className='auth-link'>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserRegister
