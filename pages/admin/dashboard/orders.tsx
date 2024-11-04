import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import PageTitle from "@/components/shared/page_title";
import { useEffect, useState } from 'react';
import { Reservation } from '@/src/shared/entities/Reservation/reservation';
import ReservationController from '@/src/shared/controllers/reservations/ReservationsController';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import toast from 'react-hot-toast';
import { Dialog } from 'primereact/dialog';
import { Product } from '@/src/shared/entities/Products/product';
import ProductsController from '@/src/shared/controllers/products/ProductsController';
import Image from "next/image";
import { Dropdown } from 'primereact/dropdown';

const dateBody = (cat: Reservation) => {
    return <div>{new Date(cat.created_date).toDateString()}</div>
}


const totalBody = (cat: Reservation) => {
    return <div>&#8358;{cat.total.toLocaleString()}</div>
}

const idBody = (cat: Reservation) => {
    return <div>#{cat.reservationNumber}</div>
}


interface orderProd {
    product: Product;
    quantity: string | number
}



export default function Sales() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<Reservation[]>([]);
    const [reservation, setReservation] = useState<Reservation>();
    const [viewOrder, setViewOrder] = useState<boolean>(false);
    const [paymentDialog, setPaymentDialog] = useState<boolean>(false);
    const [orderIdFilter, setOrderIdFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        reservationNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [products, setProducts] = useState<orderProd[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>('');

    const getAllOrders = async () => {
        const all = await ReservationController.getAllReservations();
        setIsLoading(false);
        setOrders(all);

    }

    const updateOrder = async (orderStatus: string, orderId: number) => {
        try {
            await ReservationController.updateOrderStatus(orderStatus, orderId)
            setIsLoading(true);
            getAllOrders();
        } catch (error) {
            toast.error("Could update order");
        }
    }

    const updateStatus =async () => {
        try {
            await ReservationController.updatePaymentStatus(selectedPayment,reservation?.id as number);
            setIsLoading(true);
            getAllOrders();
        } catch (error) {
            toast.error("Could update payment status");

        }
    }


    const managementTools = (data: Reservation, colProps: ColumnBodyOptions) => (

        <div className='flex justify-content-evenly'>
            <Button
                onClick={() => {
                    setViewOrder(true)
                    setReservation(data);
                }}
                icon="pi pi-file-edit"
                size="small"
                tooltip='View Order'
                tooltipOptions={{
                    position: 'top'
                }}
            />
            {data.reservationStatus === "In Review" ?
                <Button
                    onClick={() => updateOrder("Accepted", data.id)}
                    icon="pi pi-check"
                    severity='success'
                    size="small"
                    tooltip='Accept Order'
                    tooltipOptions={{
                        position: 'top'
                    }}
                />
                : null
            }
            {data.reservationStatus === "In Review" ?
                <Button
                    onClick={() => updateOrder("Rejected", data.id)}
                    icon="pi pi-times"
                    severity='danger'
                    size="small"
                    tooltip='Reject Order'
                    tooltipOptions={{
                        position: 'top'
                    }}

                />
                : null
            }
            {data.reservationStatus === "Accepted" && data.paymentStatus === "Not Paid" ?

                <Button
                    onClick={() => updateOrder("Cancelled", data.id)}
                    icon="pi pi-stop"
                    severity='warning'
                    size="small"
                    tooltip='Cancel Order'
                    tooltipOptions={{
                        position: 'top'
                    }}

                />

                : null
            }
            {data.reservationStatus === "Accepted" && data.paymentStatus === "Not Paid" ?
                <Button
                    severity="secondary"
                    icon="pi pi-money-bill"
                    size="small"
                    tooltip='Update Payment Status'
                    tooltipOptions={{
                        position: 'top'
                    }}
                    onClick={() => {
                        setPaymentDialog(true)
                        setReservation(data);
                    }}

                /> : null
            }

        </div>
    )

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['reservationNumber'].value = value;

        setFilters(_filters);
        setOrderIdFilterValue(value);
    };

    const footer = (
        <div>
            <Button label="Close" loading={isLoading} icon="pi pi-times" onClick={() => setViewOrder(false)} className="p-button-text" />
        </div>
    );

    const header = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    icon="pi pi-refresh"
                    loading={isLoading}
                    onClick={() => {
                        setIsLoading(true);
                        getAllOrders()
                    }}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={orderIdFilter} onChange={onGlobalFilterChange} placeholder="Order ID Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        getAllOrders();
    }, [])


    useEffect(() => {
        if (reservation) {
            const getOrderProducts = async () => {
                const another = reservation.products!.products.split(",").map(async (s) => {
                    const split2 = s.split("__");
                    const foundProd = await ProductsController.getProductById(parseInt(split2[0]))
                    return {
                        product: foundProd,
                        quantity: split2[1]
                    }
                })
                // console.log(another);
                const resolve = await Promise.all(another)
                setProducts(resolve);
                // console.log(resolve)
            }
            getOrderProducts();
        }
    }, [reservation])


    return (
        <>
            <PageTitle title="Reservations History" />
            <div className="p-3 h-screen">
                <h2>Orders History</h2>
                <div className='p-2'>
                    <DataTable
                        value={orders}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[2, 5, 10, 25, 50]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        loading={isLoading}
                        header={header}
                        filters={filters}
                    >
                        <Column field="reservationStatus" header="Order Status" style={{ width: '10%' }}></Column>
                        <Column field="total" header="Total" body={totalBody} style={{ width: '15%' }}></Column>
                        <Column field="reservationDate" body={dateBody} header="Date" style={{ width: '20%' }}></Column>
                        <Column field="reservationNumber" body={idBody} header="OrderID" style={{ width: '25%' }}></Column>
                        <Column header="Management Tools" body={managementTools} style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog
                header={`Viewing order #${reservation?.reservationNumber} `}
                visible={viewOrder}
                // style={{ width: '98vw' }} 
                onHide={() => setViewOrder(false)}
                footer={footer}
                breakpoints={{
                    '350px': "98vw",
                    '768px': "70vw"
                }}
            >
                <div className="m-0 card">
                    <div>
                        <div>
                            <p>Order ID:{"   "}
                                #<span className="font-semibold ">{reservation?.reservationNumber}</span>
                            </p>
                            <p>Order Date:{"   "}
                                <span className="font-semibold ">{new Date(reservation?.reservationDate as Date).toDateString()}</span>
                            </p>
                            <p>Order Status:{"   "}
                                <span className="font-semibold ">{reservation?.reservationStatus}</span>
                            </p>
                            <p>Payment Status:{"   "}
                                <span className="font-semibold ">{reservation?.paymentStatus}</span>
                            </p>
                            <p>User Name:{"   "}
                                <span className="font-semibold ">{reservation?.user_id.first_name + " " + reservation?.user_id.last_name}</span>
                            </p>
                            <p >
                                Email:{"    "}
                                <span className="font-semibold ">
                                    {reservation?.user_id.email_address}

                                </span>
                            </p>
                            <p >
                                Phone Number:{"    "}
                                <span className="font-semibold ">
                                    {reservation?.user_id.phone_number}

                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold ">Products</p>
                            <div className='h-10rem overflow-scroll hideScrollbar'>
                                {products.length > 0 ? products.map((pr, index) => (
                                    <div className="border-1 border-round mb-2 p-3" key={index}>
                                        <div className="flex justify-content-between">
                                            <div>
                                                <p className='mb-0'>Product Name: {pr.product.product_name}</p>
                                                <p className='mt-0 mb-0'>Price: &#8358;{pr.product.product_price.toLocaleString()}</p>
                                                <p className='mt-0'>Quantity: {pr.quantity}</p>

                                            </div>
                                            <div>
                                                <Image src={pr.product.product_image} alt={pr.product.product_name} width={50} height={50} />
                                            </div>
                                        </div>
                                        {/* <div>
                                            <Button />
                                        </div> */}
                                    </div>
                                )) : null}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold ">Order Total: &#8358;{reservation?.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog
                header={`Change payment status for #${reservation?.reservationNumber}`}
                visible={paymentDialog}
                onHide={() => setPaymentDialog(false)}
                breakpoints={{
                    '350px': "98vw",
                    '768px': "70vw"
                }}
            >
                <div className="m-0 card flex">
                    <span className="p-float-label">
                        <Dropdown
                            inputId="dd-city"
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.value)}
                            options={[
                                {
                                    name: "Paid",
                                    value: "Paid"
                                },
                                {
                                    name: "Not Paid",
                                    value: "Not Paid"
                                },
                            ]}
                            optionLabel="name"
                            className="w-full md:w-14rem"
                        />
                        <label htmlFor="dd-city">Select a payment status</label>
                    </span>
                    <Button 
                        label='Submit'
                        className='ml-2'
                        onClick={() => {
                            updateStatus()
                            setPaymentDialog(false);
                        }}
                    />
                </div>
            </Dialog>
        </>
    )
}