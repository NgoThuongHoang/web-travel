// src/Layout.js
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import About from './pages/About';
import News from './pages/News';
import Contact from './pages/Contact';
import PaymentPage from './components/PaymentPage';
import Login from './pages/Login';
import Admin from './pages/admin/Admin';
import TourManagement from './pages/admin/TourManagement';
import BookingManagement from './pages/admin/BookingManagement';
import UserManagement from './pages/admin/UserManagement';
import ConsultationManagement from './pages/admin/ConsultationManagement';
import AccountManagement from './pages/admin/AccountManagement';
import RevenueStatistics from './pages/admin/RevenueStatistics';
import Reports from './pages/admin/Reports';
import SearchInfo from './pages/admin/SearchInfo';
import TourEditPage from './pages/admin/TourEditPage';
import BackToTop from './components/BackToTop';
import TourInfoPage from './pages/TourInfoPage';
import ProtectedRoute from './components/ProtectedRoute';

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/dang-nhap';
  const queryParams = new URLSearchParams(location.search);
  const tourId = queryParams.get('tourId');

  return (
    <>
      {!isLoginPage && (isAdminRoute ? <AdminHeader /> : <Header />)}
      <BackToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/chi-tiet-tour/:id" element={<TourDetails />} />
          <Route path="/thanh-toan" element={<PaymentPage tourId={tourId} />} />
          <Route path="/ve-chung-toi" element={<About />} />
          <Route path="/tin-tuc" element={<News />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/tour-info-page" element={<TourInfoPage />} />
          <Route path="/dang-nhap" element={<Login />} />
          
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/quan-ly-tour" element={<TourManagement />} />
            <Route path="/admin/quan-ly-dat-tour" element={<BookingManagement />} />
            <Route path="/admin/thong-ke-doanh-thu" element={<RevenueStatistics />} />
            <Route path="/admin/quan-ly-nguoi-dung" element={<UserManagement />} />
            <Route path="/admin/bao-cao" element={<Reports />} />
            <Route path="/admin/cham-soc-khach-hang" element={<ConsultationManagement />} />
            <Route path="/admin/tra-cuu" element={<SearchInfo />} />
            <Route path="/admin/sua-noi-dung" element={<TourEditPage />} />
            <Route path="/admin/quan-ly-tai-khoan" element={<AccountManagement />} />
          </Route>
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default Layout;