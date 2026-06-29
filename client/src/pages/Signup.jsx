import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice.js';
import toast from 'react-hot-toast';


const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
      try {
          await dispatch(registerUser(data)).unwrap();
          toast.success("Registered Successfully!")
      } catch (error) {
          toast.error(error);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tight select-none">
              <span className="text-base-content/60">&lt;</span>

              <span
                className="
                  bg-gradient-to-r
                  from-sky-500
                  via-blue-600
                  to-violet-600
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]
                "
              >
                CODIFY
              </span>

              <span className="text-base-content/60">/&gt;</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>

              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />

              {errors.firstName && (
                <span className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control mt-4">
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
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

          </form>

          <div className="text-center mt-6">
            <span className="text-sm">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="link link-primary font-semibold"
              >
                Login
              </NavLink>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;