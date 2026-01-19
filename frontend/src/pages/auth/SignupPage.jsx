     


import { Link } from "react-router-dom" 
import SignupForm from "../../components/auth/SignupForm"



export default function  SignupPage(){
    return(
     <main className="h-screen flex items-center justify-center p-5">
        <div className="flex h-full w-full max-h-160 max-w-5xl overflow-hidden bg-card shadow-2xl">
            <div className="w-full space-y-10 p-10 overflow-y-auto md:1/2">
                <div className="text-center space-y-1">
                        <h1 className="font-bold text-3xl">SignUp</h1>
                        <div className="text-xs text-gray-300 font-extrabold">
                         <p>admin:parassalve50@gmail.com</p>
                        <p>password:tyson157</p>
                       </div>
                </div>
                <div className="space-y-5">
                   
                    <SignupForm />
                    <Link to={'/signin'} className="font-semibold ">
                     have an Account ? <span className="text-[#3B82F6] font-bold">SignIn</span>
                    </Link>
                </div>
            </div>
            <img 
            src={"https://images.unsplash.com/photo-1767304590980-9c075c875c38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8"}
            alt=""
            className="w-1/2 object-cover hidden md:block"
            />
        </div>
     </main>
    )
}