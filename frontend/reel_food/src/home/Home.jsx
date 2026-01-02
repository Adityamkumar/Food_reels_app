import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { Heart, MessageCircle, Bookmark, Volume2, VolumeX } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import ProtectedVideo from '../components/ProtectedVideo';
import './Home.css';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [likedIds, setLikedIds] = useState(new Set());
    const [savedIds, setSavedIds] = useState(new Set());
    const [processingIds, setProcessingIds] = useState(new Set());
    const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
    const videoRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/food`, {
                    withCredentials: true
                });
                let data = response.data.foodItems || []; 
                
                // Fisher-Yates Shuffle
                for (let i = data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [data[i], data[j]] = [data[j], data[i]];
                }

                if (location.state?.videoId) {
                    const targetIndex = data.findIndex(v => v._id === location.state.videoId);
                    if (targetIndex !== -1) {
                        const [targetVideo] = data.splice(targetIndex, 1);
                        data.unshift(targetVideo);
                        
                    }
                }

                setVideos(data);
                
                const initialLiked = new Set();
                const initialSaved = new Set();
                data.forEach(item => {
                    if (item.isLiked) initialLiked.add(item._id);
                    if (item.isSaved) initialSaved.add(item._id);
                });
                setLikedIds(initialLiked);
                setSavedIds(initialSaved);
            } catch (error) {
                console.error("Error fetching videos:", error);
                if (error.response?.status === 401 || error.response?.status === 400) {
                    navigate('/user/login');
                }
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        if (videos.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                const videoElement = entry.target;
                if (entry.isIntersecting) {
                    videoElement.currentTime = 0;
                    const playPromise = videoElement.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(e => {
                          console.log("Autoplay blocked", e);
                      });
                    }
                } else {
                    videoElement.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach(video => {
                if (video) observer.unobserve(video);
            });
            observer.disconnect();
        };
    }, [videos]);

    const handleVisitStore = (e, video) => {
        e.stopPropagation();
        const partnerId = video.foodPartner || video._id; 
        navigate(`/food-partner/${partnerId}`);
    };

    const togglePlay = (index) => {
        const video = videoRefs.current[index];
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(prev => !prev);
    };

    const toggleLike = async (e, id) => {
        e.stopPropagation();
        
        // Prevent spam clicking
        if (processingIds.has(id)) return;

        try {
            // Lock interaction
            setProcessingIds(prev => new Set(prev).add(id));

            await axios.post(`${API_URL}/api/food/like`, { foodId: id }, {
                withCredentials: true
            });
            
            setLikedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
            
            
            setVideos(prevVideos => prevVideos.map(video => {
                if (video._id === id) {
                    const currentlyLiked = likedIds.has(id);
                    return {
                        ...video,
                        likeCount: Math.max(0, (video.likeCount || 0) + (currentlyLiked ? -1 : 1))
                    };
                }
                return video;
            }));

        } catch (error) {
            console.error("Error liking food:", error);
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const toggleSave = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.post(`${API_URL}/api/food/save`, { foodId: id }, {
                withCredentials: true
            });
            setSavedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } catch (error) {
            console.error("Error saving food:", error);
        }
    };

    if (videos.length === 0) {
        return (
            <div className="loading-container">
                <div className="skeleton skeleton-video"></div>
                
                <div className="skeleton-actions">
                    <div className="skeleton skeleton-icon"></div>
                    <div className="skeleton skeleton-icon"></div>
                    <div className="skeleton skeleton-icon"></div>
                    <div className="skeleton skeleton-icon"></div>
                </div>

                <div className="skeleton-overlay">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-desc"></div>
                    <div className="skeleton skeleton-desc-short"></div>
                    <div className="skeleton skeleton-btn"></div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="reels-container">
            {videos.map((video, index) => (
                <div className="reel-item" key={video._id || index}>
                    <ProtectedVideo
                        ref={el => videoRefs.current[index] = el}
                        src={video.video} 
                        className="reel-video"
                        onClick={() => togglePlay(index)}
                        loop  
                        autoPlay
                        muted={isMuted} // Controlled mute state
                        playsInline
                        preload='metadata'
                    />
                    
                    {/* Right Sidebar Actions */}
                    <div className="reel-actions">
                         <div className="action-item" onClick={toggleMute}>
                            {isMuted ? (
                                <VolumeX size={32} color="white" strokeWidth={1.5} />
                            ) : (
                                <Volume2 size={32} color="white" strokeWidth={1.5} />
                            )}
                        </div>

                        <div className="action-item" onClick={(e) => toggleLike(e, video._id)}>
                            <Heart 
                                size={32} 
                                color={likedIds.has(video._id) ? "#ff2d55" : "white"} 
                                fill={likedIds.has(video._id) ? "#ff2d55" : "transparent"} 
                                strokeWidth={1.5} 
                            />
                            <span>{video.likeCount || 0}</span>
                        </div>
                        <div className="action-item" onClick={(e) => toggleSave(e, video._id)}>
                            <Bookmark 
                                size={32} 
                                color="white" 
                                fill={savedIds.has(video._id) ? "white" : "transparent"} 
                                strokeWidth={1.5} 
                            />
                            <span>{savedIds.has(video._id) ? 'Saved' : 'Save'}</span>
                        </div>
                        <div className="action-item">
                            <MessageCircle size={32} color="white" strokeWidth={1.5} />
                            <span>45</span>
                        </div>
                    </div>

                    {/* Bottom Overlay Info */}
                    <div className="reel-overlay">
                        <div className="reel-content">
                            <div className="reel-info">
                                <h3 className="reel-title">{video.name || "Delicious Food"}</h3>
                                <p className="reel-description">{video.description}</p>
                            </div>
                            <button
                                className="visit-store-btn"
                                onClick={(e) => handleVisitStore(e, video)}
                            >
                                Visit Store
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <BottomNav />
        </div>
    );
}

export default Home;