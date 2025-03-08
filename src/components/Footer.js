import React from 'react';

function Footer() {
    return (
        <div id="footer" style={{ backgroundImage: "url('./images/bg-footer.jpg')", backgroundSize: 'cover' }}>
            <div className="footer-top py-4">
                <div className="container d-flex flex-wrap align-items-start justify-content-between">
                    <div className="footer-1 col-md-3">
                        <h5 className="footer-tit2">Biên Hoà Star Travel</h5>
                        <div className="footer-content">
                            <p>Địa chỉ: Số 112, KDC Võ Thị Sáu, KP7, Phường Thống Nhất, Tp.Biên Hoà, T.Đồng Nai</p>
                            <p>Hotline: 0939.390.707</p>
                            <p>Email: bienhoastar.travel@gmail.com</p>
                            <p>Website: <a href="http://bienhoastartravel.com" className="text-decoration-none">bienhoastartravel.com</a></p>
                        </div>
                    </div>

                    <div className="footer-2 col-md-3">
                        <h5 className="footer-tit">Dịch vụ</h5>
                        <ul className="footer-list list-unstyled">
                            <li><a className="text-decoration-none" href="tour-ngan-ngay" title="Tour ngắn ngày">Tour ngắn ngày</a></li>
                        </ul>
                    </div>

                    <div className="footer-3 col-md-3">
                        <h5 className="footer-tit">Góc khách hàng</h5>
                        <ul className="footer-list list-unstyled">
                            <li><a className="text-decoration-none" href="ho-tro-dat-hang" title="Hỗ trợ đặt hàng">Hỗ trợ đặt hàng</a></li>
                            <li><a className="text-decoration-none" href="chinh-sach-tra-hang" title="Chính sách trả hàng">Chính sách trả hàng</a></li>
                            <li><a className="text-decoration-none" href="chinh-sach-bao-hanh" title="Chính sách bảo hành">Chính sách bảo hành</a></li>
                        </ul>
                    </div>

                    <div className="footer-4">
                        <p className="footer-tit">FANPAGE FACEBOOK</p>
                        <div id="fanpage-facebook">
                            <div className="fb-page" 
                                data-href="https://www.facebook.com/bienhoastartravel"
                                data-tabs="timeline" 
                                data-width="600" 
                                data-height="200" 
                                data-small-header="true" 
                                data-adapt-container-width="true" 
                                data-hide-cover="false" 
                                data-show-facepile="true">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom py-2">
                <div className="container text-center">
                    <p className="copyright m-0">Copyright &copy; 2024. Design by <a href="https://vinasoftware.com.vn/" className="text-decoration-none">Student DNTU</a></p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
