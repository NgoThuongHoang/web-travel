import React from "react";
import "../styles/NewsDetail.css";

function News1() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    return (
        <div className="news-detail-container">
            <h1 className="news-title ">
                Kinh nghiệm du lịch miền Bắc mùa nào đẹp nhất và thơ mộng nhất
                trong năm
            </h1>

            {/* Menu */}
            <nav className="news-nav">
                <p className="news-nav-title">Mục lục bài viết:</p>
                <ul>
                    <li>
                        <a href="#news-climate">Đặc trưng khí hậu miền Bắc</a>
                    </li>
                    <li>
                        <a href="#news-better">
                            Du lịch miền Bắc mùa nào đẹp nhất?
                        </a>
                        <ul>
                            <li>
                                <a href="#news-spring">1. Mùa xuân miền Bắc</a>
                            </li>
                            <li>
                                <a href="#news-summer">2. Mùa hè miền Bắc</a>
                            </li>
                            <li>
                                <a href="#news-autumn">3. Mùa thu miền Bắc</a>
                            </li>
                            <li>
                                <a href="#news-winter">4. Mùa đông miền Bắc</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>

            {/* Thêm h2 cho đoạn đặc trưng khí hậu miền Bắc */}
            <h2 id="news-climate" className="news-subtitle ">
                Đặc trưng khí hậu miền Bắc
            </h2>

            <p className="news-paragraph">
                Miền Bắc Việt Nam mang nét đặc trưng khí hậu nhiệt đới gió mùa
                ẩm với sự phân chia rõ rệt giữa các mùa. Từ tháng 5 đến tháng 9,
                thời tiết nóng bức và mưa nhiều. Trong khi đó, mùa đông từ tháng
                11 đến tháng 2 năm sau thường lạnh và ít mưa.
            </p>
            <p className="news-paragraph">
                Điểm nổi bật là hai mùa chuyển tiếp – xuân và thu – diễn ra từ
                tháng 4 đến tháng 10, tạo nên sự đa dạng khí hậu độc đáo, nhất
                là ở các vùng đồng bằng và miền núi phía Bắc.
            </p>

            <div className="news-image-wrapper">
                <img
                    src="/images/moi-mua-mien-bac-4731.jpg"
                    alt="Kinh nghiệm du lịch miền Bắc mùa nào đẹp nhất và thơ mộng nhất trong năm"
                />
                <figcaption className="image-caption">
                    Mỗi mùa miền Bắc lại có khung cảnh đặc trưng riêng. Ảnh:
                    tuannguyentravel
                </figcaption>
            </div>

            <h2 id="news-better" className="news-subtitle ">
                Du lịch miền Bắc mùa nào đẹp nhất?
            </h2>

            {/* Mùa xuân */}
            <div className="season-item">
                <h3 id="news-spring" className="news-subtitle ">
                    1. Mùa xuân miền Bắc
                </h3>
                <p className="news-paragraph">
                    Thời gian: từ tháng 1 đến tháng 3
                </p>
                <p className="news-paragraph">
                    Mùa xuân về là lúc cảnh sắc, đất trời phương Bắc trở nên rực
                    rỡ. Khung cảnh như được khoác lên chiếc áo đầy màu sắc của
                    hoa ban, hoa mận, hoa đào. Du lịch miền Bắc mùa này, bạn tha
                    hồ check in những điểm đến và có được bao trải nghiệm đầy
                    thú vị, cảm nhận chút gió lạnh phảng phất còn sót lại của
                    mùa đông, ngắm những tia nắng mỏng manh yếu ớt. Thỉnh thoảng
                    sẽ có vào hạt mưa phùn trên những chồi non tươi xanh vừa mới
                    nhú.
                </p>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-xuan1.jpg"
                        alt="Không khí lạnh đặc trưng mùa xuân miền Bắc"
                    />
                    <figcaption className="image-caption">
                        Không khí lạnh đặc trưng mùa xuân miền Bắc. Ảnh vntrip
                    </figcaption>
                </div>

                {/* Những mùa hoa đẹp vào mùa xuân miền Bắc */}
                <h4 className="news-subtitle ">
                    Những mùa hoa đẹp vào mùa xuân miền Bắc
                </h4>
                <ul className="news-list">
                    <li>
                        <strong>Mùa hoa đào:</strong> Thời điểm diễn ra những
                        biến chuyển nhẹ nhàng và tinh tế của khí hậu miền Bắc
                        cũng chính là lúc những nhành đào hé nở những cánh hoa
                        đầu tiên. Không chỉ khoe sắc ở Thủ đô Hà Nội mà du khách
                        du lịch Sapa và Mộc Châu cũng có thể dễ dàng bắt gặp hoa
                        đào mọc thành rừng bạt ngàn trong những thung lũng, lấp
                        ló ven đường hay thấp thoáng đây đó trên những triền
                        núi.
                    </li>
                    <li>
                        <strong>Mùa hoa mận, hoa ban:</strong> Bạn sẽ dễ dàng
                        bắt gặp hoa ban và hoa mận ở nhiều nơi nhưng hai loài
                        hoa này nở nhiều nhất và đẹp nhất phải vào đúng mùa xuân
                        vùng Tây Bắc. Trong đó, Điện Biên hay Sơn La được xem là
                        xứ sở của hoa ban - loài hoa báo hiệu màu xuân về với
                        sắc đỏ, tím và phổ biến nhất là màu trắng thanh khiết nở
                        khắp nơi.
                    </li>
                    <li>
                        <strong>Mùa hoa thược dược, hoa sưa:</strong> Từng bông
                        hoa thược dược với đủ sắc màu thật sự phù hợp với không
                        khí rộn ràng của mùa xuân phương Bắc. Bên cạnh nhan sắc
                        rực rỡ của thược dược thì vẻ dịu dàng của hoa sưa trông
                        có vẻ bình dị nhưng không thiếu chất kiêu sa cũng vô
                        cùng cuốn hút du khách.
                    </li>
                </ul>

                {/* Mùa đi lễ chùa hằng năm */}
                <h4 className="news-subtitle ">Mùa đi lễ chùa hằng năm</h4>
                <p className="news-paragraph">
                    Đi chùa lễ Phật đầu năm là một nét đẹp truyền thống của
                    người Việt Nam. Vì vậy, du lịch đầu xuân phương Bắc, bạn
                    đừng bỏ qua dịp viếng thăm những ngôi chùa nổi tiếng để cầu
                    duyên, cầu an, cầu mọi sự tốt đẹp. Non thiêng Yên Tử, đền
                    Trần – Nam Định, đền Bà Chúa Kho, chùa Hương – Mỹ Đức- Hà
                    Nội hay chùa Bái Đính,... đều là những ngôi chùa nổi tiếng
                    nhất miền Bắc.
                </p>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-xuan2.jpg"
                        alt="Không khí lạnh đặc trưng mùa xuân miền Bắc"
                    />
                    <figcaption className="image-caption">
                        Hành hương vãn cảnh chùa đầu năm trong tiết xuân. Ảnh:
                        travelhanoi
                    </figcaption>
                </div>

                {/* Lễ hội mùa xuân đặc sắc */}
                <h4 className="news-subtitle ">Lễ hội mùa xuân đặc sắc</h4>
                <p className="news-paragraph">
                    Nếu còn đang phân vân không biết du lịch miền Bắc mùa nào
                    đẹp nhất thì một gợi ý tiếp theo dành cho bạn là hãy chọn
                    mùa lễ hội. Và mùa xuân chính là mùa có nhiều lễ hội lớn với
                    đông đảo người dân địa phương cùng các du khách tham gia như
                    hội Gióng Phù Đổng, lễ hội Cổ Loa, hội Lim, hội Khai ấn đền
                    Trần, hội đền Hùng,... Tất cả đều là những lễ hội truyền
                    thống nổi tiếng của các tỉnh miền Bắc khi xuân về.
                </p>
            </div>

            {/* Mùa hè */}
            <div className="season-item">
                <h3 id="news-summer" className="news-subtitle ">
                    2. Mùa hè miền Bắc
                </h3>
                <p className="news-paragraph">
                    Thời gian: từ giữa tháng 4 đến tháng 6
                </p>
                <p className="news-paragraph">
                    Khi những cơn mưa rào đến rồi lại đi một cách nhanh chóng,
                    miền Bắc chính thức bước vào mùa hè, mùa nóng nhất trong
                    năm. Dù vậy, đây lại là lúc thời tiết khô ráo và dễ chịu hơn
                    so với không khí ẩm thấp của mùa xuân. Nhất là thời điểm đầu
                    hè vẫn có những cơn gió mát nên khá dễ chịu. Nền nhiệt độ
                    chỉ thực sự cao lên, trời oi bức và nắng chói chang vào tầm
                    tháng 6 – tháng 7.
                </p>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-he1.jpg"
                        alt="Bản Cát Cát (Sapa) nằm yên bình giữa khung trời hạ"
                    />
                    <figcaption className="image-caption">
                        Bản Cát Cát (Sapa) nằm yên bình giữa khung trời hạ. Ảnh:
                        metrip
                    </figcaption>
                </div>

                {/* Những điểm đến hấp dẫn mùa hè miền Bắc */}
                <h4 className="news-subtitle ">
                    Những điểm đến hấp dẫn mùa hè miền Bắc
                </h4>
                <ul className="news-list">
                    <li>
                        <strong>Hà Nội:</strong> Mùa hè đến cũng là mùa hoa bằng
                        lăng tím khắp phố phường, hoa phượng đỏ nở rực cả góc
                        trời tại các con phố và trường học đặc biệt là dọc hai
                        bên bờ sông Tô Lịch (bên đường Bưởi mới) hay khu hồ Trúc
                        Bạch. Đây cũng là mùa mận hậu, mùa của những thức uống
                        giải nhiệt nắng hè như nước mơ, nước sấu, sắn dây cùng
                        những tô bún ốc ăn vào mát rượi.
                    </li>
                    <li>
                        <strong>Các tỉnh Tây Bắc:</strong> Nếu đi vào mùa hè thì
                        tốt nhất là bạn đến vào thời điểm khoảng đầu tháng 4 đến
                        tháng 5 và tháng 6, sẽ thấy được cảnh tượng hùng vĩ của
                        các thác nước và dòng suối trong veo vì đây là mùa nước
                        từ sông suối được đưa thẳng vào ruộng đồng. Người dân
                        địa phương gọi những nơi này là các cọn nước. Đặc sắc
                        nhất chính là cọn nước ở Bản Bo thuộc huyện Tam Đường,
                        Lai Châu. Đến đây, du khách có thể thử tham gia bắt cua
                        đồng, tôm, cá cũng như trải nghiệm chế biến, thưởng thức
                        đặc sản cá suối nướng độc đáo của đồng bào người Thái
                        nhé. Ngoài ra, cũng đừng bỏ lỡ cơ hội check in Mộc Châu
                        - Sơn La để hòa mình vào không khí mát lạnh, trong lành
                        nơi đây, tạm quên khí hậu nóng bức miền đồng bằng.
                    </li>
                    <li>
                        <strong>Các tỉnh Đông Bắc:</strong> sẽ đưa bạn đến với
                        những thắng cảnh non cao hùng vĩ của miền đất Hà Giang,
                        hay có dịp "sống ảo" tại thác nước cuồn cuộn và tuyệt
                        đẹp của tỉnh Cao Bằng. Bên cạnh đó những địa điểm du
                        lịch Bắc Kạn nổi tiếng như Hồ Ba Bể với khung cảnh đừng
                        quên ghé qua thăm khung cảnh thiên nhiên thơ mộng, hữu
                        tình cũng là lựa chọn đáng nhớ của du khách đấy.
                    </li>
                </ul>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-he2.jpg"
                        alt="Mùa hè rực nắng ở đèo Ô Quy Hồ."
                    />
                    <figcaption className="image-caption">
                        Mùa hè rực nắng ở đèo Ô Quy Hồ. Ảnh: vntrip
                    </figcaption>
                </div>
            </div>

            {/* Mùa thu */}
            <div className="season-item">
                <h3 id="news-autumn" className="news-subtitle ">
                    3. Mùa thu miền Bắc
                </h3>
                <p className="news-paragraph">
                    Thời gian: từ tháng 7 đến tháng 9
                </p>
                <p className="news-paragraph">
                    Nhiều du khách đã bình chọn mùa thu miền Bắc với không khí
                    se lạnh mỗi sớm mai, vẻ dịu nhẹ và mềm mại của nắng trưa và
                    những tối gió lạnh se sắt là thời điểm đẹp nhất trong năm.
                    Du lịch miền Bắc thời gian này bạn sẽ được tận hưởng mùa
                    vàng ở Tây Bắc, ngửi hương lúa chín ngọt ngào, check in
                    những cung đường đèo uốn lượn đẹp như mơ mà không lo gặp
                    phải cơn mưa rừng bất chợt, chiêm ngưỡng màu xanh bất tận
                    của cánh đồng chè trên những sườn núi cao, bên cạnh là những
                    cánh đồng tam giác mạch tinh khôi và rồi thưởng thức các món
                    ngon làm từ măng rừng, măng đắng, rau cải mèo đang vào mùa.
                </p>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-thu1.jpg"
                        alt="Mù Cang Chải – nơi ngắm mùa vàng đẹp nhất Việt Nam. Ảnh: vgotravel"
                    />
                    <figcaption className="image-caption">
                        Mù Cang Chải – nơi ngắm mùa vàng đẹp nhất Việt Nam. Ảnh:
                        vgotravel.
                    </figcaption>
                </div>

                {/*  */}
                <h4 className="news-subtitle ">
                    Những điểm đến cuốn hút của mùa thu miền Bắc
                </h4>
                <ul className="news-list">
                    <li>
                        <strong>Mù Cang Chải: </strong>mùa lúa vàng rực rỡ vào
                        tháng 9, tháng 10.
                    </li>
                    <li>
                        <strong>Cung đường Hoàng Su Phì – Xín Mần: </strong>vào
                        cuối tháng 8 – đầu tháng 9.
                    </li>
                    <li>
                        <strong>
                            Trên đường đến thị trấn Vinh Quang (Hoàng Su Phì);
                            xã Thông Nguyên; xã Bản Luốc; Sán Sả Hồ; xã Hồ Thầu;
                            xã Nậm Ty:{" "}
                        </strong>
                        những thửa ruộng bậc thang cực đẹp.
                    </li>
                    <li>
                        <strong>Hà Giang: </strong>tháng 9 mùa lúa chín, cánh
                        đồng tam giác mạch, hoàng hôn tuyệt đẹp trên Quản Bạ,
                        sông Nho Quế xanh ngắt.
                    </li>
                    <li>
                        <strong>Sa Pa: </strong>những thửa ruộng bậc thang tuyệt
                        đẹp nằm uốn mình bên sườn núi chênh vênh.
                    </li>
                    <li>
                        <strong>Thác Bản Giốc: </strong>ào ào chảy dòng nước màu
                        xanh ngọc bích bên những thửa ruộng chín vàng vào tháng
                        9, 10.
                    </li>
                </ul>

                {/* Sự kiện và lễ hội đặc biệt: */}
                <h4 className="news-subtitle ">Sự kiện và lễ hội đặc biệt:</h4>
                <ul className="news-list">
                    <li>
                        <strong>
                            Lễ hội ruộng bậc thang Mù Cang Chải thuộc tỉnh Yên
                            Bái:{" "}
                        </strong>
                        bắt đầu từ khoảng giữa tháng 9.
                    </li>
                    <li>
                        <strong>Lễ hội thác Bản Giốc: </strong>chính thức diễn
                        ra vào đầu tháng 10 tại khu du lịch Thác Bản Giốc, xã
                        Đàm Thủy, huyện Trùng Khánh, tỉnh Cao Bằng.
                    </li>
                    <li>
                        Lễ hội hoa tam giác mạch với nhiều hoạt động thể thao
                        đặc sắc.
                    </li>
                </ul>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-thu2.jpg"
                        alt="Thác Bản Giốc hùng vĩ mùa thu."
                    />
                    <figcaption className="image-caption">
                        Thác Bản Giốc hùng vĩ mùa thu. Ảnh: vgotravel
                    </figcaption>
                </div>
            </div>

            {/* Mùa đông */}
            <div className="season-item">
                <h3 id="news-winter" className="news-subtitle ">
                    4. Mùa đông miền Bắc
                </h3>
                <p className="news-paragraph">
                    Thời gian: từ tháng 10 đến tháng 12
                </p>
                <p className="news-paragraph">
                    Đông về là lúc khí hậu miền Bắc trở nên khắc nghiệt và cực
                    đoan hơn ở miền Nam với nhiệt độ thường xuống rất thấp, thậm
                    chí còn kèm theo mưa, gió. Dù vậy đất trời, khung cảnh thiên
                    nhiên cũng mang vẻ đẹp riêng, không kém phần cuốn hút so với
                    các mùa còn lại vì mang đến một bầu không khí khác hẳn so
                    với vùng miền khác.
                </p>
                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-dong1.jpg"
                        alt="Săn mây mùa đông. Ảnh: tannguyentravel"
                    />
                    <figcaption className="image-caption">
                        Săn mây mùa đông. Ảnh: tannguyentravel.
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Đó là cái lạnh buốt da ở các tỉnh miền núi phía Bắc. Quang
                    cảnh xung quanh chìm trong màn sương mù huyền ảo, nếu đến
                    đúng dịp, du khách còn được ngắm tuyết rơi ở Sapa, Bắc Kạn,
                    Lào Cai,...
                </p>

                <div className="news-image-wrapper">
                    <img
                        src="/images/news1-dong2.jpg"
                        alt="Mùa đông trên đỉnh Tà Xùa. Ảnh: vgotravel"
                    />
                    <figcaption className="image-caption">
                        Mùa đông trên đỉnh Tà Xùa. Ảnh: vgotravel.
                    </figcaption>
                </div>

                <p className="news-paragraph">
                    Có thể nói, với nhiều du khách yêu khí tiết trời lạnh giá,
                    tháng 12 là thời điểm lý tưởng nhất để du lịch miền Bắc. Vì
                    lúc này vẻ đẹp hoang sơ, bình dị của đất trời mới được thể
                    hiện rõ nhất. Còn gì vui hơn được ngồi bên bếp củi tí tách
                    và uống ly rượu ấm, thưởng thức các món ăn nóng hổi trong
                    cái lạnh thấu xương của Hà Giang. Và sáng hôm sau cùng đi
                    qua những cung đường quyện gió, sương giăng mắc lượn quanh
                    chân núi, ngắm sắc tam giác mạch ửng hồng khắp nơi, dường
                    như đang phủ kín cả sườn đồi, hay check in bên sắc cải vàng
                    rực rỡ giữa từng con đường xuyên làng bản.
                </p>
            </div>
        </div>
    );
}

export default News1;
