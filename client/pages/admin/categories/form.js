import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const Form = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const titleRef = useRef(null)
    const parentRef = useRef(null)
    const [allCategories, setAllCategories] = useState([])
    const [image, setImage] = useState(undefined)
    useEffect(() => {
        axios.get("http://localhost:5000/admin/categories", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllCategories(result.data.categories)
                setIsLoading(false)
            }
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("title", titleRef.current.value);
            formData.append("parent", parentRef.current.value || null);
            if(image) {
                for (let i = 0; i < image.length; i++) {
                    formData.append("image", image[i]);
                }
            }

            await axios.post(`http://localhost:5000/admin/categories/`, formData, {withCredentials: true}).then(result => {
                if (result.status === 201) {
                    Global_Success("category has been created successfully");
                    return setInterval(() => {
                        router.push("/admin/categories")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error)
             // return Global_Error(`${error.response.data.errors.message }`)
        }
    }
    return (
        <Fragment>
            {
                isLoading ? <h1>Loading</h1> : (
                    <form
                        className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                        encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" className={'admin_input'} placeholder={'category title....'} required={true}
                               ref={titleRef}/>
                        <select name="parent" className={'admin_input'} ref={parentRef}>
                            <option value={null} disabled={true} defaultChecked={true}>Select One category
                            </option>
                            {allCategories && allCategories.map(category => (
                                <option value={category._id} key={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <input type="file" className={' admin_input'} required={false}
                               onChange={(e) => setImage(e.target.files)}/>
                        <button className={'auth_button'} type={'submit'}>
                            Create category
                        </button>
                    </form>
                )
            }
        </Fragment>
    )
}
export default Form
