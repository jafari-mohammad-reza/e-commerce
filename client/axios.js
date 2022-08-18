import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
// axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("access_token")
axios.defaults.headers.common["Content-Type"] = "application/json"
axios.defaults.headers.common["Accept"] = "application/json"
axios.defaults.timeoutErrorMessage = "Server is not responding"
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.crossdomain = true
axios.defaults.xsrfCookieName = "XSRF-TOKEN"
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN"
export default axios
