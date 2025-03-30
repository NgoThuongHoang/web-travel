import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import '../styles/Home.css'; 
import TourSearchFilter from '../components/TourSearchFilter';

function Home() {
    const [domesticTours, setDomesticTours] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const [error, setError] = useState(null);

    // Hàm fetch dữ liệu tour từ API
    useEffect(() => {
        const fetchDomesticTours = async () => {
            try {
                setLoading(true); // Bắt đầu loading
                const response = await fetch('http://localhost:5001/api/tours?region=Vietnam');
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu tour');
                }
                const data = await response.json();
                setDomesticTours(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
        fetchDomesticTours();
    }, []);

    // Hàm render tour item
    const renderTourItem = (tour) => {
        const firstImage = tour.images && tour.images.length > 0 
            ? tour.images[0].image_url 
            : 'images/noimage.png';
        
        const duration = `${tour.days || 0} NGÀY ${tour.nights ? tour.nights + ' ĐÊM' : ''}`;
        const startDate = tour.start_date 
            ? new Date(tour.start_date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) 
            : 'Chưa xác định';

        // Lấy giá tour người lớn (Adult)
        const adultPrice = tour.prices && tour.prices.length > 0 
            ? tour.prices.find(price => price.age_group === 'Adult') 
            : null;
        
        const priceDisplay = adultPrice 
            ? `${adultPrice.price.toLocaleString('vi-VN')} VNĐ` 
            : 'Liên hệ';

        // Lấy region từ tour, mặc định là 'VIỆT NAM' nếu không có
        const regionName = tour.region ? tour.region.toUpperCase() : 'VIỆT NAM';

        return (
            <div className="product-item" key={tour.id}>
                <div className="product-image">
                    <Link to={`/chi-tiet-tour/${tour.id}`} title={tour.name}>
                        <img 
                            className="img-fluid zoom-image" 
                            src={firstImage} 
                            alt={tour.name || 'Tour không tên'}
                            onError={(e) => { e.target.src = 'images/noimage.png'; }}
                            style={{ 
                                width: '100%', 
                                height: '200px',
                                objectFit: 'cover'
                            }}
                        />
                    </Link>
                </div>
                <div className="product-desc">
                    <p className="product-item-name">TOUR {regionName}</p>
                    <h3 className="product-name">
                        <Link 
                            className="text-decoration-none text-split text-split-2 tour-name-link"
                            to={`/chi-tiet-tour/${tour.id}`}
                            title={tour.name}
                        >
                            {tour.name || 'Chưa có tên tour'}
                        </Link>
                    </h3>
                    <p className="product-info">
                        <img src="./images/icon-p1.png" alt="Icon product" />
                        {duration}
                    </p>
                    <div className="product-info2">
                        <p className="product-info">
                            <img src="./images/icon-p2.png" alt="Icon product" />
                            {startDate}
                        </p>
                        <span className="price-new">
                            {priceDisplay}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Slideshow */}
            <div className="slideshow">
                <Swiper
                    spaceBetween={0}
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
                <div className="center">
                    <div className="intro-title">
                        <div className="title-main" id="intro">
                            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                            <h2>Giới thiệu về Công ty TNHH Du lịch Sky Travel</h2>
                        </div>
                    </div>
                    <div className="intro-container">
                        <div className="intro-left">
                            <Link to="/gioi-thieu" className="scale-img intro-image">
                                <img 
                                    src="/images/logo.png" // Sửa đường dẫn logo
                                    alt="SKY TRAVEL"
                                    onError={(e) => { e.target.src = '/images/noimage.png'; }}
                                    style={{ width: '100%', height: 'auto' }} // Đảm bảo logo hiển thị đúng tỷ lệ
                                />
                            </Link>
                        </div>
                        <div className="intro-right">
                            <h2 className="intro-name">SKY TRAVEL</h2>
                            <p className="intro-info">
                                SKY TRAVEL là một doanh nghiệp hoạt động trong lĩnh vực du lịch có uy tín với những sản phẩm chủ lực như Voucher nghỉ dưỡng của FLC, Vinpearl, Flamingo.... 
                                Ngoài ra chúng tôi còn có nhiều thế mạnh về du lịch trong và ngoài nước, đặt vé máy bay giá rẻ, hội thảo và sự kiện, hoạt động team building, cho thuê xe du lịch...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* country */}
            <div id="country">
                <div className="center">
                    <div className="title-main">
                        <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                        <h2>Các quốc gia</h2>
                    </div>
                    <div className="country-grid">
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_nuoc_ngoai/ban-sao-bangkok-6202.png" 
                                        alt="THÁI LAN" 
                                    />
                                    <span>THÁI LAN</span>
                                </div>
                            </div>
                        </div>
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_nuoc_ngoai/cung-9276-1653564521-4500.jpg" 
                                        alt="HÀN QUỐC" 
                                    />
                                    <span>HÀN QUỐC</span>
                                </div>
                            </div>
                        </div>
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_nuoc_ngoai/nhat-ban-2265.jpg" 
                                        alt="NHẬT BẢN" 
                                    />
                                    <span>NHẬT BẢN</span>
                                </div>
                            </div>
                        </div>
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_nuoc_ngoai/sin-5060.jpg" 
                                        alt="SINGAPORE" 
                                    />
                                    <span>SINGAPORE</span>
                                </div>
                            </div>
                        </div>
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_viet_nam/ba-na1-2013.jpg" 
                                        alt="VIỆT NAM" 
                                    />
                                    <span>VIỆT NAM</span>
                                </div>
                            </div>
                        </div>
                        <div className="country-items">
                            <div className="scale-img">
                                <div className="image-container">
                                    <img 
                                        src="/images/images_tour/anh_tour_nuoc_ngoai/malaysia1-6600.jpg" 
                                        alt="MALAYSIA" 
                                    />
                                    <span>MALAYSIA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <TourSearchFilter />

            {/* Tour trong nước */}
            <div id="tour">
                <div className="tour">
                    <div className="center">
                        <div className="title-main">
                            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
                            <h2>Tour trong nước</h2>
                        </div>
                        <div className="product-content">
                            {loading ? (
                                <div>Đang tải dữ liệu...</div>
                            ) : error ? (
                                <div>Có lỗi xảy ra: {error}</div>
                            ) : (
                                <div className="product-row">
                                    {domesticTours.map(tour => renderTourItem(tour))}
                                </div>
                            )}
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
                                        <Link to="/phnompenh-vuon-chua-pukiri" title="PHNOMPENH - VƯỜN CHÙA PUKIRI">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/campuchia.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR CAMPUCHIA</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/phnompenh-vuon-chua-pukiri" 
                                                title="PHNOMPENH - VƯỜN CHÙA PUKIRI"
                                            >
                                                PHNOMPENH - VƯỜN CHÙA PUKIRI
                                            </Link>
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
                                        <Link to="/mui-ne-nghi-duong" title="TOUR THÁI LAN">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/thailan.jpeg" alt="SA-WA-DEE THAILAND BANGKOK – PATTAYA" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR THÁI LAN</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/mui-ne-nghi-duong" 
                                                title="SA-WA-DEE THAILAND BANGKOK – PATTAYA"
                                            >
                                                SA-WA-DEE THAILAND BANGKOK – PATTAYA
                                            </Link>
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
                                        <Link to="/tour-ha-noi" title="TOUR HÀN QUỐC">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/cung-dien-gyeongbokgung-4149-6975.jpg" alt="TOUR HÀN QUỐC" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR HÀN QUỐC</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/tour-ha-noi" 
                                                title="HÀN QUỐC - VẺ ĐẸP LÃNG MẠN VÀ YÊN BÌNH"
                                            >
                                                HÀN QUỐC - VẺ ĐẸP LÃNG MẠN VÀ YÊN BÌNH
                                            </Link>
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
                                        <Link to="/an-do-delhi-jaipur-agra" title="ẤN ĐỘ DELHI – JAIPUR – AGRA">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/an-1702-3873.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR ẤN ĐỘ</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/an-do-delhi-jaipur-agra" 
                                                title="ẤN ĐỘ DELHI – JAIPUR – AGRA"
                                            >
                                                ẤN ĐỘ DELHI – JAIPUR – AGRA
                                            </Link>
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
                                        <Link to="/tour-sapa" title="Tour Pháp">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/du-lich-phap-14-10-2017-9-2582.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">Tour Pháp</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/tour-sapa" 
                                                title="VIỆT NAM - PHÁP - THUỴ SỸ - NHỮNG MIỀN ĐẤT DI SẢN"
                                            >
                                                VIỆT NAM - PHÁP - THUỴ SỸ - NHỮNG MIỀN ĐẤT DI SẢN
                                            </Link>
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
                                        <Link to="/tour-halong" title="TOUR BALI">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/bali-ivivu-13.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR BALI</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/tour-halong" 
                                                title="TOUR BALI - Khám Phá Thiên Đường Nhiệt Đới"
                                            >
                                                TOUR BALI - Khám Phá Thiên Đường Nhiệt Đới
                                            </Link>
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
                                        <Link to="/tour-nha-trang" title="TOUR LONDON">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/Anh - Big Ben.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">TOUR LONDON</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/tour-nha-trang" 
                                                title="TOUR LONDON -KHÁM PHÁ THỦ ĐÔ VƯƠNG QUỐC ANH"
                                            >
                                                TOUR LONDON -KHÁM PHÁ THỦ ĐÔ VƯƠNG QUỐC ANH
                                            </Link>
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
                                        <Link to="/tour-phu-quoc" title="Tour Pháp">
                                            <img className="img-fluid zoom-image" src="/images/images_tour/anh_tour_nuoc_ngoai/du-lich-phap-14-10-2017-9-2582.jpg" />
                                        </Link>
                                    </div>
                                    <div className="product-desc">
                                        <p className="product-item-name">Tour Pháp</p>
                                        <h3 className="product-name">
                                            <Link 
                                                className="text-decoration-none text-split text-split-2 tour-name-link" 
                                                to="/tour-phu-quoc" 
                                                title="VIỆT NAM - PHÁP – THỤY SỸ ( NÚI TITLIS) - Ý – VATICAN"
                                            >
                                                VIỆT NAM - PHÁP – THỤY SỸ ( NÚI TITLIS) - Ý – VATICAN
                                            </Link>
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