import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from "./ProductsCard";
import {A11y, Navigation} from "swiper";
import {useWindowInnerWidth} from "../conf/ConstantFunctions";

export default function ProductSwiper({products, title}) {
    // const [windowWidth, setWindowWidth] = useState(undefined)
    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         setWindowWidth(window.innerWidth)
    //         window.addEventListener("resize", () => {
    //             setWindowWidth(window.innerWidth)
    //         })
    //         return () => {
    //             window.removeEventListener("resize", () => {
    //                 setWindowWidth(window.innerWidth)
    //             })
    //         }
    //     }
    //
    // }, [windowWidth])
    const windowWidth = useWindowInnerWidth()
    console.log(windowWidth)
    return (
        <div className={'w-full h-max my-20 cursor-grabbing'}>
            <h2 className={'text-3xl md:text-4xl lg:text-6xl font-bold place-self-center mb-10'}>{title}</h2>
            <Swiper
                modules={[A11y, Navigation]}
                slidesPerView={
                    windowWidth > 1200 ? 6 : windowWidth > 768 ? 3 : windowWidth > 528 ? 2 : 1
                } navigation={true}
                spaceBetween={300}
                autoplay={true}

            >


                {products.map((product, index) => {
                    return <SwiperSlide key={product._id}>
                        <ProductCard product={product}/>
                    </SwiperSlide>
                })}
            </Swiper>

        </div>

    )

}