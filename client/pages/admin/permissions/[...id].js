import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const EditForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const titleRef = useRef(null)
    const parentRef = useRef(null)
    const [allCategories, setAllCategories] = useState([])
    const [image, setImage] = useState(null)
    useEffect(() => {
        axios.get("http://localhost:5000/admin/categories", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllCategories(result.data.categories)
                setIsLoading(false)
            }
        })
    }, [])
    useEffect(() => {
        router.query.id && axios.get(`http://localhost:5000/admin/categories/${router?.query?.id}`).then(result => {
            if (result.status === 200) {
                const category = result.data.data
                titleRef.current.value = category.title
                setIsLoading(false)
            } else {
                setIsLoading(true)
            }
        })
    }, [router.query.id])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("title", titleRef.current.value);
            parentRef.current.value && formData.append("parent", parentRef.current.value);
            for (let i = 0; i < image.length; i++) {
                formData.append("image", image[i]);
            }

            router?.query?.id && await axios.put(`http://localhost:5000/admin/categories/${router?.query?.id}`, formData, {withCredentials: true}).then(result => {
                if (result.status === 200) {
                    Global_Success("category has been Updated successfully");
                    return setInterval(() => {
                        router.push("/admin/categories")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            return Global_Error(`${error.response.data.errors.message}`)
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
                            <option value={null} disabled={false} defaultChecked={true}>Select One category</option>
                            {allCategories && allCategories.map(category => (
                                <option value={category._id} key={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <input type="file" className={' admin_input'} required={false}
                               onChange={(e) => setImage(e.target.files)}/>
                        <button className={'auth_button'} type={'submit'}>
                            Update category
                        </button>
                    </form>
                )
            }
        </Fragment>
    )
}
export default EditForm