import React, {useEffect, useRef} from 'react';
import UserLayout from "../../components/UserLayout";
import {useMutation, useQuery} from "@apollo/client";
import {GetUserDashboard_Query} from "../../graphql/Queries/GlobalQueries";
import {UpdateProfile_Mutation} from "../../graphql/Mutations/GlobalMutations";
import {Global_Error, Global_Success} from "../../conf/ConstantFunctions";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {logout} from "../../app/features/authSlice";

const Information = () => {
    const emailRef = useRef(undefined)
    const usernameRef = useRef(undefined)
    const mobileNumberRef = useRef(undefined)
    const addressRef = useRef(undefined)
    const birthdateRef = useRef(undefined)
    const {data, loading} = useQuery(GetUserDashboard_Query)
    const dispatch = useDispatch()
    const router = useRouter()
    const [updateInformationFunction, {data: updateData}] = useMutation(UpdateProfile_Mutation)
    useEffect(() => {
        if (!loading) {
            console.log(data)
            const userDashboardData = data.GetUserDashboard.data

            emailRef.current.value = userDashboardData?.email
            usernameRef.current.value = userDashboardData?.username
            mobileNumberRef.current.value = userDashboardData?.mobileNumber || ""
            addressRef.current.value = userDashboardData?.address || ""
            birthdateRef.current.value = userDashboardData?.birthdate?.split("T")[0] || ""
        }
    }, [data, loading])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateInformationFunction({
            variables: {
                email: emailRef.current.value,
                username: usernameRef.current.value,
                mobileNumber: mobileNumberRef.current.value,
                address: addressRef.current.value,
                birthdate: birthdateRef.current.value,
            }
        }).then((result) => {
            if (result?.data?.UpdateProfile.statusCode) {
                Global_Success("Your information updated successfully")
                setInterval( () => router.push("/auth/login") , 1500)
            }
        }).catch(err => {
            console.log(err)
            return Global_Error(err)
        })
    }
    return (
        <UserLayout>
            <form
                className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                {loading ? <h1>Loading</h1> : <>
                    <input type="text" className={'admin_input'} placeholder={'Email address'}
                           ref={emailRef}/>
                    <input type="text" className={'admin_input'} placeholder={'Username'}
                           ref={usernameRef}/>
                    <input type="text" className={'admin_input'} placeholder={'mobile number'}
                           ref={mobileNumberRef}/>
                    <input type="text" className={' admin_input'} placeholder={'your address'}
                           ref={addressRef}/>
                    <input type="date" className={' admin_input'} placeholder={'your birthdate'}
                           ref={birthdateRef}/>
                    <button className={'auth_button'} type={'submit'}>
                        Submit
                    </button>
                </>}
            </form>
        </UserLayout>
    );
};

export default Information;
