import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './PartnerProfile.css';

const PartnerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partnerVideos, setPartnerVideos] = useState([]);
    const [partner, setPartner] = useState(null);
    const [stats, setStats] = useState({ meals: 0, customers: '0' });


    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                // Fetch Partner Details
                const partnerResponse = await axios.get(`http://localhost:3000/api/food-partner/${id}`, {withCredentials: true});
                setPartner(partnerResponse.data.foodPartner);

                // Fetch videos
                const response = await axios.get('http://localhost:3000/api/food', {
                     withCredentials: true 
                });
                const allVideos = response.data.foodItems || [];
                
                // Filter videos
                const filteredVideos = allVideos.filter(v => 
                    (v.foodPartner === id) || (v.foodPartner?._id === id)
                );
                
                setPartnerVideos(filteredVideos);
                setStats({
                    meals: filteredVideos.length,
                    customers: '1.2K'
                });

            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };
        
        fetchPartnerData();
    }, [id]);

    const openVideo = (video) => {
        navigate('/', { state: { videoId: video._id } });
    };

    return (
        <div className="profile-container">


            <div className="profile-back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={24} />
            </div>

            <div className="profile-header-card">
                <div className="profile-content-wrapper">
                    <div className="profile-left-section">
                        <div className="profile-avatar-container">
                             <img 
                                src={`https://ui-avatars.com/api/?name=${partner?.name || 'Partner'}&background=random&color=fff&size=128`} 
                                alt="Profile" 
                                className="profile-avatar-img"
                            />
                        </div>
                    </div>
                    
                    <div className="profile-middle-section">
                        <h1 className="partner-title">{partner?.name || "Loading..."}</h1>
                        <p className="partner-location">
                            {partner?.address || "Location unavailable"}
                        </p>
                        <div className="partner-tags">
                            <span className="tag">Restaurant</span>
                            <span className="tag">Partner</span>
                        </div>
                    </div>

                    <div className="profile-right-section">
                        <div className="stat-group">
                            <span className="stat-value highlight">{stats.meals}</span>
                            <span className="stat-label">Meals</span>
                        </div>
                        <div className="stat-divider-vertical"></div>
                        <div className="stat-group">
                            <span className="stat-value">{stats.customers}</span>
                            <span className="stat-label">Served</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="content-divider">
                <span>REELS & MENU</span>
            </div>

            <div className="video-grid-container">
                {partnerVideos.map((video, index) => (
                    <div className="grid-video-card" key={video._id || index} onClick={() => openVideo(video)}>
                        <video 
                            src={video.video} 
                            className="grid-video-element"
                            muted
                            playsInline
                            loop
                            onMouseOver={e => e.target.play()}
                            onMouseOut={e => {
                                e.target.pause();
                                e.target.currentTime = 0;
                            }}
                        />
                         <div className="video-overlay-gradient">
                            <span>▶</span>
                         </div>
                    </div>
                ))}
                
                {partnerVideos.length === 0 && (
                    <div className="empty-state">
                        <p>No reels yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerProfile;
