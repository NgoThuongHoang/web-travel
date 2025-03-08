import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button
            id="back-to-top"
            style={{
                display: 'block',
                position: 'fixed',
                bottom: '50px',
                right: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#ff9800', // Màu cam
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1000,
                opacity: isVisible ? 1 : 0, // Hiện từ từ
                transform: isVisible ? 'scale(1)' : 'scale(0.8)', // Thu phóng
                transition: 'opacity 0.3s ease, transform 0.3s ease', // Hiệu ứng chuyển đổi
            }}
            onClick={scrollToTop}
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
};

export default BackToTop;
