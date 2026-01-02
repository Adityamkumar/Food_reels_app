import React, {useState, useRef} from 'react';
import './CreateFood.css';
import axios from 'axios'
import {API_URL} from '../config/api'
import {useNavigate} from 'react-router-dom';


const CreateFood = () => {
    const [formData, setFormData] = useState({itemName: '', description: '', videoFile: null});
    const [videoPreview, setVideoPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
    };

    const handleFileSelection = (file) => {
        if (file && file.type.startsWith('video/')) {
            setFormData(prev => ({
                ...prev,
                videoFile: file
            }));
            setVideoPreview(URL.createObjectURL(file));
        } else {
            alert('Please select a valid video file');
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) 
            return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const removeVideo = (e) => {
        e.stopPropagation();
        setFormData(prev => ({
            ...prev,
            videoFile: null
        }));
        setVideoPreview(null);
        if (fileInputRef.current) 
            fileInputRef.current.value = '';
        
    };

    /* Removed duplicate handleSubmit */

    const submitFoodData = async (e) => {
        e.preventDefault();
        if (isUploading) return;

        try {
            setIsUploading(true);

            // 1. Get Authentication Parameters from Backend
            const authResponse = await axios.get(`${API_URL}/api/food/imagekit-auth`, {
                withCredentials: true
            });

            const { signature, token, expire, publicKey } = authResponse.data;

            // 2. Upload directly to ImageKit
            const uploadData = new FormData();
            uploadData.append('file', formData.videoFile);
            uploadData.append('fileName', formData.videoFile.name);
            uploadData.append('signature', signature);
            uploadData.append('token', token);
            uploadData.append('expire', expire);
            uploadData.append('publicKey', publicKey);
            uploadData.append('useUniqueFileName', 'true');
            uploadData.append('folder', '/reels_app'); 

            const imageKitResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', uploadData);
            
            const videoUrl = imageKitResponse.data.url;

            // 3. Save Food Item to Backend
            const foodData = {
                name: formData.itemName,
                description: formData.description,
                video: videoUrl
            };

            await axios.post(`${API_URL}/api/food`, foodData, {
                withCredentials: true
            });

            setIsUploading(false);
            alert('Food item created successfully!');

            // Reset form
            setFormData({itemName: '', description: '', videoFile: null});
            setVideoPreview(null);

        } catch (error) {
            console.error('Error submitting food data:', error);
            setIsUploading(false);
            alert('Failed to upload video. Please try again.');
        }
    };

    return (
        <div className="create-food-container">
            <div className="create-food-header">
                <h1>Create New Item</h1>
                <p>Share your culinary masterpiece with the world.</p>
                <button className="submit-btn"
                    style={
                        {
                            width: 'auto',
                            marginTop: '10px',
                            backgroundColor: '#333'
                        }
                    }
                    onClick={
                        () => navigate('/food-partner/dashboard')
                }>
                    View My Dashboard
                </button>
            </div>

            <form className="create-food-form"
                onSubmit={submitFoodData}>
                <div className="form-group">
                    <label>Food Video</label>
                    <div className={
                            `video-upload-area ${
                                isDragActive ? 'drag-active' : ''
                            }`
                        }
                        onClick={handleClickUpload}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}>
                        {
                        videoPreview ? (
                            <>
                                <video src={videoPreview}
                                    className="video-preview"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline/>
                                <button type="button" className="remove-video-btn"
                                    onClick={removeVideo}>
                                    ✕
                                </button>
                                <div className="video-info-overlay">
                                    <span className="file-name">
                                        {
                                        formData.videoFile ?. name
                                    }</span>
                                    <span className="file-size">
                                        {
                                        formatFileSize(formData.videoFile ?. size || 0)
                                    }</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="upload-icon">📹</span>
                                <span className="upload-text">
                                    Click to upload or drag & drop video
                                </span>
                                <span className="upload-text"
                                    style={
                                        {
                                            fontSize: '0.75rem',
                                            marginTop: '5px'
                                        }
                                }>
                                    (MP4, WebM, MOV)
                                </span>
                            </>
                        )
                    }
                        <input type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="file-input"
                            accept="video/*"/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="itemName">Item Name</label>
                    <input type="text" id="itemName" name="itemName" placeholder="e.g. Spicy Chicken Burger" className="form-input"
                        value={
                            formData.itemName
                        }
                        onChange={handleInputChange}
                        required/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" placeholder="Describe the taste, ingredients, and what makes it special..." className="form-textarea"
                        value={
                            formData.description
                        }
                        onChange={handleInputChange}
                        required/>
                </div>

                <button type="submit" className="submit-btn"
                    disabled={
                        !formData.itemName || !formData.videoFile || isUploading
                }>
                    {
                    isUploading ? 'Uploading...' : 'Create Food Item'
                } </button>
            </form>
        </div>
    );
}

export default CreateFood;
