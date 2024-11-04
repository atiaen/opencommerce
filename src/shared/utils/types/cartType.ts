import { Product } from "../../entities/Products/product";

export default interface CartItems{
    product:Product,
    quantity:number,
    total_price:number
}