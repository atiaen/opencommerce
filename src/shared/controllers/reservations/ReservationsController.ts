import { BackendMethod, remult, Allow, describeClass } from "remult";
import { Reservation } from "../../entities/Reservation/reservation";
import { Carts } from "../../entities/Cart/cart";
import { Users } from "../../entities/User/user";
import { Product } from "../../entities/Products/product";
import { ReservedProducts } from "../../entities/ReservedProducts/reserved_products";
import axios from "axios";

const devMode = process.env.DEVMODE;
const url = devMode === "true" ? 'http://localhost:3000' : 'https://medzone-demo.netlify.app'


export default class ReservationController {

    @BackendMethod({ allowed: true })
    static async getAllReservations() {
        const reservationRepo = await remult.repo(Reservation);
        const reservations = await reservationRepo.find({
            where: {
                is_deleted: 0
            },
            orderBy:{
                created_date:"desc"
            }
        });
        return reservations;
    }

    static async getOrderProducts(order: Reservation) {
        const prods = await remult.repo(ReservedProducts).findFirst({
            id: order.products?.id
        })
        return prods;
    }


    @BackendMethod({ allowed: true })
    static async getAllReservationsByUsers(user_id: number) {
        const reservationRepo = await remult.repo(Reservation);
        const reservations = await reservationRepo.find({
            where: {
                is_deleted: 0,
                user_id: {
                    $id: user_id
                }
            },
        });
        return reservations;
    }

    @BackendMethod({ allowed: true })
    static async getReservationById(reserveId: number) {
        const reservationRepo = await remult.repo(Reservation);
        const reservations = await reservationRepo.findFirst({
            id: reserveId
        });
        return reservations;
    }

    @BackendMethod({ allowed: true })
    static async getReserveCount() {
        const reservationRepo = await remult.repo(Reservation);
        const reservations = await reservationRepo.count({
            is_deleted: 0
        });
        return reservations;
    }

    static async makeReservation(user_id: number, total: number) {
        const reservationRepo = await remult.repo(Reservation);
        const userRepo = await remult.repo(Users);
        const user = await userRepo.findFirst({
            id: user_id
        });

        let reserve = new Reservation();
        reserve.reservationStatus = "In Review";
        reserve.reservationDate = new Date();
        reserve.total = total;
        reserve.user_id = user;

        const reserved = await reservationRepo.save(reserve);

        axios.post(`${url}/api/send_mail`, {
            to: user.email_address,
            subject: "Thank you for ordering on Medzone!",
            email_type: 2,
            name: `${user.first_name} ${user.last_name}`,
            reserveNum: reserved.reservationNumber
        });

        return reserved
    }


    static async updateOrderStatus(status: string, order_id: number) {
        const reservationRepo = await remult.repo(Reservation);
        let order = await reservationRepo.findFirst({
            id: order_id
        })

        if (status === "Accepted") {
            order.reservationStatus = status
            const saved = await reservationRepo.update(order_id, order);
            axios.post(`${url}/api/send_mail`, {
                to: order.user_id.email_address,
                subject: "Update regarding your order on Medzone",
                email_type: 3,
                name: `${order.user_id.first_name} ${order.user_id!.last_name}`,
                reserveNum: order.reservationNumber,
                status: "Accepted"
            });

            return saved
        }


        if (status === "Rejected") {
            order.reservationStatus = status
            const saved = await reservationRepo.update(order_id, order);
            axios.post(`${url}/api/send_mail`, {
                to: order.user_id.email_address,
                subject: "Update regarding your order on Medzone",
                email_type: 3,
                name: `${order.user_id.first_name} ${order.user_id!.last_name}`,
                reserveNum: order.reservationNumber,
                status: "Rejected"
            });

            return saved
        }

        
        if (status === "Cancelled") {
            order.reservationStatus = status
            const saved = await reservationRepo.update(order_id, order);
            axios.post(`${url}/api/send_mail`, {
                to: order.user_id.email_address,
                subject: "Update regarding your order on Medzone",
                email_type: 3,
                name: `${order.user_id.first_name} ${order.user_id!.last_name}`,
                reserveNum: order.reservationNumber,
                status: "Cancelled"
            });

            return saved
        }

    }

    static async updatePaymentStatus(status:string,order_id:number){
        const reservationRepo = await remult.repo(Reservation);
        let order = await reservationRepo.findFirst({
            id: order_id
        })

        order.paymentStatus = status
        const saved = await reservationRepo.update(order_id, order);
        return saved
    }
}

describeClass(ReservationController, undefined, undefined, {
    makeReservation: BackendMethod({ allowed: true }),
    getOrderProducts: BackendMethod({ allowed: true })
    // getAdminUserByEmailPassword: BackendMethod({ allowed:true })
})