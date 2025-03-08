import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Contact() {
    return (    
        <div>
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
            <div id="container" className="center w-clear">
                <div className="w-clear">
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <h2 className="contact-title">Gửi thắc mắc cho chúng tôi</h2>
                            <form className="form-contact validation-contact" method="post" encType="multipart/form-data">
                                <div className="row">
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                                            <input type="text" className="form-control" id="ten" name="ten" placeholder="Họ tên*" required />
                                        </div>
                                        <div className="invalid-feedback">Vui lòng nhập họ và tên</div>
                                    </div>
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                                            <input type="text" className="form-control" id="dienthoai" name="dienthoai" placeholder="Số điện thoại" required
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')} />
                                        </div>
                                        <div className="invalid-feedback">Vui lòng nhập số điện thoại</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                                            <input type="text" className="form-control" id="diachi" name="diachi" placeholder="Địa chỉ" required />
                                        </div>
                                        <div className="invalid-feedback">Vui lòng nhập địa chỉ</div>
                                    </div>
                                    <div className="input-contact col-sm-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                                            <input type="email" className="form-control" id="email" name="email" placeholder="E-mail*" required />
                                        </div>
                                        <div className="invalid-feedback">Vui lòng nhập địa chỉ email</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-contact col-sm-12">
                                        <textarea className="form-control" id="noidung" name="noidung" placeholder="Nội dung cần tư vấn..." required></textarea>
                                        <div className="invalid-feedback">Vui lòng nhập nội dung</div>
                                    </div>
                                </div>
                                <input type="submit" className="btn btn-contact" id='submit' name="submit-contact" value="Gửi thông tin" />
                                <input type="hidden" name="recaptcha_response_contact" id="recaptchaResponseContact" />
                            </form>
                        </div>
                        <div className="col-md-6 col-12 mb-4">
                            <h2 className="contact-title">Thông tin về Công ty TNHH Du lịch Sky Travel</h2>
                            <div className="contact-info">
                                <p>Địa chỉ: Số 112, KDC Võ Thị Sáu, KP7, Phường Thống Nhất, Tp.Biên Hoà, T.Đồng Nai</p>
                                <p>Hotline: 0939.390.707</p>
                                <p>Email: sky.travel@gmail.com</p>
                                <p>Website: <a href="http://bienhoastartravel.com">http://skytravel.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Contact;