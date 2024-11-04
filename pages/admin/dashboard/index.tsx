import ValueCard from "@/components/admin_components/dashboard_components/graph_card";
import PageLoading from "@/components/shared/fullPageLoading";
import PageTitle from "@/components/shared/page_title";
import useAuth from '@/src/shared/utils/hooks/authHook';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import ProductsController from "@/src/shared/controllers/products/ProductsController";
import CategoryController from "@/src/shared/controllers/category/CategoryController";
import UserController from "@/src/shared/controllers/users/UserController";
import ReservationController from "@/src/shared/controllers/reservations/ReservationsController";
import { Skeleton } from 'primereact/skeleton';
import { toast } from "react-hot-toast";

export default function Dashboard() {
    const router = useRouter()
    const auth = useAuth()
    const [pageLoading, setPageLoading] = useState(true);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [productsTotal,setProductTotal] = useState<number>();
    const [categoryTotal,setCategoryTotal] = useState<number>();
    const [userTotal,setUserTotal] = useState<number>();
    const [reservationTotal,setReservationTotal] = useState<number>();


    useEffect(() => {
        async function FetchStats(){
            try{
                const prod = await ProductsController.getProductsCount();
                setProductTotal(prod as number);
                const cat = await CategoryController.getCategoriesCount();
                setCategoryTotal(cat);
                const users = await UserController.getUsersCount();
                setUserTotal(users);
                const reserve =  await ReservationController.getReserveCount();
                setReservationTotal(reserve);
            }catch(err){
                console.log(err);
                toast.error("An error occurred trying to fetch stats");
            }
        
        }
        FetchStats();
    }, [])

    useEffect(() => {

        if (!auth.isLoading && auth.user?.isAdmin) {
            setPageLoading(false);
        }
    }, [auth])
    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    if (!auth.isLoading && !auth.user?.isAdmin) {
        router.push('/admin')
    }
    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <div className="p-3 h-screen">
                {pageLoading ? <PageLoading /> :
                    <>
                        <div className="px-2">
                            <h2>Dashboard</h2>
                        </div>
                        <div className="grid gap-3 mb-3">
                            <ValueCard cardName={"Number of Products"} cardValues={productsTotal?.toLocaleString() as string} isLoadingValues={productsTotal === undefined} />
                            <ValueCard cardName={"Number of Categories"} cardValues={categoryTotal?.toLocaleString() as string} isLoadingValues={categoryTotal === undefined} />
                            <ValueCard cardName={"Number of Users"} cardValues={userTotal?.toLocaleString() as string} isLoadingValues={userTotal === undefined} />
                            <ValueCard cardName={"Number of Orders"} cardValues={reservationTotal?.toLocaleString() as string} isLoadingValues={reservationTotal ===  undefined} />
                        </div>
                        <div style={{width:300,height:200}} className="bg-white w-full p-5 mb-5">
                            <Chart type="bar" data={chartData} options={chartOptions} />
                        </div>
                    </>
                }
            </div>

        </>
    )
}