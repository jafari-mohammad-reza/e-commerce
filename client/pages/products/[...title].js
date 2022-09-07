import React, {Fragment, useEffect} from 'react';
import {useRouter} from "next/router";
import {useMutation, useQuery} from "@apollo/client";
import {GetProductDetail_Query} from "../../graphql/Queries/GlobalQueries";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {Swiper, SwiperSlide} from "swiper/react";
import Image from "next/image";
import {A11y, Autoplay, Navigation, Zoom} from "swiper";
import Link from "next/link";
import {AiOutlineUser} from "react-icons/ai";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/features/authSlice";
import {ProductParentComment, ProductReplyComment} from "../../graphql/Mutations/GlobalMutations";
import {Global_Error, Global_Message, Global_Success} from "../../conf/ConstantFunctions";
import {BsFillReplyFill} from "react-icons/bs";

const ProductByTitle = () => {
    const {query} = useRouter();
    const [product, setProduct] = React.useState(null);
    const title = query.title && query.title[0];
    const commentRef = React.useRef(null);
    const [isReply, setIsReply] = React.useState(false);
    const [replyComment, setReplyComment] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const selector = useSelector(selectCurrentUser)
    const [mutateFunction, {
        data: commentData,
        loading: commentLoading,
        error: commentError
    }] = useMutation(ProductParentComment);
    const [ReplyMutateFunction, {
        data: ReplyCommentData,
        loading: ReplyCommentLoading,
        error: ReplyCommentError
    }] = useMutation(ProductReplyComment);
    const {data, loading} = useQuery(GetProductDetail_Query, {
        variables: {
            title: title
        }
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUser(selector)
        }
    }, [selector])
    useEffect(() => {
        if (data && !loading) {
            setProduct(data.GetProductDetail);
        }
    }, [data])
    const handleComment = (e) => {
        e.preventDefault()
        if (isReply) {
            ReplyMutateFunction({
                variables: {
                    productId: product._id,
                    content: commentRef.current.value,
                    parent: replyComment
                }
            }).then(r => {
                if (ReplyCommentLoading) return Global_Message('Submitting...');
                else if (ReplyCommentError) return Global_Error(`${ReplyCommentError.message}`);
                else return Global_Success("Your comment has been submitted and will be approved soon.")
            })
        } else {
            mutateFunction({variables: {productId: product._id, content: commentRef.current.value}}).then(r => {
                if (commentLoading) return Global_Message('Submitting...');
                else if (commentError) return Global_Error(`${commentError.message}`);
                else return Global_Success("Your comment has been submitted and will be approved soon.")
            })
        }
        setReplyComment(null)
        commentRef.current.value = ""

    }
    return (
        <Fragment>
            {!loading && product && (
                <div className={'flex flex-col items-center justify-start py-10'}>
                    <div className={'flex flex-row items-start justify-around space-x-32 flex-wrap w-full h-max'}>
                        <div className={'w-full md:w-2/6 '}>

                            <Swiper
                                modules={[A11y, Navigation, Autoplay, Zoom]}
                                slidesPerView={1}
                                navigation={true}
                                autoplay={true}
                                zoom={true}
                            >
                                {
                                    product.imagesURL.map((image, index) => {
                                        return <SwiperSlide key={index}>
                                            <Image src={image} alt={product.title}
                                                   width={300} height={250} objectFit={"contain"}
                                                   layout={'responsive'}/>
                                        </SwiperSlide>
                                    })
                                }
                            </Swiper>
                        </div>

                        <div className={'flex flex-col items-start justify-start w-full md:w-3/6 flex-grow space-y-10'}>
                            <h2 className={'text-3xl md:text-4xl lg:text-7xl'}>{product.title}</h2>
                            <h3 className={'text-2xl md:text-3xl '}>
                                {product.overView}
                            </h3>
                            <div className="flex items-center space-x-10 flex-wrap w-3/4">
                                {product.tags.map((tag, index) => {
                                    return <Link href={`/products?tag=${tag}`} key={index}>
                                        <span key={index}
                                              className={'bg-gray-200 rounded-2xl px-5 py-2.5 text-lg font-semibold cursor-pointer text-gray-700 '}>#{tag}</span>
                                    </Link>
                                })}
                            </div>
                            <hr className={'w-3/4 bg-gray-300'}/>
                            {
                                product.discount && product.discount > 0 ? (
                                    <div className={'flex flex-row items-start justify-between w-3/4'}>
                                        <div className="flex flex-col items-start space-y-3 justify-start">
                                            <h3 className={'text-2xl md:text-3xl '}>
                                                {product.discountedPrice} $
                                            </h3>
                                            <h3 className={'text-2xl md:text-3xl line-through'}>
                                                {product.price} $
                                            </h3>
                                        </div>
                                        <h4 className={'text-2xl md:text-3xl text-red-600'}>
                                            {product.discount} off %
                                        </h4>
                                    </div>
                                ) : <h3 className={'text-2xl md:text-3xl '}>
                                    {product.price} $
                                </h3>
                            }
                            {
                                product.stockCount < 30 && <h4 className="text-red-500 text-2xl md:text-3xl">
                                    Only {product.stockCount} items left !
                                </h4>
                            }
                            <hr className={'w-3/4 bg-gray-300'}/>
                            <div className={'w-3/4 break-words flex flex-col items-start justify-start'}>
                                <p className="text-xl md:text-2xl leading-6 md:leading-loose">
                                    {product.description}
                                </p>
                                {
                                    product.physicalFeatures && product.physicalFeatures.length > 0 && (
                                        <div className={'flex flex-col items-start justify-start my-3 space-y-3 w-full'}>
                                            <hr className={'w-full bg-gray-300'}/>
                                            <h3 className={'text-2xl md:text-3xl '}>
                                                Physical Features
                                                {console.log(product.physicalFeatures)}
                                            </h3>
                                            <div className={'flex flex-col space-y-8 items-start  w-3/4'}>

                                                {
                                                    product.physicalFeatures.map((feature, index) => {
                                                        return <div key={index}
                                                                    className={'flex flex-row items-center justify-start space-x-10 w-3/4'}>
                                                            <h3 className={'text-2xl md:text-3xl '}>
                                                                {feature.name} :
                                                            </h3>
                                                            <h3 className={'text-2xl md:text-3xl '}>
                                                                {feature.value}
                                                            </h3>
                                                        </div>
                                                    })}

                                            </div>
                                        </div>
                                    )}

                            </div>
                        </div>
                    </div>
                    <div className={'w-full h-max px-10 mt-32 '}>
                        <h2 className={'text-center text-3xl md:text-4xl lg:text-6xl font-bold mb-24'}>
                            Comments
                        </h2>
                        {product.comments ? product.comments.filter(comment => comment.isApproved).map((comment, index) => {

                            return <div key={index} className={'flex flex-col items-start justify-start w-full px-12'}>
                                <div className={`text-2xl md:text-3xl mb-6 flex items-center space-x-4 `}>
                                    <AiOutlineUser/>
                                    <h3>
                                        {comment.author.username || "User"}
                                    </h3>
                                    <BsFillReplyFill
                                        className={'text-2xl transition-all hover:scale-125 cursor-pointer'}
                                        onClick={() => {
                                            if (comment.ReplyAble) {
                                                setIsReply(true)
                                                setReplyComment(comment._id)
                                                commentRef.current.focus()
                                            } else {
                                                return Global_Message("This comment is not reply able")
                                            }
                                        }
                                        }/>
                                </div>
                                <h3 className={'text-2xl md:text-3xl px-24 '}>
                                    {comment.content}
                                </h3>
                                <div className={'flex flex-col px-12 py-10'}>
                                    {/*    Replies*/}
                                    {comment.Replies && comment.Replies.filter(comment => comment.isApproved === true).map((reply, index) => {
                                        return <div key={index}
                                                    className={'flex flex-col items-start justify-start w-full'}>
                                            <h3 className={'text-2xl md:text-3xl '}>
                                                {reply.author.username || reply.author.mobileNumber || 'Anonymous'}
                                            </h3>
                                            <h3 className={'text-2xl md:text-3xl '}>
                                                {reply.content}
                                            </h3>
                                        </div>
                                    })}

                                </div>
                            </div>
                        }) : <h3 className={'text-4xl text-center my-24'}>No Comment yet</h3>}
                        {
                            user ? (
                                <form className={'w-auto  mx-auto flex flex-col space-y-4 items-center justify-center'}
                                      onSubmit={handleComment}
                                >
                            <textarea className={'px-10 py-8 border-black border-2 '} name={'content'}
                                      rows={10}
                                      cols={100}
                                      ref={commentRef}
                                      placeholder={'Share your opinion with us'}/>
                                    <button className={'px-10 py-8 bg-blue-500 text-white font-bold'}
                                            type={"submit"}>
                                        Comment
                                    </button>

                                </form>
                            ) : (
                                <div className={'w-3/5  mx-auto   border-2 border-black '}>
                                    <h3 className={'text-center my-24'}>
                                        Please login to share your opinion
                                    </h3>
                                </div>)
                        }
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default ProductByTitle;
