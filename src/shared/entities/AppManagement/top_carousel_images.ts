import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";
import { HomePageSettings } from "./homepage_settings";

@Entity("homepage_carousel_images", {
    allowApiCrud: true
})
export class TopCarouselImages {

    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    image_name: string = '';

    //Max of 3 images
    @Fields.string()
    image: string = '';

    @Fields.number()
    settings_id!: number;

}