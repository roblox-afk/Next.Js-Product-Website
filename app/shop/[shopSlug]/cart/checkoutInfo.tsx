"use client"
import { startCheckout } from "@/Actions/store";
import { CartContext } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const CheckoutInfo = () => {
    const cart = useContext(CartContext)
    const shopSlug = usePathname().split("/")[2]

    function onCheckout() {
        startCheckout(cart.items, shopSlug)
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="right-16 absolute flex flex-col justify-center">
                <p>Total: ${cart.getTotalCost()}</p>
                <Separator className="h-[1px] w-full my-4 mx-auto bg-default-200" />
                <Button disabled={cart.items[0] == null} variant="outline" className="border-default-100" onClick={onCheckout}>Checkout</Button>
            </div>
        </div>
    )
}

export default CheckoutInfo