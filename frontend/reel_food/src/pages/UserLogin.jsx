import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');

      try {
          const response = await axios.post('http://localhost:3000/api/auth/user/login',{
              email,
              password
           },{
             withCredentials: true
           })
          console.log(response.data)

         setEmail('')
         setPassword('')    
         
         navigate('/')
      } catch (err) {
          setError(err.response?.data?.message || 'Something went wrong');
      }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>Welcome Back</h2>
          <p>Login to your account to continue</p>
        </div>
        <form className='auth-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label' htmlFor='email'>Email Address</label>
            <input 
              type='email' 
              id='email' 
              className='form-input' 
              placeholder='Enter your email'
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='password'>Password</label>
            <input 
              type='password' 
              id='password' 
              className='form-input' 
              placeholder='Enter your password'
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type='submit' className='submit-btn'>Login</button>
        </form>
        <div className='auth-footer'>
          <p>
            Don't have an account? 
            <Link to='/user/register' className='auth-link'>Sign up</Link>
          </p>
          <p style={{marginTop: '10px'}}>
            Food Partner? <Link to='/food-partner/login' className='auth-link'>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
