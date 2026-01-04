import React, { useState } from "react";
import useFormValidation from "../../hooks/useFormValidation";
import { signupSchema } from "../../lib/schema";
import axiosInstance from "../../lib/axios";
import { Input } from "../UI/Input";
import { Eye, EyeClosed, Loader2, Lock, Mail, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const {setUser} = useUserStore()

  const navigate = useNavigate();
  const { values, errors, handleChange, validateForm } = useFormValidation(
    signupSchema,
    {
      name: "",
      email: "",
      password: "",
    }
  );

  const Signup = async () => {
    try {
      setIsPending(true);

      const result = await axiosInstance.post("/auth/signup", values);
      console.log("result.data.user",result?.data?.user);
      
      if (result.data) {
        setUser(result?.data?.user)
        setIsPending(false);
      }
      return result;
    } catch (error) {
      setError(error.data.response);
      console.log(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await Signup();
    navigate('/')
  };

  return (
    <div>
      <p className="text-red-600 font-medium text-center text-xs mb-2">
        {error}
      </p>
      <form onSubmit={handleSignup}>
        <div className="space-y-5">
          <div>
            <Input
              type="text"
              name="name"
              value={values.name}
              placeholder="Enter Your Name"
              className="w-full"
              onChange={handleChange}
              leftIcon={<User2 />}
              required
            />

            {errors.name && (
              <p className="text-red-600 text-xs font-light mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <Input
              type="email"
              name="email"
              value={values.email}
              placeholder="Enter Your Username"
              className="w-full"
              onChange={handleChange}
              leftIcon={<Mail />}
              required
            />

            {errors.email && (
              <p className="text-red-600 text-xs font-light mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              className="w-full"
              name="password"
              onChange={handleChange}
              leftIcon={<Lock />}
              rightIcon={
                showPassword ? (
                  <Eye onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeClosed onClick={() => setShowPassword(!showPassword)} />
                )
              }
              required
            />
            {errors.password && (
              <p className="text-red-600 text-xs font-light mt-1">
                {errors.password}
              </p>
            )}
          </div>
        </div>
        <Link
          to={"/forget-password/check"}
          className="flex items-center mt-auto"
        >
          <p className="text-sm font-semibold text-blue-600 hover:cursor-pointer">
            Forget Password ?
          </p>
        </Link>
        <div className="space-y-3 mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#fff1ad] hover:bg-[#e6d89c]  text-black"
          >
            {isPending ? <Loader2 className="animate-spin size-4" /> : "SignUp"}
          </button>
        </div>
      </form>
    </div>
  );
}
