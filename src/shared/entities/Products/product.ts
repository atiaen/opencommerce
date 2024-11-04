import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";

@Entity("product", {
    allowApiCrud: true
})
export class Product {
    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    product_name = '';

    @Fields.number()
    product_price = 0;

    @Fields.string()
    product_image = '';

    @Fields.string()
    product_description = '';

    @Fields.boolean()
    in_stock = true;

    @Field(() => Category)
    product_category?: Category

    @Fields.number()
    is_deleted = 0;

    @Fields.date()
    created_date = new Date();

    @Fields.date()
    modified_date = '';
}
