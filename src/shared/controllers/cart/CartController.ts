import { BackendMethod, describeClass, remult } from "remult";
import { Carts } from "../../entities/Cart/cart";
import CartItems from "../../utils/types/cartType";
import ProductsController from "../products/ProductsController";

export default class CartController {
    @BackendMethod({ allowed: true })
    static async getUserCartDetails(user_id: number) {
        if (user_id) {
            const cartRepo = await remult.repo(Carts);
            const cartItems = await cartRepo.find({
                where: {
                    user_id: user_id
                }
            });
            const products = await ProductsController.getAllProducts();
            if (products.length > 0) {
                const userProducts: CartItems[] = Array.from((cartItems), (items, index) => {
                    const prod = products.find((prodi) => prodi.id === items.product_id)
                    if (prod) {
                        return {
                            quantity: items.quantity,
                            product: prod,
                            total_price: prod.product_price * items.quantity
                        }
                    }
                }) as CartItems[]
                return userProducts
            }
            else {
                return []
            }
        }
        return []
    }

    static async addProductToCart(user_id: number, product_id: number, quantity: number) {
        let cartItem = new Carts();
        const cartRepo = await remult.repo(Carts);
        const foundCartItem = await cartRepo.findFirst({
            product_id: product_id
        });
        if (foundCartItem !== undefined) {
            foundCartItem.quantity = quantity
            return await cartRepo.update(foundCartItem.id, foundCartItem);
        } else {
            cartItem.product_id = product_id;
            cartItem.quantity = quantity;
            cartItem.user_id = user_id
            return await cartRepo.save(cartItem);
        }
    }

    static async emptyCart(user_id: number) {
        const cartRepo = await remult.repo(Carts);
        const cartItems = await cartRepo.find({
            where: {
                user_id: user_id
            }
        })
        for (let item in cartItems) {
            await cartRepo.delete(cartItems[item]);
        }
        return "Deleted"
    }

    static async removeItemFromCart(user_id: number, product_id: number) {
        const cartRepo = await remult.repo(Carts);
        const item = await cartRepo.findFirst({
            user_id: user_id,
            product_id: product_id
        })
        await cartRepo.delete(item);
    }

}

describeClass(CartController, undefined, undefined, {
    addProductToCart: BackendMethod({ allowed: true }),
    emptyCart: BackendMethod({ allowed: true }),
    // getAdminUserByEmailPassword: BackendMethod({ allowed:true })
})

