import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapMarkerAlt, faEnvelope, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Contact() {
    const [formData, setFormData] = useState({
        ten: '',
        dienthoai: '',
        diachi: '',
        email: '',
        noidung: ''
    });
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [fieldErrors, setFieldErrors] = useState({});

    const inputStyle = {
        color: '#000000',
        backgroundColor: '#ffffff',
        borderColor: '#ececec', 
        borderWidth: '2px',
    };

    const buttonStyle = {
        backgroundColor: '#ff6200',
        borderColor: '#ff6200',
        color: '#ffffff',
        transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = `
        .btn-contact:hover {
            background-color: #e55b00 !important;
            border-color: #e55b00 !important;
        }
    `;

    const customValidationMessages = {
        ten: 'Vui lòng nhập họ tên',
        dienthoai: 'Vui lòng nhập số điện thoại',
        diachi: 'Vui lòng nhập địa chỉ',
        email: 'Vui lòng nhập email hợp lệ',
        noidung: 'Vui lòng nhập nội dung'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'dienthoai' ? value.replace(/[^0-9]/g, '') : value
        }));
        
        // Clear error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            
            // Find invalid fields and set custom error messages
            const invalidFields = {};
            form.querySelectorAll(':invalid').forEach(field => {
                invalidFields[field.name] = customValidationMessages[field.name] || 'Vui lòng điền thông tin này';
            });
            setFieldErrors(invalidFields);
            
            return;
        }

        if (!navigator.onLine) {
            setSubmitStatus({ type: 'error', message: 'Không có kết nối internet!' });
            setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
            return;
        }

        try {
            const apiUrl = 'http://localhost:5001/api/contact';
            console.log('Sending data to:', apiUrl);
            console.log('Data:', formData);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                timeout: 5000
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSubmitStatus({ 
                type: 'success', 
                message: 'Đã gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.' 
            });
            setFormData({
                ten: '',
                dienthoai: '',
                diachi: '',
                email: '',
                noidung: ''
            });
            form.classList.remove('was-validated');
            setFieldErrors({});
        } catch (error) {
            console.error('Fetch error:', error.message);
            let errorMessage = 'Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.';
            if (error.message.includes('fetch')) {
                errorMessage = 'Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Yêu cầu hết thời gian chờ! Vui lòng thử lại.';
            }
            setSubmitStatus({ type: 'error', message: errorMessage });
        }

        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
    };

    const closeSuccessPopup = () => {
        setSubmitStatus({ type: '', message: '' });
    };

    return (    
        <div>
            <style>{buttonHoverStyle}</style>
            <div className="breadCrumbs">
                <div className="center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a className="text-decoration-none" href="/"><span>Trang chủ</span></a>
                        </li>
                        <li className="breadcrumb-item active">
                            <span>Liên hệ</span>
                        </li>
                    </ol>
                </div>
            </div>
            <div id="container" className="center w-clear" style={{ marginBottom: '20px' }}>
                {/* Success Popup */}
                {submitStatus.type === 'success' && (
                    <div className="success-popup-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '10px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            maxWidth: '500px',
                            width: '90%',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            <button 
                                onClick={closeSuccessPopup} 
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            
                            <div style={{
                                color: '#4CAF50',
                                fontSize: '50px',
                                marginBottom: '20px'
                            }}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            
                            <h3 style={{
                                color: '#4CAF50',
                                marginBottom: '15px'
                            }}>Thành công!</h3>
                            
                            <p style={{
                                fontSize: '18px',
                                marginBottom: '20px',
                                color: '#333'
                            }}>{submitStatus.message}</p>
                            
                            <button 
                                onClick={closeSuccessPopup} 
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="w-clear">
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <h2 className="contact-title">Gửi thắc mắc cho chúng tôi</h2>
                            <form 
                                className="form-contact validation-contact needs-validation" 
                                onSubmit={handleSubmit} 
                                noValidate 
                                method="post" 
                                encType="multipart/form-data"
                            >
                                <div className="row">
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                                            <input 
                                                type="text" 
                                                className={`form-control ${fieldErrors.ten ? 'is-invalid' : ''}`} 
                                                id="ten" 
                                                name="ten" 
                                                placeholder="Họ tên*" 
                                                required 
                                                value={formData.ten}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        {fieldErrors.ten && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {fieldErrors.ten}
                                            </div>
                                        )}
                                    </div>
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                                            <input 
                                                type="text" 
                                                className={`form-control ${fieldErrors.dienthoai ? 'is-invalid' : ''}`} 
                                                id="dienthoai" 
                                                name="dienthoai" 
                                                placeholder="Số điện thoại*" 
                                                required
                                                value={formData.dienthoai}
                                                onChange={handleChange}
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                style={inputStyle}
                                            />
                                        </div>
                                        {fieldErrors.dienthoai && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {fieldErrors.dienthoai}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                                            <input 
                                                type="text" 
                                                className={`form-control ${fieldErrors.diachi ? 'is-invalid' : ''}`} 
                                                id="diachi" 
                                                name="diachi" 
                                                placeholder="Địa chỉ*" 
                                                required 
                                                value={formData.diachi}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        {fieldErrors.diachi && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {fieldErrors.diachi}
                                            </div>
                                        )}
                                    </div>
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                                            <input 
                                                type="email" 
                                                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`} 
                                                id="email" 
                                                name="email" 
                                                placeholder="E-mail*" 
                                                required 
                                                value={formData.email}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        {fieldErrors.email && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-contact col-sm-12">
                                        <div className="input-group">
                                            <textarea 
                                                className={`form-control ${fieldErrors.noidung ? 'is-invalid' : ''}`} 
                                                id="noidung" 
                                                name="noidung" 
                                                placeholder="Nội dung cần tư vấn*" 
                                                required
                                                value={formData.noidung}
                                                onChange={handleChange}
                                                style={inputStyle}
                                            ></textarea>
                                        </div>
                                        {fieldErrors.noidung && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {fieldErrors.noidung}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <input 
                                    type="submit" 
                                    className="btn btn-contact" 
                                    name="submit-contact"
                                    value="Gửi thông tin"
                                    style={buttonStyle}
                                />
                                {submitStatus.type === 'error' && (
                                    <div className="mt-2 text-center text-danger" style={{ fontSize: '16px' }}>
                                        {submitStatus.message}
                                    </div>
                                )}
                                <input type="hidden" name="recaptcha_response_contact" id="recaptchaResponseContact" />
                            </form>
                        </div>
                        <div className="col-md-6 col-12 mb-4">
                            <h2 className="contact-title">Thông tin về Công ty TNHH Du lịch Sky Travel</h2>
                            <div className="contact-info">
                                <p>Địa chỉ: Kp5, Đ.Nguyễn Khuyến, P. Trảng Dài, Tp.Biên Hoà, T.Đồng Nai</p>
                                <p>Hotline: 0984.046.668</p>
                                <p>Email: skytravel@gmail.com</p>
                                <p>Website: <a href="http://skytravel.com">http://skytravel.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Contact;