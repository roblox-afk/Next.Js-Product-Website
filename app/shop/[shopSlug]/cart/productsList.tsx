"use client"
import { StoreProduct } from "@/Actions/store";
import CartProductCard from "@/components/Cards/Shop/CartProductCard";
import { CartContext } from "@/components/providers/cart-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext } from "react";

const ProductsList = ({productsData}: {productsData: StoreProduct[]}) => {
    const cart = useContext(CartContext)
    const productsDataInCart = productsData.filter(product => cart.items.some(cartItem => cartItem.id == product.id))
    console.log(productsDataInCart)
    console.log(cart.items)
    return (
        <div className="flex mx-2 border-x border-divider h-3/4 w-1/2 scrollbar-hide">
            <ScrollArea className="h-full flex flex-col w-full m-4">
                {productsDataInCart.map((product) => {
                    console.log("Product;:")
                    console.log(product)
                    return <CartProductCard key={product.id} productData={product} />
                })}
            </ScrollArea>
        </div>
    )
}

export default ProductsList