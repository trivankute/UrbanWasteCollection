import { memo, useEffect, useState,} from "react";
import styles from "./SignInForm.module.css";
import {motion} from 'framer-motion'
import { pageMotionTime } from "../../configs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/UserSlice";
import { UserStore } from "../../redux/selectors";
import Spinner from "../Spinner/Spinner";

function SignInForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()  
    const user = useSelector(UserStore)

    function handleLogin() {
        if(email === ""){
            setEmailError("Error: please type you email")
        }
        else {
            setEmailError("")
        }
        if(password === ""){
            setPasswordError("Error: please type your password")
        }
        else {
            setPasswordError("")
        }
        if(email !== "" && password !== ""){
            setEmailError("")
            setPasswordError("")
            dispatch(login({
              email, password
            })).then((res:any)=>{
                if(res.payload.status === "success"){
                    navigate("/notification", {
                    state: {
                        type: "success",
                        message: "Login successfully",
                        link: "/"
                    }
                    })
                }
                else{
                    navigate("/notification", {
                    state: {
                        type: "error",
                        message: res.payload.message,
                        link: "/signin"
                    }
                    })
                }
            })
        }
        else
        {
            setEmailError("Error: please type you email")
            setPasswordError("Error: please type your password")
        }
    }
    return ( <>
    <motion.form 
        onSubmit={(e)=>{
            e.preventDefault()
            handleLogin()
        }}
        initial={{
            opacity:0,
            y:"100%"
        }}
        animate={{
            opacity:1,
            y:0
        }}
        exit={{
            opacity:0,
            y:"100%"
        }}
        transition={{
            duration:pageMotionTime
        }}
        className="rounded-2xl w-72 h-fit bg-white drop-shadow-md flex flex-col px-4 py-6">
            <div className="w-full h-10 px-4">
                <p className="font-semibold text-lg">
                    Sign in
                </p>
            </div>
            <div className="w-full gap-2 flex flex-col items-center">
                <div className="relative w-full">
                    <input onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError("")
                    }} value={email} type="text" id="floating_outlined1" className="p-1 block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="floating_outlined1" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                        Email:</label>
                </div>
                {
                    emailError!=="" && <span className=" text-ant text-red-400 font-normal ">{emailError}</span>
                }

                <div className="relative w-full">
                    <input onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordError("")
                    }} type="password" id="password" value={password} className="p-1 block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="password" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                        Password:</label>
                </div>
                {
                    passwordError!=="" && <span className=" text-ant text-red-400 font-normal ">{passwordError}</span>
                }

            </div>
            <div className="w-full p-4 h-fit"></div>
            <button onClick={handleLogin} className="rounded-md w-full py-1 bg-blue-500 hover:bg-blue-600">
                {
                    user.loading ?
                    <Spinner/>
                    :
                    <p className="text-center text-white font-semibold text-sm">Sign in</p>
                }
            </button>
            <div className="w-full p-2 flex text-sm">
                <p className="">
                    New to ParkingAuto?
                </p>
                <p onClick={()=>{navigate("/signup")}} className="pl-2 font-semibold text-blue-400 hover:text-blue-500 cursor-pointer">Sign Up</p>
            </div>
        </motion.form>
    </> );
}

export default memo(SignInForm);