import { BackendMethod, Entity, Field, Fields,  remult, } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";
import { ReservedProducts } from "../ReservedProducts/reserved_products";
import { Carts } from "../Cart/cart";

@Entity("reservation", {
    allowApiCrud: true
})
export class Reservation {
    @Fields.autoIncrement()
    id!: number;

    @Fields.uuid()
    reservationNumber = '';

    @Fields.string()
    reservationStatus = 'In Review';

    @Fields.string()
    paymentStatus = 'Not Paid';

    @Fields.object<Reservation>((options, remult) => {
        options.includeInApi,
        options.lazy = true,
        options.serverExpression = async (res) =>
            await remult.repo(ReservedProducts).findFirst({id: res.id})
    })
    products?: ReservedProducts;
    

    @Field(() => Users)
    user_id!: Users;

    @Fields.number()
    total = 0;

    @Fields.date()
    reservationDate = new Date();

    @Fields.number()
    is_deleted = 0;

    @Fields.date()
    created_date = new Date();

    @Fields.date()
    modified_date = '';

}
