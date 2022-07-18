import React, {useEffect, useState} from 'react';
import {Form, FormButton, FormInput, FormWrapper} from "../../../components/FormsComponents";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import Swal from "sweetalert2";
import axios from "../../../conf/axios";
import {useUpdateUserMutation} from "../../../app/features/AdminApies/UsersApiSlice";
import LoadingComponent from "../../../components/LoadingComponent";

const AdminUsersForm = ({id = null}) => {

    const token = useSelector(selectCurrentToken)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [username, setUsername] = useState(null)
    const [mobileNumber, setMobileNumber] = useState(null)
    const [email, setEmail] = useState(null)
    const [birthday, setBirthday] = useState(null)
    const [Role, setRole] = useState(null)
    const [isPrime, setIsPrime] = useState(null)
    const [isBanned, setIsBanned] = useState(null)
    const [roles, setRoles] = useState([])
    const [update, {isLoading}] = useUpdateUserMutation()

    async function fetchRoles() {
        const {data} = await axios.get("/admin/roles", {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).catch(err => {
            console.log(err)
            return Swal.fire({
                title: "Error",
                text: "Something went wrong",
                icon: "error",
                confirmButtonText: "Ok"
            })
        })
        setRoles(data.roles)
    }

    useEffect(() => {
        axios.get(`/admin/users/${id}`, {headers: {authorization: `Bearer ${token}`}}).then(async response => {
            const {user} = response.data
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setUsername(user.username)
            setMobileNumber(user.mobileNumber)
            setEmail(user.email)
            setBirthday(user.birthday)
            setRole(user.Role)
            setIsPrime(user.isPrime)
            setIsBanned(user.isBanned)
            await fetchRoles()
            console.log(roles)
        }).catch(err => {
            console.log(err)
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.errors?.message
            })
        })
    }, [id])

    async function submitHandler(e) {
        try {
            e.preventDefault()
            const body = {
                firstName,
                lastName,
                username,
                mobileNumber,
                email,
                birthday,
                Role,
                isPrime,
                isBanned
            };

            const response = await update({
                token,
                body,
                id
            }).unwrap()
            if (response.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Success"
                })
                return window.location.reload()
            }
        } catch (err) {
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: err.data.errors.message
            })
        }

    }

    return (
        <FormWrapper>
            <Form onSubmit={(e) => submitHandler(e)}>

                {isLoading ? <LoadingComponent/> :
                    <>
                        <FormInput
                            required={false}
                            name={"firstName"}
                            placeholder={"firstName"}
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value)
                            }}
                        /> <FormInput
                        required={false}
                        name={"lastName"}
                        placeholder={"lastName"}
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value)
                        }}
                    /> <FormInput
                        required={false}
                        name={"username"}
                        placeholder={"username"}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    /> <FormInput
                        required={false}
                        name={"mobileNumber"}
                        placeholder={"mobileNumber"}
                        value={mobileNumber}
                        onChange={(e) => {
                            setMobileNumber(e.target.value)
                        }}
                    /> <FormInput
                        required={false}
                        name={"email"}
                        placeholder={"email"}
                        type={'email'}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    /> <FormInput
                        required={false}
                        name={"birthday"}
                        placeholder={"birthday"}
                        type={'date'}
                        value={birthday}
                        onChange={(e) => {
                            setBirthday(e.target.value)
                        }}
                    />
                        {/*Role selector */}
                        <select name="role" defaultValue={'Select Role'} onChange={(e) => {
                            console.log(e.currentTarget.value)
                            setRole(e.currentTarget.value)
                        }
                        }>
                            {roles && roles.map(role => (
                                <option value={role.title} key={role.title}>{role.title}</option>
                            ))}
                        </select>

                        <div className="flex">
                            <span>is Prime</span>
                            <FormInput
                                required={false}
                                name={"isPrime"}
                                placeholder={"isPrime"}
                                type={'checkbox'}
                                checked={!!isPrime}

                                onChange={(e) => {
                                    setIsPrime(Boolean(e.target.checked))
                                }}
                            />
                            <span>is Banned</span>
                            <FormInput
                                required={false}
                                name={"isBanned"}
                                placeholder={"isBanned"}
                                type={'checkbox'}

                                checked={!!isBanned}
                                onChange={(e) => {
                                    setIsBanned(Boolean(e.target.checked))
                                }}
                            />
                        </div>
                    </>
                }
                <FormButton value={"Create"} type={"submit"}>
                    Update
                </FormButton>
            </Form>
        </FormWrapper>)
};

export default AdminUsersForm;