// Header.js
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [searchResults, setSearchResults] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Đóng dropdown khi chuyển trang
  useEffect(() => {
    setDomesticDropdownOpen(false);
    setInternationalDropdownOpen(false);
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDomesticDropdownOpen(false);
        setInternationalDropdownOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      setDomesticDropdownOpen(false);
      setInternationalDropdownOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setActiveDropdown(null);
    }
  };

  const handleDropdownItemClick = () => {
    setDomesticDropdownOpen(false);
    setInternationalDropdownOpen(false);
    setActiveDropdown(null);
    setMenuOpen(false);
  };

  const toggleDomesticDropdown = (e) => {
    e.preventDefault();
    setDomesticDropdownOpen(!domesticDropdownOpen);
    setInternationalDropdownOpen(false);
    setActiveDropdown('domestic');
  };

  const toggleInternationalDropdown = (e) => {
    e.preventDefault();
    setInternationalDropdownOpen(!internationalDropdownOpen);
    setDomesticDropdownOpen(false);
    setActiveDropdown('international');
  };

  const getDropdownClass = (type) => {
    const baseClass = type === 'international' ? 'dropdown-menu dropdown-menu2' : 'dropdown-menu';
    const isOpen = type === 'domestic' ? domesticDropdownOpen : internationalDropdownOpen;
    const isActive = activeDropdown === type;
    
    if (isOpen) return `${baseClass} show`;
    if (!isOpen && isActive) return `${baseClass} closing`;
    return baseClass;
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
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ top: 0, width: "100%", zIndex: 1000, position: "sticky" }}
      ref={searchRef}
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
                {isMobile && (
                  <button
                    className={`toggle-btn ${domesticDropdownOpen ? "open" : ""}`}
                    onClick={toggleDomesticDropdown}
                  >
                    <span className="icon-plus"></span>
                    <span className="icon-minus"></span>
                  </button>
                )}
              </div>
              <div
                className={getDropdownClass('domestic')}
                aria-labelledby="navbarDropdownDomestic"
                onAnimationEnd={() => {
                  if (activeDropdown === 'domestic' && !domesticDropdownOpen) {
                    setActiveDropdown(null);
                  }
                }}
              >
                <div className="tour-container">
                  <div className="tour-row">
                    {!isMobile && (
                      <div className="tour-column">
                        <img
                          src="./images/tour-trong-nuoc.jpg"
                          alt="Tour trong nước"
                          className="tour-image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN BẮC</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/23" onClick={handleDropdownItemClick}>TOUR HÀ NỘI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/24" onClick={handleDropdownItemClick}>TOUR HẠ LONG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/25" onClick={handleDropdownItemClick}>TOUR HÀ GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/26" onClick={handleDropdownItemClick}>TOUR SA PA</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN TRUNG</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/27" onClick={handleDropdownItemClick}>TOUR HUẾ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/28" onClick={handleDropdownItemClick}>TOUR QUẢNG TRỊ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/29" onClick={handleDropdownItemClick}>TOUR QUẢNG BÌNH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/59" onClick={handleDropdownItemClick}>TOUR NINH THUẬN</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/60" onClick={handleDropdownItemClick}>TOUR ĐÀ NẴNG</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">MIỀN NAM</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/30" onClick={handleDropdownItemClick}>TOUR CẦN THƠ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/31" onClick={handleDropdownItemClick}>TOUR AN GIANG</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/32" onClick={handleDropdownItemClick}>TOUR CÀ MAU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/33" onClick={handleDropdownItemClick}>TOUR VŨNG TÀU</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/34" onClick={handleDropdownItemClick}>TOUR ĐỒNG THÁP</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/35" onClick={handleDropdownItemClick}>TOUR BẾN TRE</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">TÂY NGUYÊN</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/36" onClick={handleDropdownItemClick}>TOUR GIA LAI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/61" onClick={handleDropdownItemClick}>BUÔN MA THUỘT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/62" onClick={handleDropdownItemClick}>TOUR ĐÀ LẠT</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/63" onClick={handleDropdownItemClick}>TOUR KON TUM</Link>
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
                {isMobile && (
                  <button
                    className={`toggle-btn ${internationalDropdownOpen ? "open" : ""}`}
                    onClick={toggleInternationalDropdown}
                  >
                    <span className="icon-plus"></span>
                    <span className="icon-minus"></span>
                  </button>
                )}
              </div>
              <div
                className={getDropdownClass('international')}
                aria-labelledby="navbarDropdownInternational"
                onAnimationEnd={() => {
                  if (activeDropdown === 'international' && !internationalDropdownOpen) {
                    setActiveDropdown(null);
                  }
                }}
              >
                <div className="tour-container">
                  <div className="tour-row">
                    {!isMobile && (
                      <div className="tour-column">
                        <img
                          src="./images/tour-ngoai-nuoc.jpg"
                          alt="Tour ngoài nước"
                          className="tour-image"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/40" onClick={handleDropdownItemClick}>TOUR BANGKOK</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/41" onClick={handleDropdownItemClick}>TOUR ẤN ĐỘ</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/42" onClick={handleDropdownItemClick}>TOUR PHNOM PENH</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/43" onClick={handleDropdownItemClick}>TOUR HONG KONG</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU Á</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/44" onClick={handleDropdownItemClick}>TOUR BALI</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/45" onClick={handleDropdownItemClick}>TOUR KYOTO</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/46" onClick={handleDropdownItemClick}>TOUR SEOUL</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/47" onClick={handleDropdownItemClick}>TOUR SINGAPORE</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/48" onClick={handleDropdownItemClick}>TOUR PRAGUE</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/49" onClick={handleDropdownItemClick}>TOUR ATHENS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/50" onClick={handleDropdownItemClick}>TOUR PARIS</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/51" onClick={handleDropdownItemClick}>TOUR BARCELONA</Link>
                    </div>
                    <div className="tour-column">
                      <h5 className="tour-title">CHÂU ÂU</h5>
                      <Link className="dropdown-item" to="/chi-tiet-tour/52" onClick={handleDropdownItemClick}>TOUR ROME</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/53" onClick={handleDropdownItemClick}>TOUR LONDON</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/54" onClick={handleDropdownItemClick}>TOUR AMSTERDAM</Link>
                      <Link className="dropdown-item" to="/chi-tiet-tour/55" onClick={handleDropdownItemClick}>TOUR VIENNA</Link>
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