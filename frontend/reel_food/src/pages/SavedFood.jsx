import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import {ArrowLeft, Grid, List} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './SavedFood.css';
import ProtectedVideo from '../components/ProtectedVideo';

const SavedFood = () => {
    const navigate = useNavigate();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedFoods = async () => {
            try {
                // Determine base URL (assuming localhost:3000 for now based on previous context)
                const response = await axios.get(`${API_URL}/api/food/saved`, {
                    withCredentials: true
                });
                setSavedItems(response.data.savedFoods || []);
            } catch (error) {
                console.error("Error fetching saved foods:", error);
                if (error.response?.status === 401 || error.response?.status === 400) {
                    navigate('/user/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSavedFoods();
    }, []);

    if (loading) {
        return <div className="saved-page"><div className="loading">Loading saved items...</div><BottomNav/></div>;
    }

    return (
        <div className="saved-page">
            <header className="saved-header">
                <h2>Saved Board</h2>
            </header>

            <div className="saved-grid">
                {savedItems.length > 0 ? (
                    savedItems.map(item => (
                        <div key={item._id} className="saved-item-card" onClick={() => navigate('/', { state: { videoId: item._id } })}>
                            <ProtectedVideo 
                                src={item.video} 
                                className="saved-item-image"
                                muted
                                onMouseOver={e => e.target.play()}
                                onMouseOut={e => {
                                    e.target.pause();
                                    e.target.currentTime = 0;
                                }}
                            />
                            <div className="saved-item-info">
                                <h3>{item.name}</h3>
                                <p>{item.foodPartner?.name || 'Unknown Restaurant'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-saved-items">No saved food reels yet.</div>
                )}
            </div>


            <BottomNav/>
        </div>
    );
};

export default SavedFood;
