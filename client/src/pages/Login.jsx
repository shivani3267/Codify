import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import Logo from "../components/Logo.jsx";
import Navbar from "../components/Navbar.jsx";
import toast from "react-hot-toast";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password is too weak"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector( (state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
        await dispatch(loginUser(data)).unwrap();
        toast.success("Login Successful!")
    } catch (error) {
        toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
    <Navbar />

    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          
          <Logo/>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />

              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                </button>
              </div>

              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

          </form>

          {/* Signup Redirect */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="link link-primary font-semibold"
              >
                Sign Up
              </NavLink>
            </span>
          </div>

        </div>
      </div>
    </div>
   </div>            
  
  );
}

export default Login;