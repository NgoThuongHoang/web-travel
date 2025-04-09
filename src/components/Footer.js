import '../styles/Footer.css';

const Footer = () => {
  return (
    <div className="mainFoot">
      <div className="row mb">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="addressFoot">
              <div className="title">CÔNG TY CỔ PHẦN DU LỊCH SKY TRAVEL</div>
              <div className="be">
                <strong>Địa chỉ</strong>: Kp5, Đ. Nguyễn Khuyến, P. Trảng Dài, Tp. Biên Hoà, T. Đồng Nai.
              </div>
              <div className="be">
                <strong>Văn phòng</strong>:{" "}
                <a href="https://maps.app.goo.gl/RNNucSf5YJ62hqe17" target="_blank" rel="noopener noreferrer">
                Tầng 11, The Pegasus Plaza, 53-55 Đ. Võ Thị Sáu, Quyết Thắng, Biên Hòa, Đồng Nai, Việt Nam.             
                </a>
              </div>
              <div className="be">
                <strong>Điện thoại</strong>: <a href="tel:02873056789">028 73056789</a> |{" "}
                <strong>Hotline</strong>: <a href="tel:19001177">1900 1177</a>
              </div>
              <div className="be">
                <strong>Website</strong>:{" "}
                <a href="https://dulichsieure.top">dulichsieure.top</a> |{" "}
                <strong>Email</strong>:{" "}
                <a href="mailto:skytraveldntu@gmail.com">skytraveldntu@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 hidden-sm hidden-xs">
          <div className="boxBot">
            <div className="title">Góc khách hàng</div>
            <div className="content">
              <div className="botLink">
                <ul>
                  <li>
                    <a href="//dulichviet.com.vn/tin-tuc/dieu-khoan-dieu-kien">Chính sách đặt tour</a>
                  </li>
                  <li>
                    <a href="//dulichviet.com.vn/tin-tuc/chinh-sach-bao-mat-thong-tin-khach-hang">
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li>
                    <a href="//dulichviet.com.vn/khach-hang">Ý kiến khách hàng</a>
                  </li>
                  <li>
                    <a href="//dulichviet.com.vn/gop-y">Phiếu góp ý</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="title">Chứng nhận</div>
            <div className="content">
              <div className="dmca">
                <img
                  className="lazyload"
                  alt="DMCA.com"
                  width="135"
                  height="28"
                  src="//dulichviet.com.vn/images/dmca.png"
                />
              </div>
              <div className="congthuong">
                <a href="http://online.gov.vn/Home/WebDetails/1977" title="BỘ CÔNG THƯƠNG" target="_blank" rel="noopener noreferrer">
                  <img
                    className="lazyload"
                    alt="BỘ CÔNG THƯƠNG"
                    width="120"
                    height="44"
                    src="//dulichviet.com.vn/images/congthuong.png"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="title">Đăng ký nhận thông tin khuyến mãi</div>
            <div className="content">
              <div className="formRecive">
                <div className="txt">
                  Nhập email để có cơ hội giảm 50% cho chuyến đi tiếp theo của Quý khách
                </div>
                <div className="form">
                  <form className="mda-mail-box">
                    <input
                      name="femail"
                      id="femail"
                      className="mda-text"
                      type="text"
                      placeholder="Email của bạn"
                    />
                    <input type="hidden" name="f_trap" id="f_trap" value="th82fnh458iv00gnnb04ktmsm4" />
                    <button type="button" aria-label="Đăng ký nhận tin">
                      <i className="fa fa-envelope"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="congthuongTxt">
              <strong>GIẤY PHÉP KINH DOANH DỊCH VỤ LỮ HÀNH QUỐC TẾ</strong>
              <br />
              Số GP/ No: 79-042/2022/ TCDL – GP LHQT
              <br />
              Do TCDL cấp ngày 30/11/2009 - Cấp thay đổi ngày 06/06/2022
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="title">Kết nối với chúng tôi</div>
              <div className="content">
                <div className="socialFoot">
                  <ul>
                    <li>
                    <a 
                      href="https://www.facebook.com/dulichviet/" 
                      aria-label="Facebook" 
                      className="fab fa-facebook-f" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    ></a>                    
                    </li>
                    <li>
                    <a 
                      href="https://x.com/ctyDuLichViet" 
                      aria-label="Twitter" 
                      className="fab fa-twitter" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    ></a>                                
                    </li>
                    <li>
                    <a 
                      href="https://www.youtube.com/user/dulichviettravel" 
                      aria-label="YouTube" 
                      className="fab fa-youtube" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    ></a>         
                    </li>
                    <li>
                    <a 
                      href="https://dulichviet.com.vn/view360/" 
                      aria-label="Google Maps" 
                      className="fas fa-map-marker-alt" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    ></a>
                    </li>
                  </ul>
                </div>
              </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="title">Chấp nhận thanh toán</div>
            <div className="content">
              <div className="pay">
                <img
                  className="lazyload"
                  alt="PAYMENT"
                  width="163"
                  height="35"
                  src="//dulichviet.com.vn/images/pay.png"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <div className="boxBot">
            <div className="title">Ứng dụng di động</div>
            <div className="content">
              <div className="appstore">
                <img
                  className="lazyload"
                  alt="Appstore"
                  width="211"
                  height="35"
                  src="//dulichviet.com.vn/images/app.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright">
        <div className="copy">
          Copyright © 2025 <strong>SKY TRAVEL</strong>
        </div>
        Ghi rõ nguồn "dulichsieure.top" khi sử dụng thông tin từ website này
      </div>
    </div>
  );
};

export default Footer;