import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import { pageMotionTime } from '../../configs'

function SignUpForm() {
    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [phoneError, setPhoneError] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [gender, setGender] = useState<string>('Female')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
    const [radioCheck, setRadioCheck] = useState<boolean>(false)
    const [radioCheckError, setRadioCheckError] = useState<string>('')
    const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false)
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
    const navigate = useNavigate()

    return (<>
        <motion.div
            initial={{
                opacity: 0,
                y: "100%"
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: "100%"
            }}
            transition={{
                duration: pageMotionTime
            }}
            className="w-96 p-4 pb-6 h-fit bg-white drop-shadow-md flex flex-col rounded-xl ">
            <p className="text-lg font-semibold text-gray-500">Sign Up</p>
            <div className="w-full mt-4 min-h-fit gap-4 flex">
                <div className="flex-1 min-h-fit ">
                    <div>
                        {/* <label htmlFor="firstName" className="text-super-small font-semibold text-gray-400">First Name: </label>
                        <input type="text" id="firstName" placeholder="First Name" className="w-full h-6 px-2 text-super-small rounded-sm border-1 border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400" /> */}
                        <div className="relative w-full">
                            <input onChange={(e) => {
                                setName(e.target.value)
                                setNameError('')
                            }} value={name} type="text" id="floating_outlined1" className="block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="floating_outlined1" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                                Name: {name}</label>
                        </div>
                        {
                            nameError!=="" && <span className=" text-ant text-red-400 font-normal ">{nameError}</span>
                        }
                    </div>
                    <div className="mt-4">
                        <div className="relative w-full">
                            <input onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError('')
                            }} type="text" id="floating_outlined3" value={email} className="block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="floating_outlined3" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                                Email: {email}</label>
                        </div>
                        {
                            emailError!=="" && <span className=" text-ant text-red-400 font-normal ">{emailError}</span>
                        }
                    </div>


                    <div className="mt-4">
                        <label htmlFor="Gender" className="text-super-small font-semibold text-gray-400">Gender: </label>
                        {/* select gender */}
                        <select onChange={(e) => { setGender(e.target.value) }} name="gender" id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="Male" className="text-sm h-6"
                                selected={gender === "Male"}
                            >Male</option>
                            <option value="Female" className="text-sm h-6" selected={gender === "Female"} >Female</option>
                        </select>

                    </div>

                </div>
                <div className="flex-1 min-h-fit ">
                    <div >
                        <div className="relative w-full">
                            <input onChange={(e) => {
                                setPhone(e.target.value)
                                setPhoneError('')
                            }} type="text" id="floating_outlined4" value={phone} className="block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="floating_outlined4" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                                Phone: {phone}</label>
                        </div>
                        {
                            phoneError!=="" && <span className=" text-ant text-red-400 font-normal ">{phoneError}</span>
                        }
                    </div>

                    <div className="mt-4">
                        <div className="relative w-full">
                            <input onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError('')
                            }} type="password" id="password" value={password} className="block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="password" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                                Password:</label>
                        </div>
                        {
                            passwordError!=="" && <span className=" text-ant text-red-400 font-normal ">{passwordError}</span>
                        }
                    </div>

                    <div className="mt-4">
                        {/* <label htmlFor="Confirm Password" className="text-super-small font-semibold text-gray-400">Confirm Password: </label>
                        <input type="password" id="Confirm Password" placeholder="Confirm Password" className="w-full h-6 px-2 text-super-small rounded-sm border-1 border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400" /> */}
                        <div className="relative w-full">
                            <input onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setConfirmPasswordError('')
                            }} type="password" id="confirmPassword" value={confirmPassword} className="block px-1 pb-1 pt-1 w-full text-super-small text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                            <label htmlFor="confirmPassword" className="font-semibold absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                                ConfirmPassword:</label>
                        </div>
                        {
                            confirmPasswordError!=="" && <span className=" text-ant text-red-400 font-normal ">{confirmPasswordError}</span>
                        }
                    </div>

                </div>
            </div>
            <div className="w-full mt-4 flex gap-4">
                <div className="flex items-center mb-4 gap-4">
                    <input onChange={()=>{
                        setRadioCheck(prev=>!prev)
                        if(radioCheck===false){
                            setRadioCheckError('')
                        }

                    }} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox" id="checkbox" className="flex-1 inline-block text-super-small leading-4 text-gray-400 font-thin">Creating an account means you’re okay with our <p className="text-blue-400 inline">Terms of Service</p>
                        , <p className="text-blue-400 inline">Privacy Policy</p>,
                        and our default <p className="text-blue-400 inline">Notification Settings</p>.
                    </label>
                </div>

            </div>
            {
                radioCheckError!=="" && <span className=" text-ant text-red-400 font-normal ">{radioCheckError}</span>
            }

            <div className="w-full mt-4 flex justify-between">
                <button onClick={()=>{
                    if(!radioCheck){
                        setRadioCheckError('Please accept the terms and conditions')
                    }
                    else{
                        setRadioCheckError('')
                    }
                    if(password!==confirmPassword){
                        setConfirmPasswordError('Password does not match')
                    }
                    else{
                        setConfirmPasswordError('')
                    }
                    if(password.length<6){
                        setPasswordError('Password must be atleast 6 characters')
                    }
                    else{
                        setPasswordError('')
                    }
                    if(!phone)
                    {
                        setPhoneError('Please enter a valid phone number')
                    }
                    else{
                        setPhoneError('')
                    }
                    if(!email)
                    {
                        setEmailError('Please enter a valid email')
                    }
                    else{
                        setEmailError('')
                    }
                    if(!name)
                    {
                        setNameError('Please enter a valid name')
                    }
                    else{
                        setNameError('')
                    }
                    if(radioCheck && password===confirmPassword && password.length>=6 && phone && email && name){
                        setRadioCheckError('')
                        setConfirmPasswordError('')
                        setPasswordError('')
                        setPhoneError('')
                        setEmailError('')
                        setNameError('')
                        navigate('/login')
                    }
                }} className="w-36 p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-center inline-block align-middle font-semibold text-white text-sm">
                    Create Account
                </button>
                <div>
                    <p className="text-gray-400 text-super-small inline">Already a member?
                        <p onClick={()=>{navigate('/signin')}} className="hover:text-blue-500 cursor-pointer text-super-small inline text-blue-400"> Sign in</p>
                    </p>
                </div>
            </div>
        </motion.div>
    </>);
}

export default memo(SignUpForm);