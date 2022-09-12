import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.timeoutErrorMessage = "Server is not responding"
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

export default axios
