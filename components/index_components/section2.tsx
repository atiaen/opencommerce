import { HomePageSettings } from "@/src/shared/entities/AppManagement/homepage_settings";
import ProductItemHomePage from "./sub_components/products";
import { useEffect, useState } from "react";
import ProductsController from "@/src/shared/controllers/products/ProductsController";
import { Product } from "@/src/shared/entities/Products/product";
import { Skeleton } from "primereact/skeleton";

interface HeroProps {
    settings: HomePageSettings
}


export default function Section2(props: HeroProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        if (props.settings) {
            const getBestSelling = async () => {
                const another = props.settings.best_selling_products.split(",").map(async (s) => {
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
        <div className="text-center sm:p-3 md:p-5">
            <h1>Best Selling Products</h1>
            <div className="md:flex w-full md:gap-2 justify-content-center p-3">
                {isLoading ? 
                <>
                 <Skeleton height="7rem" ></Skeleton>
                 <Skeleton height="7rem"></Skeleton>
                 <Skeleton height="7rem"></Skeleton>
                </> 
                :
                products.map((p) => (
                    <ProductItemHomePage
                        imageUrl={p.product_image}
                        productName={p.product_name}
                        categoryName={p.product_category?.category_name as string}
                        price={p.product_price} 
                        id={p.id}
                    />
                ))}
            </div>
        </div>
    )
}