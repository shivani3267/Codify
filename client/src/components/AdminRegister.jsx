import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldPlus, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "./Navbar.jsx";
import axiosClient from "../utils/axiosClient.js";

const schema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters required"),
  emailId: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosClient.post("/user/admin/register", data);

      toast.success(res.data || "Admin created successfully");
      reset();
    } catch (err) {
      toast.error(
        err.response?.data || "Failed to create admin"
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="flex justify-center items-center py-12 px-4">
        <div className="card w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">

            <div className="flex items-center gap-3 mb-4">
              <ShieldPlus size={32} className="text-primary" />
              <h2 className="text-2xl font-bold">
                Create Admin
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              <div>
                <label className="label">
                  <span className="label-text">
                    First Name
                  </span>
                </label>

                <input
                  {...register("firstName")}
                  className={`input input-bordered w-full ${
                    errors.firstName && "input-error"
                  }`}
                  placeholder="John"
                />

                <p className="text-error text-sm">
                  {errors.firstName?.message}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  {...register("emailId")}
                  className={`input input-bordered w-full ${
                    errors.emailId && "input-error"
                  }`}
                  placeholder="john@gmail.com"
                />

                <p className="text-error text-sm">
                  {errors.emailId?.message}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    {...register("password")}
                    className={`input input-bordered w-full pr-12 ${
                      errors.password && "input-error"
                    }`}
                    placeholder="********"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-3"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <p className="text-error text-sm">
                  {errors.password?.message}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full mt-4"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;