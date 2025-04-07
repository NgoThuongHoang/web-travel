import React from "react";
import "../styles/NewsDetail.css";

function News2() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    return (
        <div className="news-detail-container">
            <h1 className="news-title ">
                Review các điểm du lịch nghỉ dưỡng miền Bắc dịp 30/4 đẹp như mơ
            </h1>

            {/* Menu */}
            <nav className="news-nav">
                <p className="news-nav-title">Mục lục bài viết:</p>
                <ul>
                    <li>
                        <a href="#news-coto">1. Thiên đường biển đảo Cô Tô</a>
                    </li>
                    <li>
                        <a href="#news-halong">
                            2. Kỳ quan thiên nhiên Hạ Long
                        </a>
                    </li>
                    <li>
                        <a href="#news-catba">3. Đảo Ngọc Cát Bà</a>
                    </li>
                    <li>
                        <a href="#news-trangan">4. Di sản Tràng An</a>
                    </li>
                    <li>
                        <a href="#news-dongmo">5. Đồng Mô</a>
                    </li>
                </ul>
            </nav>

            <p className="news-paragraph">
                Năm nay, kỳ nghỉ lễ 30/4 và 1/5 kéo dài 4 ngày là dịp đặc biệt
                để tạm rời xa không khí ồn ào, náo nhiệt nơi thành thị để làm
                làm một chuyến “đi trốn” đúng nghĩa cùng người thân, bạn bè. Nếu
                bạn đang ở khu vực miền Bắc thì hãy note lại danh sách các địa
                điểm du lịch hay khu nghỉ dưỡng xịn sò nằm không xa Hà Nội này
                nhé.
            </p>

            {/* Thiên đường biển đảo Cô Tô */}
            <div>
                <h2 id="news-coto" className="news-subtitle ">
                    1. Thiên đường biển đảo Cô Tô
                </h2>

                <p className="news-paragraph">
                    Vào thời điểm đầu hè nóng bức, biển đảo luôn là lựa chọn du
                    lịch của nhiều người vì mang lại làn gió mát mẻ, cảnh quan
                    rộng mở với sức hấp dẫn khó cưỡng. Nếu miền Nam có đảo Phú
                    Quốc, Côn Đảo, Nam Du, biển Vũng Tàu, Long Hải, miền Trung
                    có Nha Trang, Bình Ba, Phan Thiết thì miền Bắc gọi tên Cô
                    Tô, Hạ Long, Cát Bà.
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news2-coto.jpg"
                        alt="Check in Đảo ngọc Cô Tô. Ảnh: chudu24"
                    />
                    <figcaption className="image-caption">
                        Check in Đảo ngọc Cô Tô. Ảnh: chudu24
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Hòn đảo xinh đẹp mang không khí thanh sạch, trong lành và
                    yên ả. Du khách đến đây tha hồ dạo bước giữa những bãi biển
                    cát mịn như bãi Tình Yêu, bãi Hồng Vàn, Vàn Chảy, Cô Tô
                    Con,... hay các làng chài, khu nghỉ dưỡng vui chơi với cảnh
                    quan phong phú khác lạ. Cùng hòa mình vào thiên nhiên nguyên
                    sơ, tận hưởng làn gió mát từ biển khơi, "chill" giữa bầu
                    không khí dễ chịu và check in nhiều cảnh đẹp tại điểm đến lý
                    tưởng này nhé.
                </p>
            </div>

            {/* Kỳ quan thiên nhiên Hạ Long */}
            <div>
                <h2 id="news-halong" className="news-subtitle ">
                    2. Kỳ quan thiên nhiên Hạ Long
                </h2>

                <p className="news-paragraph">
                    Vịnh Hạ Long luôn là cái tên không thể bỏ qua trong mọi danh
                    sách điểm đến, nhất là trong tour du lịch nghỉ dưỡng ở miền
                    Bắc. Xứng danh là kỳ quan - di sản thiên nhiên thế giới, địa
                    danh này sẽ dành tặng cho bạn những cảm giác không thể nào
                    quên. Toàn bộ cảnh quan của vịnh đủ làm say lòng bất kỳ ai,
                    dù là lần đầu đặt chân đến.
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news2-halong.jpg"
                        alt="Hạ Long đẹp quên lối về. Ảnh: Dulichbiz"
                    />
                    <figcaption className="image-caption">
                        Hạ Long đẹp quên lối về. Ảnh: Dulichbiz
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Theo kinh nghiệm du lịch Hạ Long của nhiều du khách thì nơi
                    này sở hữu một vẻ đẹp vạn người mê. Từ những thắng cảnh nức
                    tiếng trong và ngoài nước mang tên động Thiên Cung, hòn
                    Trống Mái, đảo Tuần Châu đến những “hòn ngọc” nhỏ nổi trên
                    biển như Ti tốp, Quan Lạn,... hay vô số món ngon từ hải sản
                    tươi rói như mực, cua, ghẹ luôn sẵn sàng chờ bạn và gia đình
                    ghé thăm tham quan, du ngoạn và thưởng thức đấy.
                </p>
            </div>

            {/* Đảo Ngọc Cát Bà */}
            <div>
                <h2 id="news-catba" className="news-subtitle ">
                    3. Đảo Ngọc Cát Bà
                </h2>

                <p className="news-paragraph">
                    Cát Bà đã được UNESCO công nhận là khu dự trữ sinh quyển thế
                    giới. Đặc biệt hơn là bãi biển Cát Cò 2 của Cát Bà còn lọt
                    top những bãi biển đẹp nhất Đông Nam Á (bình chọn của chuyên
                    trang Thrillist). Và gần đây, vịnh Lan Hạ là cái tên nổi bật
                    tiếp theo vì được Hiệp hội Câu lạc bộ các Vịnh đẹp nhất thế
                    giới vinh danh top vịnh đẹp nhất thế giới. Hàng loạt danh
                    hiệu ấn tượng đã giúp Cát Bà trở thành địa danh du lịch được
                    người Việt tìm kiếm nhiều nhất năm 2020 do Google công bố.
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news2-catba.jpg"
                        alt="Flamingo Cát Bà tạo nên cơn sốt check-in. Ảnh: vneconomy"
                    />
                    <figcaption className="image-caption">
                        Flamingo Cát Bà tạo nên cơn sốt check-in. Ảnh: vneconomy
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Với hơn 1.000 phòng nghỉ dưỡng có tiêu chuẩn 5 sao quốc tế
                    ngay trên đỉnh Vịnh Lan Hạ và sở hữu hàng trăm dịch vụ, tiện
                    ích hiện đại. Nổi bật nhất là hệ thống tổ hợp Seva Spa &
                    Beauty Destination với vai trò chăm sóc sức khỏe và sắc đẹp
                    toàn diện. Ngoài ra còn có tổ hợp Onsen, Gym, Yoga, ẩm thực
                    Á- Âu với chuỗi nhà hàng cao cấp. Và cũng không thể thiếu
                    trung tâm vui chơi giải trí với diện tích khủng lên đến
                    6000m2. Tất cả đã khiến Cát Bà trở thành điểm đến được yêu
                    thích suốt 4 mùa thay vì chỉ thu hút du khách vào mùa hè. Có
                    thể nói đây là một trong các điểm đến chuẩn nhất nếu như gia
                    đình bạn muốn tìm một nơi đáp ứng cả ba nhu cầu tham quan,
                    khám phá và nghỉ dưỡng.
                </p>
            </div>

            {/* Di sản Tràng An */}
            <div>
                <h2 id="news-trangan" className="news-subtitle ">
                    4. Di sản Tràng An
                </h2>

                <p className="news-paragraph">
                    Trong các điểm du lịch nghỉ dưỡng miền Bắc, Tràng An cũng là
                    địa danh nổi bật. Được UNESCO bình chọn là một trong những
                    di sản văn hóa thế giới, khu du lịch sinh thái Tràng An
                    chiếm trọn cảm tình của du khách gần xa, nhất là các bạn trẻ
                    mê sống ảo bởi khung cảnh thần tiên, thoát tục khiến bao con
                    tim mê đắm.
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news2-trangan.jpg"
                        alt="Tràng An - di sản văn hóa thế giới được UNESCO công nhận. Ảnh: disantrangan.vn"
                    />
                    <figcaption className="image-caption">
                        Tràng An - di sản văn hóa thế giới được UNESCO công
                        nhận. Ảnh: disantrangan.vn
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Hòn đảo xinh đẹp mang không khí thanh sạch, trong lành và
                    yên ả. Du khách đến đây tha hồ dạo bước giữa những bãi biển
                    cát mịn như bãi Tình Yêu, bãi Hồng Vàn, Vàn Chảy, Cô Tô
                    Con,... hay các làng chài, khu nghỉ dưỡng vui chơi với cảnh
                    quan phong phú khác lạ. Cùng hòa mình vào thiên nhiên nguyên
                    sơ, tận hưởng làn gió mát từ biển khơi, "chill" giữa bầu
                    không khí dễ chịu và check in nhiều cảnh đẹp tại điểm đến lý
                    tưởng này nhé.
                </p>
            </div>

            {/* Đồng Mô */}
            <div>
                <h2 id="news-dongmo" className="news-subtitle ">
                    5. Đồng Mô
                </h2>

                <p className="news-paragraph">
                    Chỉ cách Thủ đô Hà Nội chưa đầy 40 km về phía Tây, Đồng Mô
                    xứng đáng có tên trong list điểm du lịch nghỉ dưỡng miền Bắc
                    dịp 30/4. Đây vốn là điểm đầu của quần thể du lịch Sơn Tây -
                    Ba Vì. Nơi này được đông đảo du khách yêu thích vì hội tụ đủ
                    3 yếu tố nghỉ dưỡng đúng chuẩn là: khung cảnh thiên nhiên
                    trong lành, có nhiều khu vui chơi, giải trí hấp dẫn và cuối
                    cùng là sở hữu vô vàn món ngon miền Bắc.
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news2-dongmo.jpg"
                        alt="Đồng Mô cách trung tâm thành phố Hà Nội khoảng 40 km. Ảnh: leyen0602"
                    />
                    <figcaption className="image-caption">
                        Đồng Mô cách trung tâm thành phố Hà Nội khoảng 40 km.
                        Ảnh: leyen0602
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Có thể nói trung tâm du lịch sinh thái Đồng Mô là lựa chọn
                    không thể phù hợp hơn cho kỳ nghỉ lễ 30/4 – 1/5 dài ngày của
                    bất cứ gia đình nào.
                </p>
            </div>
        </div>
    );
}

export default News2;