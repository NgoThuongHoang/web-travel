// src/App.js
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './Layout ';
import { useDispatch } from 'react-redux';
import { initialize } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khôi phục trạng thái từ localStorage
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (user && role) {
      // Không cần dispatch action login, chỉ cần khởi tạo
      // AuthContext sẽ tự xử lý
    }
    dispatch(initialize());
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;