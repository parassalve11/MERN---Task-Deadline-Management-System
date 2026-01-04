import React, { useState } from "react";
import useFormValidation from "../../hooks/useFormValidation";
import { signinSchema} from "../../lib/schema";
import axiosInstance from "../../lib/axios";
import { Input } from "../UI/Input";
import { Mail } from "lucide-react";
import useUserStore from "../../store/useUserStore";
import { Eye, EyeClosed, Loader2, Lock} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
  const { values, errors, handleChange, validateForm } = useFormValidation(
    signinSchema,
    {
      email: "",
      password: "",
    }
  );
const {setUser} = useUserStore()

  const SignIn = async () => {
    try {
      setIsPending(true);

      const result = await axiosInstance.post("/auth/signin", values);
      if (result.data) {
          setUser(result?.data?.user)
        setIsPending(false);
      }
      return result;
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await SignIn();
    navigate('/')
  };

  return (
    <div>
      <p className="text-red-600 font-medium text-center text-xs mb-2">
        {error}
      </p>
      <form onSubmit={handleSignIn}>
        <div className="space-y-5">
         
          <div>
            <Input
              type="email"
              name="email"
              value={values.email}
              placeholder="Enter Your Email"
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
            className="w-full bg-blue-500 font-semibold  text-white px-3 py-2 border rounded-2xl"
          >
            {isPending ? <Loader2 className="animate-spin size-4" /> : "Signin"}
          </button>
        </div>
      </form>
    </div>
  );
}
