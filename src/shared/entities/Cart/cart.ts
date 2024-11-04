import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";

@Entity("carts", {
    allowApiCrud: true
})
export class Carts {

    @Fields.autoIncrement()
    id!: number;

    @Fields.number()
    product_id?: number;

    @Fields.number()
    user_id?: number;

    @Fields.number()
    quantity: number = 1;

}