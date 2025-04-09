import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "antd";
import "../styles/Header.css";
import "antd/dist/reset.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [domesticDropdownOpen, setDomesticDropdownOpen] = useState(false);
  const [internationalDropdownOpen, setInternationalDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767); // Thêm state kiểm tra mobile
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDomesticDropdownOpen(false);
        setInternationalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      setDomesticDropdownOpen(false);
      setInternationalDropdownOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const toggleDomesticDropdown = (e) => {
    e.preventDefault();
    setDomesticDropdownOpen(!domesticDropdownOpen);
    setInternationalDropdownOpen(false);
  };

  const toggleInternationalDropdown = (e) => {
    e.preventDefault();
    setInternationalDropdownOpen(!internationalDropdownOpen);
    setDomesticDropdownOpen(false);
  };

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      const searchSection = document.getElementById("tour-search-section");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.scrollBy({ top: 150, behavior: "smooth" });
        }, 500);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const searchSection = document.getElementById("tour-search-section");
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            window.scrollBy({ top: 150, behavior: "smooth" });
          }, 500);
        }
      }, 100);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const allTours = [
      { id: 23, name: "TOUR HÀ NỘI", link: "/chi-tiet-tour/23" },
      { id: 24, name: "TOUR HẠ LONG", link: "/chi-tiet-tour/24" },
      { id: 25, name: "TOUR HÀ GIANG", link: "/chi-tiet-tour/25" },
      { id: 26, name: "TOUR SA PA", link: "/chi-tiet-tour/26" },
      { id: 27, name: "TOUR HUẾ", link: "/chi-tiet-tour/27" },
      { id: 28, name: "TOUR QUẢNG TRỊ", link: "/chi-tiet-tour/28" },
      { id: 29, name: "TOUR QUẢNG BÌNH", link: "/chi-tiet-tour/29" },
      { id: 59, name: "TOUR NINH THUẬN", link: "/chi-tiet-tour/59" },
      { id: 60, name: "TOUR ĐÀ NẴNG", link: "/chi-tiet-tour/60" },
      { id: 30, name: "TOUR CẦN THƠ", link: "/chi-tiet-tour/30" },
      { id: 31, name: "TOUR AN GIANG", link: "/chi-tiet-tour/31" },
      { id: 32, name: "TOUR CÀ MAU", link: "/chi-tiet-tour/32" },
      { id: 33, name: "TOUR VŨNG TÀU", link: "/chi-tiet-tour/33" },
      { id: 34, name: "TOUR ĐỒNG THÁP", link: "/chi-tiet-tour/34" },
      { id: 35, name: "TOUR BẾN TRE", link: "/chi-tiet-tour/35" },
      { id: 36, name: "TOUR GIA LAI", link: "/chi-tiet-tour/36" },
      { id: 61, name: "BUÔN MA THUỘT", link: "/chi-tiet-tour/61" },
      { id: 62, name: "TOUR ĐÀ LẠT", link: "/chi-tiet-tour/62" },
      { id: 63, name: "TOUR KON TUM", link: "/chi-tiet-tour/63" },
      { id: 40, name: "TOUR BANGKOK", link: "/chi-tiet-tour/40" },
      { id: 41, name: "TOUR ẤN ĐỘ", link: "/chi-tiet-tour/41" },
      { id: 42, name: "TOUR PHNOM PENH", link: "/chi-tiet-tour/42" },
      { id: 43, name: "TOUR HONG KONG", link: "/chi-tiet-tour/43" },
      { id: 44, name: "TOUR BALI", link: "/chi-tiet-tour/44" },
      { id: 45, name: "TOUR KYOTO", link: "/chi-tiet-tour/45" },
      { id: 46, name: "TOUR SEOUL", link: "/chi-tiet-tour/46" },
      { id: 47, name: "TOUR SINGAPORE", link: "/chi-tiet-tour/47" },
      { id: 48, name: "TOUR PRAGUE", link: "/chi-tiet-tour/48" },
      { id: 49, name: "TOUR ATHENS", link: "/chi-tiet-tour/49" },
      { id: 50, name: "TOUR PARIS", link: "/chi-tiet-tour/50" },
      { id: 51, name: "TOUR BARCELONA", link: "/chi-tiet-tour/51" },
      { id: 52, name: "TOUR ROME", link: "/chi-tiet-tour/52" },
      { id: 53, name: "TOUR LONDON", link: "/chi-tiet-tour/53" },
      { id: 54, name: "TOUR AMSTERDAM", link: "/chi-tiet-tour/54" },
      { id: 55, name: "TOUR VIENNA", link: "/chi-tiet-tour/55" },
    ];

    if (query) {
      const results = allTours.filter((tour) =>
        tour.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Có thể thêm logic tìm kiếm chi tiết hơn nếu cần
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ top: 0, width: "100%", zIndex: 1000, position: "sticky" }}
    >
      <div className="container" style={{ padding: "0px", height: "80px" }}>
        <a className="navbar-brand logo" href="/">
          <img
            onError={(e) => {
              e.target.src = "thumbs/170x85x2/assets/images/noimage.png";
            }}
            src="./images/logo.png"
            alt="Công ty TNHH Du lịch Ngôi Sao Biên Hoà"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            <li className="nav-item search-item">
              <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Tìm tour du lịch..."
                  className="search-input"
                  aria-label="Tìm tour du lịch"
                />
                <button type="submit" className="search-btn">
                  <span className="icon icon-search"></span>
                </button>
              </form>
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((tour) => (
                    <li key={tour.id}>
                      <Link to={tour.link} onClick={toggleMenu}>
                        {tour.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/" title="Trang chủ" onClick={toggleMenu}>
                <i className="fas fa-home" style={{ marginRight: "5px" }}></i> TRANG CHỦ
              </a>
            </li>
            <li className="nav-item dropdown">
              <div className="nav-has-sublist">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  onClick={toggleDomesticDropdown}
                  aria-expanded={domesticDropdownOpen}
                >
                  TOUR TRONG NƯỚC
                </a>
                
              </div>
              <div
                className={`dropdown-menu ${domesticDropdownOpen ? "show" : ""}`}
                aria-labelledby="navbarDropdownDomestic"
              >
                <div className="tour-container">
                  <div className="tour-row">
                  {!isMobile && ( // Chỉ hiển thị cột ảnh nếu không phải mobile
                      <div className="tour-column">
                        <img
                          src="./images/tour-trong-nuoc.jpg"
                          alt="Tour trong nước"
                          className="tour-image"
                        />  
                      </div>
                    )}
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN BẮC</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/23" onClick={toggleMenu}>TOUR HÀ NỘI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/24" onClick={toggleMenu}>TOUR HẠ LONG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/25" onClick={toggleMenu}>TOUR HÀ GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/26" onClick={toggleMenu}>TOUR SA PA</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN TRUNG</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/27" onClick={toggleMenu}>TOUR HUẾ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/28" onClick={toggleMenu}>TOUR QUẢNG TRỊ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/29" onClick={toggleMenu}>TOUR QUẢNG BÌNH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/59" onClick={toggleMenu}>TOUR NINH THUẬN</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/60" onClick={toggleMenu}>TOUR ĐÀ NẴNG</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN NAM</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/30" onClick={toggleMenu}>TOUR CẦN THƠ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/31" onClick={toggleMenu}>TOUR AN GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/32" onClick={toggleMenu}>TOUR CÀ MAU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/33" onClick={toggleMenu}>TOUR VŨNG TÀU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/34" onClick={toggleMenu}>TOUR ĐỒNG THÁP</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/35" onClick={toggleMenu}>TOUR BẾN TRE</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">TÂY NGUYÊN</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/36" onClick={toggleMenu}>TOUR GIA LAI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/61" onClick={toggleMenu}>BUÔN MA THUỘT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/62" onClick={toggleMenu}>TOUR ĐÀ LẠT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/63" onClick={toggleMenu}>TOUR KON TUM</Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown">
              <div className="nav-has-sublist">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  onClick={toggleInternationalDropdown}
                  aria-expanded={internationalDropdownOpen}
                >
                  TOUR NGOÀI NƯỚC
                </a>              
              </div>
              <div
                className={`dropdown-menu dropdown-menu2 ${internationalDropdownOpen ? "show" : ""}`}
                aria-labelledby="navbarDropdownInternational"
              >
                <div className="tour-container">
                  <div className="tour-row">
                  {!isMobile && ( // Chỉ hiển thị cột ảnh nếu không phải mobile
                      <div className="tour-column">
                        <img
                          src="./images/tour-ngoai-nuoc.jpg"
                          alt="Tour ngoai nước"
                          className="tour-image"
                        />
                      </div>
                    )}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/40" onClick={toggleMenu}>TOUR BANGKOK</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/41" onClick={toggleMenu}>TOUR ẤN ĐỘ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/42" onClick={toggleMenu}>TOUR PHNOM PENH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/43" onClick={toggleMenu}>TOUR HONG KONG</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/44" onClick={toggleMenu}>TOUR BALI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/45" onClick={toggleMenu}>TOUR KYOTO</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/46" onClick={toggleMenu}>TOUR SEOUL</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/47" onClick={toggleMenu}>TOUR SINGAPORE</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/48" onClick={toggleMenu}>TOUR PRAGUE</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/49" onClick={toggleMenu}>TOUR ATHENS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/50" onClick={toggleMenu}>TOUR PARIS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/51" onClick={toggleMenu}>TOUR BARCELONA</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/52" onClick={toggleMenu}>TOUR ROME</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/53" onClick={toggleMenu}>TOUR LONDON</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/54" onClick={toggleMenu}>TOUR AMSTERDAM</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/55" onClick={toggleMenu}>TOUR VIENNA</Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/ve-chung-toi" title="Về chúng tôi" onClick={toggleMenu}>
                VỀ CHÚNG TÔI
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tin-tuc" title="Tin tức" onClick={toggleMenu}>
                TIN TỨC
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/lien-he" title="Liên hệ" onClick={toggleMenu}>
                LIÊN HỆ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tour-info-page" title="Tra cứu" onClick={toggleMenu}>
                TRA CỨU
              </a>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link"
                onClick={handleSearchClick}
                style={{ fontSize: "18px", marginTop: "2px" }}
              >
                <i className="fas fa-search"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;