import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import About from './pages/About';
import News from './pages/News';
import Contact from './pages/Contact';
import TourDetailPage from './pages/TourDetailPage';
import PaymentPage from './pages/PaymentPage';
import Admin from './pages/admin/Admin';
import TourManagement from './pages/admin/TourManagement';
import BookingManagement from './pages/admin/BookingManagement';
import UserManagement from './pages/admin/UserManagement';
import ConsultationManagement from './pages/admin/ConsultationManagement'
import RevenueStatistics from './pages/admin/RevenueStatistics';
import Reports from './pages/admin/Reports';
import SearchInfo from './pages/admin/SearchInfo'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/reset.css';
import BackToTop from './components/BackToTop';

function Layout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') || 
                         location.pathname.startsWith('/quan-ly-tour') || 
                         location.pathname.startsWith('/quan-ly-dat-tour') ||
                         location.pathname.startsWith('/thong-ke-doanh-thu') ||
                         location.pathname.startsWith('/quan-ly-nguoi-dung') ||
                         location.pathname.startsWith('/bao-cao');
                         location.pathname.startsWith('/cham-soc-khach-hang');
                         location.pathname.startsWith('/tra-cuu');
                         

    return (
        <>
            {isAdminRoute ? <AdminHeader /> : <Header />}
            <BackToTop />
            <main>
                <Routes>
                    {/* Trang chính */}
                    <Route path="/" element={<Home />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/tours/:id" element={<TourDetails />} />
                    <Route path="/toursDetail/" element={<TourDetailPage />} />
                    <Route path="/thanh-toan" element={<PaymentPage />} />
                    <Route path="/ve-chung-toi" element={<About />} />
                    <Route path="/tin-tuc" element={<News />} />
                    <Route path="/lien-he" element={<Contact />} />
                    
                    {/* Nhóm route admin */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/quan-ly-tour" element={<TourManagement />} />
                    <Route path="/admin/quan-ly-dat-tour" element={<BookingManagement />} />
                    <Route path="/admin/thong-ke-doanh-thu" element={<RevenueStatistics />} />
                    <Route path="/admin/quan-ly-nguoi-dung" element={<UserManagement />} />
                    <Route path="/admin/bao-cao" element={<Reports />} />
                    <Route path="/admin/cham-soc-khach-hang" element={<ConsultationManagement />} />
                    <Route path="/admin/tra-cuu" element={<SearchInfo />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Router>
                <Layout />
            </Router>
        </div>
    );
}

export default App;
