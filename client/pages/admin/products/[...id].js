import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const EditForm = () => {
    const [isLoading , setIsLoading] = useState(false)
    const router = useRouter()
    const titleRef=useRef(null)
    const tagsRef=useRef(null)
    const overViewRef=useRef(null)
    const categoryRef=useRef(null)
    const priceRef=useRef(null)
    const discountRef=useRef(null)
    const stockCountRef=useRef(null)
    const descriptionRef=useRef(null)
    const [images , setImages] = useState([])
    const [allCategories , setAllCategories] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/admin/categories" , {withCredentials:true}).then((result) => {
            if(result.status === 200 ){
                setAllCategories(result.data.categories)
            }
        })
    } , [])
    useEffect(() => {
        router.query.id &&  axios.get(`http://localhost:5000/admin/products/${router?.query?.id}`).then(result => {
            if(result.status === 200){
                const product = result.data.product
                titleRef.current.value = product.title
                tagsRef.current.value = product.tags
                overViewRef.current.value = product.overView
                categoryRef.current.value = product.category
                priceRef.current.value = product.price
                discountRef.current.value = product.discount
                stockCountRef.current.value = product.stockCount
                descriptionRef.current.value = product.description
                setIsLoading(false)
            }else{
                setIsLoading(true)
            }
        })
    } , [router.query.id])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("title", titleRef.current.value);
            formData.append("overView", overViewRef.current.value);
            formData.append("tags", tagsRef.current.value);
            formData.append("category", categoryRef.current.value);
            formData.append("price", priceRef.current.value);
            formData.append("discount", discountRef.current.value);
            formData.append("stockCount", stockCountRef.current.value);
            formData.append("description", descriptionRef.current.value);
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
            router?.query?.id && await axios.put(`http://localhost:5000/admin/products/${router?.query?.id}` , formData , {withCredentials:true}).then(result => {
                if(result.status === 200){
                    Global_Success("Product has been Updated successfully");
                    return setInterval(() => {
                        router.push("/admin/products")
                    } , 2000)
                }else{
                    return Global_Message("Something happened")
                }
            })
        }
        catch (error){
            console.log(error?.response.data.errors.message)
            return Global_Error(`${error.response.data.errors.message}`)
        }
    }
    return (
        <Fragment>
            {
                isLoading ? <h1>Loading</h1> : (
                    <form className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'} encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" className={'admin_input'} placeholder={'Product title....'} required={true} ref={titleRef}/>
                        <input type="text" className={'admin_input'} placeholder={'Product overView ....'} required={true} ref={overViewRef}/>
                        <input type="text" className={'admin_input'} placeholder={'Tag1,Tag2,Tag3'} required={true} ref={tagsRef}/>
                        <select name="category"  className={'admin_input'} ref={categoryRef}>
                            {allCategories && allCategories.map(category => (
                                <option  value={category._id} key={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <input type="text" className={' admin_input'} placeholder={'Product price....'} required={true} ref={priceRef}/>
                        <input type="text" className={' admin_input'} placeholder={'Product discount...'} required={true} ref={discountRef}/>
                        <input type="text" className={' admin_input'} placeholder={'stock count'} required={true} ref={stockCountRef}/>
                        <input type="file" multiple={true} className={' admin_input'}  required={true} onChange={(e) => setImages([...images,...e.target.files])}/>
                        <textarea rows={10} cols={15} className={'w-full my-10 mx-5 bg-sky-50  border-0 outline-none transition-all duration-100 shadow  shadow-3xl focus:border-b-4 border-gray-600 py-6 px-12 rounded-2xl'} placeholder={'Product description'} required={true} ref={descriptionRef}/>
                        <button className={'auth_button'} type={'submit'}>
                            Update product
                        </button>
                    </form>
                )
            }
        </Fragment>
    )
}
export default  EditForm