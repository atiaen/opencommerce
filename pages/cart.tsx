import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import PageTitle from "@/components/shared/page_title";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import CartItems from "@/src/shared/utils/types/cartType";
import CartController from "@/src/shared/controllers/cart/CartController";
import useAuth from "@/src/shared/utils/hooks/authHook";
import { toast } from "react-hot-toast";
import Image from 'next/image';
import ReservationController from "@/src/shared/controllers/reservations/ReservationsController";
import { useRouter } from "next/router";
import { Reservation } from "@/src/shared/entities/Reservation/reservation";
import { Carts } from "@/src/shared/entities/Cart/cart";
import { remult } from "remult";
import { ReservedProducts } from "@/src/shared/entities/ReservedProducts/reserved_products";

//tableStyle={{ minWidth: '50rem' }}

export default function Cart() {
    const auth = useAuth();
    const router = useRouter();
    const [items, setCartItems] = useState<CartItems[]>();
    const [loadingItems, setLoadingItems] = useState<boolean>(true);
    const [totalPrice, setTotalPrice] = useState<number>(0);


    const removeIndividualItem = async (item: number) => {
        try {
            await CartController.removeItemFromCart(auth.user?.id as number, item);
            toast.success("Item removed from cart");
            router.reload();

        } catch (error) {
            console.log(error);
            toast.error("Could not remove item from cart");
        }
    }

    const Images = (product: CartItems) => {
        return <Image src={product.product.product_image} alt={product.product.product_name} width={200} height={200} />;
    };

    const removeItem = (e: CartItems) => {
        return (
            <div className='flex justify-content-evenly'>
                <Button
                    onClick={() => removeIndividualItem(e.product.id)}
                    label='Remove'
                    icon="pi pi-times"
                    className="bg-blue-500 hover:bg-primary-300 hover:border-blue-300 hover:text-400"
                />
            </div>
        )
    }

    const makeReserve = async () => {
        try {
            const cartRepo = await remult.repo(Carts);
            const resProdRepo = await remult.repo(ReservedProducts);
            const items = await cartRepo.find({
                where: {
                    user_id: auth.user?.id as number
                }
            });

            const reserved = await ReservationController.makeReservation(auth.user?.id as number, totalPrice);
            let reserveProd =  new ReservedProducts();

            const numbers = items.reduce<any[]>((acc,ini) => [...acc ,ini.product_id as number + "__" + ini.quantity],[]).toString();
            reserveProd.products = numbers;
            reserveProd.reservationId = reserved.id;
            reserveProd.reservationNumber = reserved.reservationNumber;

            await resProdRepo.save(reserveProd);    
            
            await CartController.emptyCart(auth.user?.id as number);

            toast.success("Successfully made an order! \n Please hold on as a representative will be in contact with you shortly");
            router.push('/store');
        } catch (error) {
            console.log(error);
            toast.error("Could not place your order! \n Please try again later or contact us");
        }
    }

    const clearCart = async () => {
        try {
            await CartController.emptyCart(auth.user?.id as number);
            toast.success("Successfully cleared cart");
            router.reload();
        } catch (error) {
            console.log(error);
            toast.error("Could clear your cart. \n Please try again later");
        }
    }

    async function getCartItems() {
        try {
            if (auth.user) {
                const items = await CartController.getUserCartDetails(auth.user?.id as number)
                const total_price = items.reduce((acc, items) => {
                    return acc + items.product.product_price * items.quantity
                }, 0);
                setTotalPrice(total_price);
                setCartItems(items);
                setLoadingItems(false);
            } else {
                setCartItems([]);
                setLoadingItems(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Could not get cart item");
        }
    }

    useEffect(() => {
        getCartItems();
    }, [auth.user])

    return (
        <>
            <PageTitle title="Cart | PharmaCom" />
            <Navbar />
            <div className="p-3 flex justify-content-center">
                <h2>Cart</h2>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto flex-column">
                    <DataTable loading={loadingItems} showGridlines value={items}>
                        <Column body={Images} style={{ width: "5%" }} header="Image"></Column>
                        <Column field="product.product_name" header="Name"></Column>
                        <Column field="product.product_price" header="Price"></Column>
                        <Column field="quantity" style={{ width: "5%" }} header="Quantity"></Column>
                        <Column field="total_price" style={{ width: "8%" }} header="Total"></Column>
                        <Column body={removeItem} style={{ width: "7%" }} header="Remove"></Column>
                    </DataTable>
                </div>
            </div>
            {items && items.length > 0 &&
                <div className="justify-content-center md:flex md:justify-content-between p-4">
                    <div className="md:w-3 flex justify-content-between align-items-center">
                        <Button onClick={clearCart} label="Clear Cart" className="bg-white border-blue-500 hover:text-300 mb-3 md:mb-0 h-3rem text-900 " />
                        <Button onClick={() => router.push("/store")}
                            label="Continue Shopping" className="bg-blue-500 h-3rem hover:bg-primary-300 mb-3 md:mb-0 hover:border-blue-300 hover:text-400" />
                    </div>

                    <div className="md:w-3">
                        <div className="border-bottom-1 border-200 text-right">
                            <h4 className="font-semibold">Order Total</h4>
                        </div>
                        <div className="flex justify-content-between mt-3">
                            <span>Total</span>
                            <span>&#8358;{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="mt-7 flex justify-content-center">
                            <Button onClick={makeReserve} label="Place Order" className="bg-blue-500  w-full h-3rem hover:bg-primary-300 hover:border-blue-300 hover:text-400" />
                        </div>
                    </div>

                </div>}
            <Footer />
        </>
    )
}