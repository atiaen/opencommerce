import ProductsController from "@/src/shared/controllers/products/ProductsController";
import ReservationController from "@/src/shared/controllers/reservations/ReservationsController";
import { Product } from "@/src/shared/entities/Products/product";
import { Reservation } from "@/src/shared/entities/Reservation/reservation"
import { ReservedProducts } from "@/src/shared/entities/ReservedProducts/reserved_products";
import Image from "next/image";
import { Button } from "primereact/button";
import { useEffect, useState } from "react"
import { remult } from "remult";


interface ReserveProps {
    reservationId: number
}

interface orderProd {
    product: Product;
    quantity: string | number
}

export default function ReservationDetails(props: ReserveProps) {

    const [reservation, setReservation] = useState<Reservation>();
    const [prodStrings, setProdStrings] = useState<string>('');
    const [products, setProducts] = useState<orderProd[]>([]);

    useEffect(() => {
        const getReserve = async () => {
            const reserve = await ReservationController.getReservationById(props.reservationId);
            const reserveProds = await remult.repo(ReservedProducts).findFirst({
                id: reserve.products?.id
            })
            setProdStrings(reserveProds.products);
            setReservation(reserve);
        }
        getReserve();

    }, [props.reservationId]);

    useEffect(() => {
        if (prodStrings !== '') {
            const getProds = async () => {
                const another = prodStrings.split(",").map(async (s) => {
                    const split2 = s.split("__");
                    const foundProd = await ProductsController.getProductById(parseInt(split2[0]))
                    return {
                        product: foundProd,
                        quantity: split2[1]
                    }
                })
                console.log(another);
                const resolve = await Promise.all(another)
                setProducts(resolve);
                console.log(resolve)
            }
            getProds();
        }
    }, [prodStrings])

    return (
        <div>
            <div>
                <p className="font-semibold ">Order number: {reservation?.reservationNumber}</p>
                <p className="font-semibold ">Order Date: {new Date(reservation?.reservationDate as Date).toDateString()}</p>
                <p className="font-semibold ">Order Status: {reservation?.reservationStatus}</p>
            </div>
            <div>
                <p className="font-semibold ">Products</p>
                {products.length > 0 ? products.map((pr, index) => (
                    <div className="border-1 border-round mb-2 p-3" key={index}>
                        <div className="flex justify-content-between">
                            <div>
                                <p className='mt-0 mb-0'>Product Name: {pr.product.product_name}</p>
                                <p className='mt-0 mb-0'>Product Price: &#8358;{pr.product.product_price.toLocaleString()}</p>
                                <p className='mt-0'>Quantity: {pr.quantity}</p>
                            </div>
                            <div>
                                <Image src={pr.product.product_image} alt={pr.product.product_name} width={50} height={50} />
                            </div>
                        </div>
                    </div>
                )) : null}
            </div>
            <div>
                <p className="font-semibold ">Order Total: &#8358;{reservation?.total.toLocaleString()}</p>
            </div>
        </div>
    )
}