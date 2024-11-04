import { Entity, Field, Fields } from "remult";
import { Category } from "../Categories/category";
import { Users } from "../User/user";
import { Product } from "../Products/product";
import { TopCarouselImages } from "./top_carousel_images";

@Entity("homepage_settings", {
    allowApiCrud: true,
})
export class HomePageSettings {

    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    setting_name: string = '';

    @Fields.string()
    hero_section_main_text: string = 'Buy your favorite medical products';

    @Fields.string()
    hero_section_sub_text: string = 'Shop at the best prices';

    @Fields.string()
    hero_section_card_1_text: string = 'Fast Delivery';

    @Fields.string()
    hero_section_card_2_text: string = 'Lowest Prices around town';

    @Fields.string()
    hero_section_card_3_text: string = '100% Certified and Original';

    @Fields.boolean({

    })
    use_setting?:boolean;

    @Fields.number()
    is_deleted:number = 0;

    //Max of 4
    @Fields.string()
    best_selling_products: string = '';

    @Fields.string()
    new_arrivals: string = '';

    @Fields.object<HomePageSettings>((options, remult) => {
        options.serverExpression = async (setting) =>
            remult.repo(TopCarouselImages).find({ where: { settings_id: setting.id } })
    })
    top_carousel_images?: TopCarouselImages[]

    //Max of 3 images
    // @Fields.string()
    // top_carousel_images: string = '';

}