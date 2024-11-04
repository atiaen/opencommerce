import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import PageTitle from "@/components/shared/page_title";
import { Card } from "primereact/card";
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import useAuth from "@/src/shared/utils/hooks/authHook";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Reservation } from "@/src/shared/entities/Reservation/reservation";
import ReservationController from "@/src/shared/controllers/reservations/ReservationsController";
import ReservationDetails from "@/components/shared/reservation_details";
import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem'

export default function Profile() {
    const auth = useAuth();
    const router = useRouter();
    //details,orders,settings,prodets
    const [menuMode, setMenuMode] = useState<string>('details');
    const [isViewingProdDetails, setIsViewProdDetails] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [email, setEmail] = useState<string>()
    const [address, setAddress] = useState<string>();
    const [selectedRes, setSelectedRes] = useState<number>();
    const [resOrders, setReserveOrders] = useState<Reservation[]>([]);

    let items = [
        {
            label: 'My Details',
            icon: 'pi pi-user',
            command: () => {
                setMenuMode('details');
                setIsViewProdDetails(false);
            },
        },
        {
            label: 'My Orders', icon: 'pi pi-credit-card',
            command: () => {
                setMenuMode('orders');
                setIsViewProdDetails(false);
            },
        },
        // {
        //     label: 'Settings', icon: 'pi pi-fw pi-cog',
        //     command: () => {
        //         setMenuMode('settings');
        //         setIsViewProdDetails(false);
        //     },
        // },
    ];

    const getUserOrders = async () => {
        try {
            const od = await ReservationController.getAllReservationsByUsers(auth.user?.id as number)
            setReserveOrders(od);
        } catch (error) {

        }
    }

    useEffect(() => {
        setFirstName(auth.user?.first_name as string);
        setLastName(auth.user?.last_name as string);
        setEmail(auth.user?.email_address);
        setAddress(auth.user?.delivery_address)
        if (auth.user !== undefined) {
            getUserOrders();
        }
    }, [auth.user])

    return (
        <>
            <PageTitle title="Profile" />
            <Navbar />
            <div className="md:p-5 p-3 md:flex md:justify-content-center">
                <div className="md:w-9 w-full">
                    {!auth.user ? <span className="text-red-500 mt-3">You are currently not signed in. Please login or create an account to view your orders</span> : null}
                    <h2 className="px-3 md:text-left text-center md:mb-0 mb-4">My Account</h2>
                    <div className="md:flex justify-content-between">
                        <div className="md:block hidden md:w-3">
                            <Menu className="border-none" model={items} />
                        </div>
                        <div className="md:hidden mb-3">
                            <TabMenu className="" model={items} />
                        </div>
                        <div
                        className="md:w-9"
                        >
                            <Card
                                // style={} 
                                title={menuMode === 'details' ? "Account Details" : menuMode === 'orders' ? "My Orders" : "Settings"}
                            >
                                {menuMode === 'details' && !isViewingProdDetails ?
                                    <>
                                        <p className="font-semibold">Personal Information</p>
                                        <Divider />
                                        <div className='formgrid grid'>
                                            <div className="field col-6">
                                                <div className="flex flex-column gap-2 mb-4">
                                                    <label htmlFor="first_name">First Name</label>
                                                    <InputText value={firstName} onChange={(e) => setFirstName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                                </div>
                                            </div>
                                            <div className="field col-6">
                                                <div className="flex flex-column gap-2 mb-4">
                                                    <label htmlFor="first_name">Last Name</label>
                                                    <InputText value={lastName} onChange={(e) => setLastName(e.target.value)} id="last_name" aria-describedby="last_name_help" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-semibold">Email</p>
                                        <Divider />
                                        <div className='formgrid grid'>
                                            <div className="field col-6">
                                                <div className="flex flex-column gap-2 mb-4">
                                                    <label htmlFor="first_name">Email</label>
                                                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email" aria-describedby="email_help" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-semibold">Address Information</p>
                                        <Divider />
                                        <div className='formgrid grid'>
                                            <div className="field col-6">
                                                <div className="flex flex-column gap-2 mb-4">
                                                    <label htmlFor="first_name">Address</label>
                                                    <InputTextarea value={address} onChange={(e) => setAddress(e.target.value)} id="address" aria-describedby="address_help" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-content-end">
                                            <Button label="Edit" icon="pi pi-check" />
                                        </div>
                                    </> : null}

                                {menuMode === 'orders' && !isViewingProdDetails ?
                                    <>
                                        {/* <p className="font-semibold">My Reservations</p> */}
                                        <p className="font-semibold">{resOrders.length} Total Order(s)</p>
                                        <Divider />
                                        <div
                                            style={{
                                                height: 400,
                                                overflowY: "scroll",
                                                scrollbarWidth: "none"
                                            }}
                                            className="gap-1"
                                        >
                                            {resOrders.length > 0 ? resOrders.map((r, index) => (
                                                <div
                                                    onClick={() => {
                                                        setIsViewProdDetails(true);
                                                        setSelectedRes(r.id);
                                                    }}
                                                    key={index}
                                                    className="border-round border-2 flex justify-content-between p-3 cursor-pointer mb-3">
                                                    <div>
                                                        <span className="font-semibold mb-0 mt-0">
                                                            Order Number:
                                                            <p className="font-normal mt-0">#{r.reservationNumber}</p>
                                                        </span>
                                                        <span className="font-semibold mb-0 mt-0">
                                                        Order Status:
                                                            <p className="font-normal mt-0">{r.reservationStatus}</p>
                                                        </span>

                                                    </div>
                                                    <div>
                                                        <span className="font-semibold mb-0 mt-0">
                                                        Order Date:
                                                            <p className="font-normal mt-0">{new Date(r.reservationDate).toDateString()}</p>
                                                        </span>
                                                    </div>
                                                </div>
                                            )) : <p>😳 Oops you haven't made any orders just yet.</p>}
                                        </div>
                                    </>
                                    : null}
                                {isViewingProdDetails ?
                                    <ReservationDetails
                                        reservationId={selectedRes !== undefined ? selectedRes : 0}
                                    />
                                    : null}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {!auth.user ? <span className="text-red-500 mt-3 px-3">You are currently not signed in. Please login or create an account to view your orders</span> : null}
            {/* <Footer /> */}
        </>
    )
}