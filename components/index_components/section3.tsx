import ProductItemHomePage from "./sub_components/products";
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Product } from "@/src/shared/entities/Products/product";
import Image from "next/image";
import { HomePageSettings } from "@/src/shared/entities/AppManagement/homepage_settings";
import { useEffect, useState } from "react";
import ProductsController from "@/src/shared/controllers/products/ProductsController";
import { Skeleton } from "primereact/skeleton";

interface HeroProps {
    settings: HomePageSettings
}


export default function Section3(props: HeroProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)




    const responsiveOptions: CarouselResponsiveOption[] = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const arrivalProductTemplate = (product: Product) => {
        return (
            <div className="">
                <div>
                    <Image src={product.product_image} width={200} height={300} alt={`${product.product_name} image`} />
                </div>
                <div>
                    <p className="mb-0 text-sm">
                        {product.product_category?.category_name}

                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mt-0 mb-0">
                        {product.product_name}

                    </h4>
                </div>
                <div>
                    <h4 className="font-semibold mt-2">
                        N{product.product_price}
                    </h4>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (props.settings) {
            const getBestSelling = async () => {
                const another = props.settings.new_arrivals.split(",").map(async (s) => {
                    const foundProd = await ProductsController.getProductById(parseInt(s))
                    return foundProd
                })
                const resolve = await Promise.all(another)
                setProducts(resolve);
                setIsLoading(false);
            }
            getBestSelling()
        }

    }, [props.settings])

    return (
        <div className="text-center p-5 surface-100">
            <h1>New Arrivals</h1>
            <div className="md:flex md:gap-2 ">
                {isLoading ?
                    <Skeleton width="20rem" height="20rem" /> 
                    :
                    <Carousel
                        value={products}
                        numVisible={1}
                        numScroll={1}
                        responsiveOptions={responsiveOptions}
                        itemTemplate={arrivalProductTemplate}
                        className="max-w-full"
                        autoplayInterval={3000}
                    />
                }

            </div>
        </div>
    )
}