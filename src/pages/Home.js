import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import '../styles/Home.css'; 
import TourSearchFilter from '../components/TourSearchFilter';

function Home() {
  const [domesticTours, setDomesticTours] = useState([]);
  const [asiaTours, setAsiaTours] = useState([]);
  const [europeTours, setEuropeTours] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]); // Thêm state cho tour nổi bật
  const [loadingDomestic, setLoadingDomestic] = useState(true);
  const [loadingAsia, setLoadingAsia] = useState(true);
  const [loadingEurope, setLoadingEurope] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true); // Loading cho tour nổi bật
  const [errorDomestic, setErrorDomestic] = useState(null);
  const [errorAsia, setErrorAsia] = useState(null);
  const [errorEurope, setErrorEurope] = useState(null);
  const [errorFeatured, setErrorFeatured] = useState(null); // Error cho tour nổi bật

  const foreignRegions = ["Châu Á", "Châu Âu"];

  // Fetch tour nổi bật
  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoadingFeatured(true);
        const response = await fetch('http://localhost:5001/api/tours');
        if (!response.ok) throw new Error('Không thể tải dữ liệu tour nổi bật');
        const data = await response.json();
        // Lọc và sắp xếp theo star_rating, lấy 10 tour cao nhất
        const topTours = data
          .sort((a, b) => b.star_rating - a.star_rating)
          .slice(0, 10);
        setFeaturedTours(topTours);
      } catch (err) {
        setErrorFeatured(err.message);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedTours();
  }, []);

  useEffect(() => {
    const fetchDomesticTours = async () => {
      try {
        setLoadingDomestic(true);
        const response = await fetch('http://localhost:5001/api/tours?country=Vietnam');
        if (!response.ok) throw new Error('Không thể tải dữ liệu tour trong nước');
        const data = await response.json();
        setDomesticTours(data);
      } catch (err) {
        setErrorDomestic(err.message);
      } finally {
        setLoadingDomestic(false);
      }
    };
    fetchDomesticTours();
  }, []);

  useEffect(() => {
    const fetchAsiaTours = async () => {
      try {
        setLoadingAsia(true);
        const response = await fetch('http://localhost:5001/api/tours?region=Châu Á');
        if (!response.ok) throw new Error('Không thể tải dữ liệu tour Châu Á');
        const data = await response.json();
        setAsiaTours(data);
      } catch (err) {
        setErrorAsia(err.message);
      } finally {
        setLoadingAsia(false);
      }
    };
    fetchAsiaTours();
  }, []);

  useEffect(() => {
    const fetchEuropeTours = async () => {
      try {
        setLoadingEurope(true);
        const response = await fetch('http://localhost:5001/api/tours?region=Châu Âu');
        if (!response.ok) throw new Error('Không thể tải dữ liệu tour Châu Âu');
        const data = await response.json();
        setEuropeTours(data);
      } catch (err) {
        setErrorEurope(err.message);
      } finally {
        setLoadingEurope(false);
      }
    };
    fetchEuropeTours();
  }, []);

  const renderTourItem = (tour) => {
    const firstImage = tour.images && tour.images.length > 0 
      ? tour.images[0].image_url 
      : '/images/noimage.png';
    const duration = `${tour.days || 0} NGÀY ${tour.nights ? tour.nights + ' ĐÊM' : ''}`;
    const startDate = tour.start_date 
      ? new Date(tour.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Chưa xác định';
    const adultPrice = tour.prices && tour.prices.length > 0 
      ? tour.prices.find(price => price.age_group === 'Adult') 
      : null;
    const priceDisplay = adultPrice 
      ? `${adultPrice.price.toLocaleString('vi-VN')} VNĐ` 
      : 'Liên hệ';
    const regionName = tour.country === 'Vietnam' 
      ? 'VIỆT NAM' 
      : foreignRegions.includes(tour.region) 
        ? tour.region.toUpperCase() 
        : 'NƯỚC NGOÀI';
  
    return (
      <div className="product-item featured-tour-item" key={tour.id}>
        <div className="product-image">
          <Link to={`/chi-tiet-tour/${tour.id}`} title={tour.name}>
            <img 
              className="img-fluid zoom-image" 
              src={firstImage} 
              alt={tour.name || 'Tour không tên'}
              onError={(e) => { e.target.src = '/images/noimage.png'; }}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
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
            <img src="./images/icon-p1.png" alt="Icon product" className="small-icon" />
            {duration}
          </p>
          <div className="product-info2">
            <p className="product-info">
              <img src="./images/icon-p2.png" alt="Icon product" className="small-icon" />
              {startDate}
            </p>
            <p className="price-label">
              Giá: <span className="price-new">{priceDisplay}</span>
            </p>
          </div>
          <div className="star-rating">
            Đánh giá: {'★'.repeat(tour.star_rating || 0)}{'☆'.repeat(5 - (tour.star_rating || 0))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
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
            <img src="./images/demo2.jpeg" alt="Slide 1" onError={(e) => { e.target.src = '/images/noimage.png'; }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="./images/demo3.jpeg" alt="Slide 2" onError={(e) => { e.target.src = '/images/noimage.png'; }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src="./images/demo4.jpeg" alt="Slide 3" onError={(e) => { e.target.src = '/images/noimage.png'; }} />
          </SwiperSlide>
        </Swiper>
      </div>

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
                  src="/images/logo.png" 
                  alt="SKY TRAVEL"
                  onError={(e) => { e.target.src = '/images/noimage.png'; }}
                  style={{ width: '100%', height: 'auto' }}
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
                  <img src="/images/images_tour/anh_tour_nuoc_ngoai/ban-sao-bangkok-6202.png" alt="THÁI LAN" />
                  <span>THÁI LAN</span>
                </div>
              </div>
            </div>
            <div className="country-items">
              <div className="scale-img">
                <div className="image-container">
                  <img src="/images/images_tour/anh_tour_nuoc_ngoai/cung-9276-1653564521-4500.jpg" alt="HÀN QUỐC" />
                  <span>HÀN QUỐC</span>
                </div>
              </div>
            </div>
            <div className="country-items">
              <div className="scale-img">
                <div className="image-container">
                  <img src="/images/images_tour/anh_tour_nuoc_ngoai/nhat-ban-2265.jpg" alt="NHẬT BẢN" />
                  <span>NHẬT BẢN</span>
                </div>
              </div>
            </div>
            <div className="country-items">
              <div className="scale-img">
                <div className="image-container">
                  <img src="/images/images_tour/anh_tour_nuoc_ngoai/sin-5060.jpg" alt="SINGAPORE" />
                  <span>SINGAPORE</span>
                </div>
              </div>
            </div>
            <div className="country-items">
              <div className="scale-img">
                <div className="image-container">
                  <img src="/images/images_tour/anh_tour_viet_nam/ba-na1-2013.jpg" alt="VIỆT NAM" />
                  <span>VIỆT NAM</span>
                </div>
              </div>
            </div>
            <div className="country-items">
              <div className="scale-img">
                <div className="image-container">
                  <img src="/images/images_tour/anh_tour_nuoc_ngoai/malaysia1-6600.jpg" alt="MALAYSIA" />
                  <span>MALAYSIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm section Tour Nổi Bật */}
      <div id="featured-tours" className="tour">
        <div className="center">
          <div className="title-main">
            <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
            <h2>Tour Nổi Bật</h2>
          </div>
          <div className="featured-tours-slider">
            {loadingFeatured ? (
              <div>Đang tải dữ liệu...</div>
            ) : errorFeatured ? (
              <div>Có lỗi xảy ra: {errorFeatured}</div>
            ) : featuredTours.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true} // Đã có, giữ nguyên để căn giữa
                slidesPerView={3}
                spaceBetween={30}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                  320: { 
                    slidesPerView: 1,
                    spaceBetween: 0, // Giảm khoảng cách để căn giữa tốt hơn
                    centeredSlides: true // Đảm bảo căn giữa trên mobile
                  },
                  768: { 
                    slidesPerView: 2,
                    spaceBetween: 20
                  },
                  1024: { 
                    slidesPerView: 3,
                    spaceBetween: 30
                  },
                }}
              >
                {featuredTours.map((tour) => (
                  <SwiperSlide key={tour.id}>
                    {renderTourItem(tour)}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div>Không có tour nổi bật nào để hiển thị.</div>
            )}
          </div>
        </div>
      </div>

      {/* Thêm id vào TourSearchFilter */}
      <div id="tour-search-section">
        <TourSearchFilter />
      </div>

      <div id="tour">
        <div className="tour">
          <div className="center">
            <div className="title-main">
              <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
              <h2>Tour trong nước</h2>
            </div>
            <div className="product-content">
              {loadingDomestic ? (
                <div>Đang tải dữ liệu...</div>
              ) : errorDomestic ? (
                <div>Có lỗi xảy ra: {errorDomestic}</div>
              ) : domesticTours.length > 0 ? (
                <div className="product-row">
                  {domesticTours.map(tour => renderTourItem(tour))}
                </div>
              ) : (
                <div>Không có tour trong nước nào để hiển thị.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tour-chau-a" id="tour">
        <div className="tour">
          <div className="center">
            <div className="title-main">
              <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
              <h2>Tour Châu Á</h2>
            </div>
            <div className="product-content">
              {loadingAsia ? (
                <div>Đang tải dữ liệu...</div>
              ) : errorAsia ? (
                <div>Có lỗi xảy ra: {errorAsia}</div>
              ) : asiaTours.length > 0 ? (
                <div className="product-row">
                  {asiaTours.map(tour => renderTourItem(tour))}
                </div>
              ) : (
                <div>Không có tour Châu Á nào để hiển thị.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tour-chau-au" id="tour">
        <div className="tour">
          <div className="center">
            <div className="title-main">
              <p>Lập kế hoạch chuyến đi của bạn cùng chúng tôi</p>
              <h2>Tour Châu Âu</h2>
            </div>
            <div className="product-content">
              {loadingEurope ? (
                <div>Đang tải dữ liệu...</div>
              ) : errorEurope ? (
                <div>Có lỗi xảy ra: {errorEurope}</div>
              ) : europeTours.length > 0 ? (
                <div className="product-row">
                  {europeTours.map(tour => renderTourItem(tour))}
                </div>
              ) : (
                <div>Không có tour Châu Âu nào để hiển thị.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;