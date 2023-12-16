import axios from "axios"

const API_URL = "http://localhost:8080/auth/"



const register = (first_name, last_name, email, password) => axios.post(`${API_URL}register`, {
    first_name,
    last_name,
    email,
    password

})
    .then((res) => res.data.result)

const login = (email, password) => axios.post(`${API_URL}login`, {
    email,
    password
})
    // eslint-disable-next-line consistent-return
    .then((res) => {
        if (res.status === 200) {
            localStorage.setItem("auth_token", res.data.result.access_token);
            localStorage.setItem("auth_token_type", res.data.result.token_type);
        }
        return res.data.result
    })



const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_token_type")
}

export default {
    login,
    register,
    logout
}