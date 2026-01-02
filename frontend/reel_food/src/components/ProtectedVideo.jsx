
import React, { useState, useEffect, useRef, forwardRef } from 'react';

const ProtectedVideo = forwardRef(({ src, onContextMenu, ...props }, ref) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [error, setError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const elementRef = useRef(null);

    // Initial Observation for Lazy Loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Fetch Blob when visible
    useEffect(() => {
        if (!shouldLoad || !src) return;
        
        let active = true;
        let objUrl;

        const fetchVideo = async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) throw new Error('Network response was not ok');
                const blob = await response.blob();
                if (active) {
                    objUrl = URL.createObjectURL(blob);
                    setBlobUrl(objUrl);
                }
            } catch (e) {
                console.error("Video load error", e);
                setError(true);
            }
        };

        fetchVideo();

        return () => {
            active = false;
            if (objUrl) URL.revokeObjectURL(objUrl);
        };
    }, [shouldLoad, src]);


    // Handle Right Click
    const handleContextMenu = (e) => {
        e.preventDefault();
        if (onContextMenu) onContextMenu(e);
    };

    // Merging refs for the video element
    const setRef = (node) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    // Fallback to normal src if error occurs
    if (error) {
        return (
             <video 
                ref={setRef}
                src={src} 
                onContextMenu={handleContextMenu}
                {...props} 
            />
        );
    }

    // Render with Blob URL or empty while loading
    // We keep the original src as backup in case blob fails unexpectedly or for initial accessibility/SEO if needed, 
    // but here we want to hide it.
    return (
        <video 
            ref={setRef}
            src={blobUrl || ""} 
            onContextMenu={handleContextMenu}
            {...props}
        />
    );
});

export default ProtectedVideo;
