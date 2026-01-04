
import axios from "axios";
axios.defaults.withCredentials = true


const origin = `${import.meta.env.VITE_BACKEND_ORIGIN}/api/user`;

// Sign UP
export const signUp = async (data) => {
    console.log(data);

    let res = await axios.post(`${origin}/user-register`, data)
    return res.data
}


// Login
export const login = async (data) => {
    let res = await axios.post(`${origin}/Login`, data)
    return res.data
}


// Verify OTP
export const verifyOTP = async (data) => {
    let res = await axios.post(`${origin}/verfiy_otp`, data)
    return res.data
}
// ReSend OTP
export const reSendOTP = async () => {
    let res = await axios.post(`${origin}/reSend_Otp`,)
    return res.data
}
// reSet Password Link
export const reSetPassLink = async (data) => {
    let res = await axios.post(`${origin}/reSet_Password_Link`, data)
    return res.data
}
// ReSet Password 
export const reSetPassword = async (password, Link) => {
    console.log(Link);

    let res = await axios.post(`${origin}/reSet_Password/${Link}`, { newPassword: password })
    return res.data
}
// auth_Me
export const authMe = async () => {
    let res = await axios.get(`${origin}/auth_Me`)
    return res.data
}
// update_Profile
export const updateProfile = async (data) => {

    let res = await axios.put(`${origin}/update_Profile`, data,)
    return res.data
}
export const logoutMe = async () => {

    let res = await axios.post(`${origin}/logout`,)
    return res.data
}
