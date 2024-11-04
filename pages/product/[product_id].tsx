import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import PageTitle from "@/components/shared/page_title";
import { Button } from "primereact/button";
import { Skeleton } from 'primereact/skeleton';
import { Product } from "@/src/shared/entities/Products/product";
import ProductsController from "@/src/shared/controllers/products/ProductsController";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import useAuth from "@/src/shared/utils/hooks/authHook";
import CartController from "@/src/shared/controllers/cart/CartController";

export default function IndividualProduct() {
    const router = useRouter();
    const auth = useAuth();
    const { product_id } = router.query;
    const [amountValue, setAmountValue] = useState<number>(1);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [product, setProduct] = useState<Product>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [productId, setProductId] = useState<number>();

    const getProduct = async () => {
        try {
            const id = parseInt(product_id as string, 10);
            const res = await ProductsController.getProductById(id);
            setHasLoaded(true);
            setProduct(res);
        } catch (error) {
            toast.error("Could not fetch product details \n Please try again later");
        }
    }

    const addProductToCart = async () => {
        setIsLoading(true);
        try {
            const cart = await CartController.addProductToCart(auth.user?.id as number, parseInt(product_id as string, 10), amountValue)
            if (cart) {
                toast.success("Successfully added product to cart");
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(`Could not product to cart \n Reason ${error}`);
        }

    }

    useEffect(() => {
        getProduct()
        console.log(auth)
    }, [])

    return (
        <>
            <PageTitle title="PharmaCom -  Product" />
            <Navbar />
            <div className="px-4 mt-4">
                <div className="md:flex justify-content-evenly">
                    <div className='border-1 flex justify-content-center border-200'>
                        {!hasLoaded ?
                            <Skeleton size="10rem"></Skeleton>
                            :
                            <Image width={400} height={500} src={product?.product_image ? product.product_image : ""} alt='' />
                        }
                    </div>
                    <div className="md:w-6 w-full">
                        <div>
                            {!hasLoaded ?
                                <Skeleton height="2rem" className="mb-2"></Skeleton> :
                                <h1>{product?.product_name}</h1>
                            }

                            {!hasLoaded ?
                                <Skeleton width="10rem" height="4rem"></Skeleton>
                                :
                                <p className="text-justify line-height-4">
                                    {product?.product_description}
                                </p>
                            }

                        </div>
                        <div className="md:flex mb-4">
                            {!hasLoaded ?
                                <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
                                :
                                <div>
                                    <span className="font-bold mb-0">Price:</span>
                                    <InputNumber
                                        mode="currency"
                                        currency="NGN"
                                        locale="en-NG"
                                        value={product?.product_price}
                                        readOnly
                                        disabled
                                        className="border-none font-bold mb-3 text-black"
                                        inputClassName="border-none"
                                    />
                                </div>
                                // <h3>${product?.product_price}</h3>
                            }
                            <div className="flex-auto">
                                <InputNumber
                                    inputId="horizontal-buttons"
                                    value={amountValue}
                                    onValueChange={(e: InputNumberValueChangeEvent) => setAmountValue(e.value as number)}
                                    showButtons
                                    buttonLayout="horizontal"
                                    step={1}
                                    min={1}
                                    max={10}
                                    disabled={!auth.user}
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                />
                            </div>
                        </div>
                        <div className="">
                            <Button
                                disabled={!auth.user}
                                outlined
                                label="Add to Cart"
                                loading={isLoading}
                                onClick={addProductToCart}
                            />
                            {!auth.user ?
                                <p className="text-red-500 mt-3">Please either log in or create an account to add this product to your cart</p> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}