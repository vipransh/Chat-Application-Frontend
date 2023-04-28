import axios from "axios";



// base url
// const BASE_URL="http://127.0.0.1:5000/api/v1/"
const BASE_URL="http://3.110.132.39:5000/api/v1/"

// const userInfo=JSON.parse(localStorage.getItem("userInfo"));

// get token

// let TOKEN=userInfo&& userInfo.token;
let TOKEN=JSON.parse(localStorage.getItem("userInfo"))?.token;


export const refreshToken=()=>{
    TOKEN = JSON.parse(localStorage.getItem("userInfo"))?.token;
}





export const publicRequest=axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
    }
});

export const signUpRequest=axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data, application/json",
    }
});


export const protectedRequest=axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN || ''}`, 
    }
})
// `Bearer ${TOKEN}`

