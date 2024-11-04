import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";
import { TopCarouselImages } from "./top_carousel_images";

@Entity("footer_settings", {
    allowApiCrud: true,
})
export class HomePageSettings {

    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    about_us_text: string = '';

    @Fields.string()
    address_text: string = '';

    @Fields.string()
    phone_num_text: string = '';

    @Fields.string()
    email_text: string = '';

    @Fields.boolean()
    use_setting?:boolean;

    @Fields.number()
    is_deleted:number = 0;

}