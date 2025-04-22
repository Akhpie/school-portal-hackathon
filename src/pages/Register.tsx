
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { useApp } from '@/contexts/AppContext';

const Register = () => {
  const { isLoggedIn } = useApp();
  
  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="py-12 md:py-16 px-4">
        <div className="max-w-md mx-auto glass-card p-8">
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
