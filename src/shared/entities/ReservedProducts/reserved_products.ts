
import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";
import { Reservation } from "../Reservation/reservation";

@Entity("reserved_products", {
    allowApiCrud: true
})
export class ReservedProducts {
    @Fields.autoIncrement()
    id!: number;

    @Fields.number()
    reservationId!: number;

    @Fields.string()
    reservationNumber!:string;

    @Fields.string()
    products!: string;

    @Fields.date()
    created_date = new Date();
}
