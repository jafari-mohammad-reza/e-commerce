import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const EditForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const titleRef = useRef(null)
    const overViewRef = useRef(null)
    const contentRef = useRef(null)
    const tagsRef = useRef(null)
    const categoryRef = useRef(null)
    const [allCategories, setAllCategories] = useState([])
    const [image, setImage] = useState(null)
    useEffect(() => {
        axios.get("http://localhost:5000/admin/categories", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllCategories(result.data.categories)
            }
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/admin/blogs/${router?.query?.id}`, {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                const blog = result.data.blog;
                titleRef.current.value = blog.title
                overViewRef.current.value = blog.overView
                contentRef.current.value = blog.content
                tagsRef.current.value = blog.tags
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
            formData.append("overView", overViewRef.current.value);
            formData.append("tags", tagsRef.current.value);
            formData.append("category", categoryRef.current.value);
            formData.append("content", contentRef.current.value);
            for (let i = 0; i < image.length; i++) {
                formData.append("image", image[i]);
            }

            router?.query?.id && axios.put(`http://localhost:5000/admin/blogs/${router?.query?.id}`, formData, {withCredentials: true}).then(result => {
                if (result.status === 200) {
                    Global_Success("blog has been updated successfully");
                    return setInterval(() => {
                        router.push("/admin/blogs")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error)
            return Global_Error(`${error}`)
        }
    }
    return (
        <Fragment>
            {
                isLoading ? <h1>Loading</h1> : (
                    <form
                        className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                        encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" className={'admin_input'} placeholder={'blog title....'} required={true}
                               ref={titleRef}/>
                        <input type="text" className={'admin_input'} placeholder={'blog overView....'} required={true}
                               ref={overViewRef}/>
                        <input type="text" className={'admin_input'} placeholder={'blog tags....'} required={true}
                               ref={tagsRef}/>
                        <textarea rows={10} cols={15}
                                  className={'w-full my-10 mx-5 bg-sky-50  border-0 outline-none transition-all duration-100 shadow  shadow-3xl focus:border-b-4 border-gray-600 py-6 px-12 rounded-2xl'}
                                  placeholder={'blog content'} required={true} ref={contentRef}/>
                        <select name="parent" className={'admin_input'} ref={categoryRef}>
                            <option value={undefined} disabled={false} defaultChecked={true}>Select One category
                            </option>
                            {allCategories && allCategories.map(category => (
                                <option value={category._id} key={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <input type="file" className={' admin_input'} required={true}
                               onChange={(e) => setImage(e.target.files)}/>
                        <button className={'auth_button'} type={'submit'}>
                            Update blog
                        </button>
                    </form>
                )
            }
        </Fragment>
    )
}
export default EditForm