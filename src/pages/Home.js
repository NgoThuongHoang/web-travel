import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper và SwiperSlide
import { Autoplay, Navigation, Pagination } from 'swiper/modules'; // Import các module từ swiper/modules
import 'swiper/swiper-bundle.css'; // Import CSS của Swiper
import TourSearchFilter from '../components/TourSearchFilter';


function Home() {
    return (
        <div>
            {/* Slideshow */}
            <div className="slideshow">
                <Swiper
                    spaceBetween={0} // Đặt về 0 để không có khoảng cách giữa các slide
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Autoplay, Navigation, Pagination]}
                >
                    <SwiperSlide>
                        <img src="./images/demo2.jpeg" alt="Slide 1" onError={(e) => { e.target.src = 'images/noimage.png'; }} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="./images/demo3.jpeg" alt="Slide 2" onError={(e) => { e.target.src = 'images/noimage.png'; }} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="./images/demo4.jpeg" alt="Slide 3" onError={(e) => { e.target.src = 'images/noimage.png'; }} />
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* intro */}
            <div id="intro">
                <div class="center">
                    <div class="intro-title">
                        <div class="title-main" id='intro'>
                            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                            <h2>Giới thiệu về Công ty TNHH Du lịch Sky Travel</h2>
                        </div>
                    </div>
                    <div class="intro-container">
                        <div class="intro-left">
                            <a href="gioi-thieu" class="scale-img intro-image">
                                <img 
                                    onerror="this.src='images/noimage.png';" 
                                    src="images/logo.png" 
                                    alt="SKY TRAVEL"
                                />
                            </a>
                        </div>
                        <div class="intro-right">
                            <h2 class="intro-name">SKY TRAVEL</h2>
                            <p class="intro-info">
                                SKY TRAVEL là một doanh nghiệp hoạt động trong lĩnh vực du lịch có uy tín với những sản phẩm chủ lực như Voucher nghỉ dưỡng của FLC, Vinpearl, Flamingo.... 
                                Ngoài ra chúng tôi còn có nhiều thế mạnh về du lịch trong và ngoài nước, đặt vé máy bay giá rẻ, hội thảo và sự kiện, hoạt động team building, cho thuê xe du lịch...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* country*/}
            <div id="country">
                <div className="center">
                    <div className="title-main">
                        <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                        <h2>Các quốc gia</h2>
                    </div>
                    <div className="country-grid">
                        <div className="country-items">
                            <a href="thai-lan" className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="images/images_tour/anh_tour_nuoc_ngoai/ban-sao-bangkok-6202.png" 
                                        alt="THÁI LAN" 
                                    />
                                    <span>THÁI LAN</span>
                                </div>
                            </a>
                        </div>
                        <div className="country-items">
                            <a href="japan" className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="images/images_tour/anh_tour_nuoc_ngoai/cung-9276-1653564521-4500.jpg" 
                                        alt="HÀN QUỐC" 
                                    />
                                    <span>HÀN QUỐC</span>
                                </div>
                            </a>
                        </div>
                        <div className="country-items">
                            <a href="japan-1-1" className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="images/images_tour/anh_tour_nuoc_ngoai/nhat-ban-2265.jpg" 
                                        alt="NHẬT BẢN" 
                                    />
                                    <span>NHẬT BẢN</span>
                                </div>
                            </a>
                        </div>
                        <div className="country-items">
                            <a href="singapore" className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="images/images_tour/anh_tour_nuoc_ngoai/sin-5060.jpg" 
                                        alt="SINGAPORE" 
                                    />
                                    <span>SINGAPORE</span>
                                </div>
                            </a>
                        </div>
                        <div className="country-items">
                            <a href="da-nang" className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="images/images_tour/anh_tour_viet_nam/ba-na1-2013.jpg" 
                                        alt="VIỆT NAM" 
                                    />
                                    <span>VIỆT NAM</span>
                                </div>
                            </a>
                        </div>
                        <div className="country-items">
                            <a href="malaysia" className="scale-img">
                                <div className="image-container">
                                    <img 

                                        src="images/images_tour/anh_tour_nuoc_ngoai/malaysia1-6600.jpg" 
                                        alt="MALAYSIA" 
                                    />
                                    <span>MALAYSIA</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <TourSearchFilter />

            {/* Tour trong nước*/}
            <div id="tour">
                <div className="tour">
                    <div className="center">
                        <div className="title-main">
                            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                            <h2>Tour trong nước</h2>
                        </div>
                        <div className="product-content">
                            <div className="product-row">
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="hcm-ninh-binh-ha-long-ha-noi-sapa" title="HCM - Ninh Bình – Sapa">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/chua-bai-dinh-2071-3727.png" alt="HCM - Ninh Bình – Sapa" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR XUYÊN BẮC</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="/toursDetail" 
                                            title="HCM - Ninh Bình – Sapa">KHÁM PHÁ MIỀN BẮC: HCM – NINH BÌNH – SAPA</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />02/08
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="mui-ne-nghi-duong" title="MŨI NÉ - NGHĨ DƯỎNG">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/bau-trang-3808-8465.jpeg" alt="MŨI NÉ - NGHĨ DƯỎNG" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR BÌNH THUẬN</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="mui-ne-nghi-duong" 
                                            title="MŨI NÉ - NGHĨ DƯỎNG">MŨI NÉ - THIÊN ĐƯỜNG NGHỈ DƯỎNG</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />08/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-ha-noi" title="TOUR HÀ NỘI">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/dinh-fansipan-3686-5019.jpg" alt="TOUR HÀ NỘI" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR SA PA</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-ha-noi" 
                                            title="TOUR HÀ NỘI">HÀ NỘI – SAPA: KHÁM PHÁ VÙNG CAO 3 NGÀY 2 ĐÊM</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />2 NGÀY 1 ĐÊM
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />06/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-da-nang" title="TOUR ĐÀ NẴNG">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/cau-vang-3004-2726.jpeg" alt="TOUR ĐÀ NẴNG" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR ĐÀ NẴNG</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-da-nang" 
                                            title="TOUR ĐÀ NẴNG">ĐÀ NẴNG – SƠN TRÀ– HỘI AN – BÀ NÀ</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />4 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />07/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="product-row">
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-sapa" title="QUẢNG BÌNH – QUẢNG TRỊ - HUẾ">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/dong-phong-nha-2-2444-9051.jpeg" alt="QUẢNG BÌNH – QUẢNG TRỊ - HUẾ" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR QUẢNG TRỊ</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-sapa" 
                                            title="TOUR SAPA">QUẢNG BÌNH – QUẢNG TRỊ - HUẾ</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />09/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-halong" title="XỨ SỞ HOA VÀNG TRÊN CỎ XANH PHÚ YÊN - QUY NHƠN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/eo-gio-7064-1969.jpeg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR PHÚ YÊN</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-halong" 
                                            title="TOUR HẠ LONG">XỨ SỞ HOA VÀNG PHÚ YÊN - QUY NHƠN</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />2 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />10/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-nha-trang" title="SĂN MÂY TÀ XUA – BẮC YÊN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/ta-xua-7722-4640.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR HÀ GIANG</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-nha-trang" 
                                            title="TOUR NHA TRANG">SĂN MÂY KỲ THÚ: TÀ XUA – BẮC YÊN</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />11/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-phu-quoc" title="KHÁM PHÁ ĐƯỜNG TRƯỜNG SƠN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_viet_nam/dong-phong-nha-4255-8699.jpeg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR HUẾ</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-phu-quoc" 
                                            title="TOUR PHÚ QUỐC">KHÁM PHÁ ĐƯỜNG TRƯỜNG SƠN</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />4 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />12/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tour ngoài nước */}
            <div className='tour-ngoai-nuoc' id="tour">
                <div className="tour">
                    <div className="center">
                        <div className="title-main">
                            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                            <h2>Tour ngoài nước</h2>
                        </div>
                        <div className="product-content">
                            <div className="product-row">
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" title="PHNOMPENH - VƯỜN CHÙA PUKIRI">
                                            <img className="img-fluid zoom-image" src="./images/images_tour/anh_tour_nuoc_ngoai/campuchia.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR CAMPUCHIA</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="PHNOMPENH - VƯỜN CHÙA PUKIRI" 
                                            title="HCM - Ninh Bình – Sapa">PHNOMPENH - VƯỜN CHÙA PUKIRI</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />2N1Đ
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />02/2025
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" title="TOUR THÁI LAN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_nuoc_ngoai/thailan.jpeg" alt="SA-WA-DEE THAILAND BANGKOK – PATTAYA" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR THÁI LAN</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="mui-ne-nghi-duong" 
                                            title="MŨI NÉ - NGHĨ DƯỎNG">SA-WA-DEE THAILAND BANGKOK – PATTAYA</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />08/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-ha-noi" title="TOUR HÀN QUỐC">
                                            <img className="img-fluid zoom-image" src="./images/images_tour/anh_tour_nuoc_ngoai/cung-dien-gyeongbokgung-4149-6975.jpg" alt="TOUR HÀ NỘI" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR HÀN QUỐC</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-ha-noi" 
                                            title="TOUR HÀ NỘI">HÀN QUỐC - VẺ ĐẸP LÃNG MẠN VÀ YÊN BÌNH</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />2 NGÀY 1 ĐÊM
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />06/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" title="ẤN ĐỘ DELHI – JAIPUR – AGRA">
                                            <img className="img-fluid zoom-image" src="./images/images_tour/anh_tour_nuoc_ngoai/an-1702-3873.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR ẤN ĐỘ</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2">ẤN ĐỘ DELHI – JAIPUR – AGRA</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />4 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />07/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="product-row">
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-sapa" title="Tour Pháp">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_nuoc_ngoai/du-lich-phap-14-10-2017-9-2582.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">Tour Pháp</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-sapa" 
                                            title="TOUR SAPA">VIỆT NAM - PHÁP - THUỴ SỸ - NHỮNG MIỀN ĐẤT DI SẢN</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />09/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-halong" title="XỨ SỞ HOA VÀNG TRÊN CỎ XANH PHÚ YÊN - QUY NHƠN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_nuoc_ngoai/bali-ivivu-13.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR BALI</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-halong" 
                                            title="TOUR HẠ LONG">TOUR BALI - Khám Phá Thiên Đường Nhiệt Đới</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />2 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />10/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-nha-trang" title="SĂN MÂY TÀ XUA – BẮC YÊN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_nuoc_ngoai/Anh - Big Ben.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR LONDON</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-nha-trang" 
                                            title="TOUR NHA TRANG">TOUR LONDON -KHÁM PHÁ THỦ ĐÔ VƯƠNG QUỐC ANH</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />3 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />11/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="product-item">
                                    <div className="product-image">
                                        <a className="scale-img" href="tour-phu-quoc" title="KHÁM PHÁ ĐƯỜNG TRƯỜNG SƠN">
                                            <img className="img-fluid zoom-image" src="images/images_tour/anh_tour_nuoc_ngoai/du-lich-phap-14-10-2017-9-2582.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">Tour Pháp</p>
                                        <h3 className="product-name">
                                            <a className="text-decoration-none text-split text-split-2" 
                                            href="tour-phu-quoc" 
                                            title="TOUR PHÚ QUỐC">VIỆT NAM - PHÁP – THỤY SỸ ( NÚI TITLIS) - Ý – VATICAN</a>
                                        </h3>
                                        <p className="product-info">
                                            <img src="./images/icon-p1.png" alt="Icon product" />4 NGÀY
                                        </p>
                                        <div className="product-info2">
                                            <p className="product-info">
                                                <img src="./images/icon-p2.png" alt="Icon product" />12/2023
                                            </p>
                                            <span className="price-new">Liên hệ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>             
        </div>
    );
}

export default Home;
