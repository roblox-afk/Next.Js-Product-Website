"use client"
import { StoreProduct } from "@/Actions/store";
import CartProductCard from "@/components/Cards/Shop/CartProductCard";
import { CartContext } from "@/components/providers/cart-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext } from "react";

const ProductsList = ({productsData}: {productsData: StoreProduct[]}) => {
    const cart = useContext(CartContext)
    const productsDataInCart = productsData.filter(product => cart.items.find(cartItem => cartItem.id === product.id))
    return (
        <div className="flex mx-2 border-x border-divider h-full w-3/4 scrollbar-hide">
            <ScrollArea className="h-full flex flex-col w-full m-4">
                {productsDataInCart.map((product) => (
                    <CartProductCard key={product.id} productData={product} />
                ))}
            </ScrollArea>
        </div>
    )
}

export default ProductsList