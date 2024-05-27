import { StoreProduct } from "@/Actions/store"
import { CartContext } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useContext } from "react"

const CartProductCard = ({productData}: {productData: StoreProduct}) => {
    const cart = useContext(CartContext)
    return (
        <div className="w-full mb-4 border border-divider rounded-3xl h-24 flex flex-row">
            <div className="mx-1 my-0.5 relative min-w-[90px] min-h-[90px] rounded-3xl overflow-hidden">
                <Image src={productData.media == null || productData.media[0].url == null ? "https://placeholder.com/120x120" : productData.media[0].url} alt="Image of product" fill />
            </div>
            <div className="h-full">
                <h2 className="font-semibold mt-2 ml-2 text-xs md:text-medium lg:text-lg">{productData.title}</h2>
                <h3 className="">${productData.price}/Per | ${cart.getProductQuantity(productData.id) * productData.price} Total</h3>
            </div>
            <div className="h-fit w-32 flex flex-row gap-1 relative my-auto justify-center content-center right-0 float-right mx-auto">
                <Button variant="outline" className="h-8 border-divider" onClick={() => cart.addOneToCart(productData)}>+</Button>
                <Input type="number" className="w-10 border-divider h-8 [&::-webkit-inner-spin-button]:appearance-none" value={cart.getProductQuantity(productData.id)} onChangeCapture={e => {
                    e.currentTarget.value = Math.max(Number(e.currentTarget.value),1).toString()
                    if (e.currentTarget.value == "0") return
                    cart.setProductQuantity(productData.id, Number(e.currentTarget.value))
                }} />
                <Button variant="outline" className="h-8 border-divider" disabled={cart.getProductQuantity(productData.id) == 1} onClick={() => {
                    cart.removeOneFromCart(productData.id)
                }}>-</Button>
            </div>
            <Button variant="ghost" className="h-8 border-divider float-right m-auto " size="icon" onClick={() => cart.deleteFromCart(productData.id)}><XIcon color="#27272a" /></Button>
        </div>
    )
}

export default CartProductCard