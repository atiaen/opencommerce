
import React, { useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import PageTitle from "@/components/shared/page_title";
import ProductItemHomePage from "../components/index_components/sub_components/products";
import { Product } from '@/src/shared/entities/Products/product';
import ProductsController from '@/src/shared/controllers/products/ProductsController';
import { useRouter } from 'next/router';

export default function Store() {
    const router = useRouter();
    const { category } = router.query;
    const [value, setValue] = useState<number[]>([20, 80]);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const op = useRef<any>(null);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const getAllProducts = async () => {
        try {
            const prods = await ProductsController.getAllProducts();
            setProducts(prods);
            setLoadingProducts(false)
            // const val = await ProductsController.getMinAndMaxValues();
            // console.log(val)
        } catch (error) {
            console.log(error);
            setLoadingProducts(false);
        }
    }

    const getProductsByCategory = async () => {
        try {
            const prods = await ProductsController.getProductsByCategory(parseInt(category as string));
            setProducts(prods);
            setLoadingProducts(false)
            // const val = await ProductsController.getMinAndMaxValues();
            // console.log(val)

        } catch (error) {
            console.log(error);
            setLoadingProducts(false);
        }
    }

    useEffect(() => {
        if (category !== undefined) {
            getProductsByCategory();
        } else {
            getAllProducts()
        }
    }, [category])

    return (
        <>
            <PageTitle title="Store" />
            <Navbar />
            <div className="p-4 md:p-8 mx-auto align-items-center">
                <div className="w-full md:flex md:align-items-start px-3">
                    <div className='mb-5'>
                        <h3 className='font-semibold'>Filter by Price</h3>
                        <Slider
                            value={value as [number, number]}
                            onChange={(e: SliderChangeEvent) => setValue(e.value as [number, number])}
                            className="md:w-30rem mb-3"
                            range
                        />
                        <span >&#8358;{value[0]} - &#8358;{value[1]}</span>
                    </div>
                    <div className='md:ml-6'>
                        <h3 className='font-semibold'>Filter By Reference</h3>
                        <Button type="button" label="Reference" color='grey' className='w-full' onClick={(e) => op.current.toggle(e)} />
                        <OverlayPanel className='' ref={op}>
                            <p className='mb-2 cursor-pointer'>Name, A-Z</p>
                            <p className='mb-2 cursor-pointer'>Name, Z-A</p>
                            <Divider />
                            <p className='mb-2 cursor-pointer'>Low to High</p>
                            <p className='mb-2 cursor-pointer'>High to Low</p>
                        </OverlayPanel>
                    </div>
                </div>
                <div className="md:flex w-full grid justify-content-start p-3">
                    {
                        products.length > 0 && products && !loadingProducts ?
                            products.slice(first, first + rows).map((prod, index) => (
                                <ProductItemHomePage
                                    key={index}
                                    imageUrl={prod.product_image}
                                    productName={prod.product_name}
                                    categoryName={prod.product_category?.category_name as string}
                                    price={prod.product_price}
                                    id={prod.id}
                                />
                            )) :
                            null
                    }
                    {
                        products.length === 0 && !loadingProducts ?
                            <h4>Unfortunately we do not have any products at the moment please come back at a later date</h4>
                            : null
                    }
                    {
                        loadingProducts === true ?
                            <ProgressSpinner />
                            :
                            null
                    }
                </div>
                <Paginator first={first} rows={rows} totalRecords={products.length} rowsPerPageOptions={[1, 10, 20, 30]} onPageChange={onPageChange} />

            </div>
            <Footer />
        </>
    )
}