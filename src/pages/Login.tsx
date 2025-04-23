import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoginForm from "@/components/LoginForm";
import { useApp } from "@/contexts/AppContext";

const Login = () => {
  const { isLoggedIn } = useApp();

  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="py-12 md:py-16 px-4">
        <div className="max-w-md mx-auto glass-card p-8 mt-10">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
