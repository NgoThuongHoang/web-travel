import { useRouter } from 'next/router';
import PaymentPage from '../components/PaymentPage'; // Điều chỉnh đường dẫn theo cấu trúc thư mục của bạn

const Payment = () => {
  const router = useRouter();
  const { tourId } = router.query;

  return <PaymentPage tourId={tourId} />;
};

export default Payment;