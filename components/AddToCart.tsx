"use client"
import { useContext } from "react"
import { Button } from "./ui/button"
import { CartContext } from "./providers/cart-provider"
import { StoreProduct } from "@/Actions/store"

const AddToCartButton = ({ productData }: {productData: StoreProduct}) => {
    const cartContext = useContext(CartContext)
    return (
        <Button className="my-4 border-default-100 hover:border-default-200" variant="outline" onClick={() => cartContext.addOneToCart(productData)}>ADD TO CART</Button>
    )
}

export default AddToCartButton