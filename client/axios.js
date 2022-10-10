import axios from "axios"
import {SERVER_ADDRESS} from "./conf/constantValues";
axios.defaults.baseURL = SERVER_ADDRESS || 'http://localhost:8080'
axios.defaults.timeoutErrorMessage = "Server is not responding"
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

export default axios
