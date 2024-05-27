"use client"
import { StoreProduct } from "@/Actions/store"
import { createContext, useEffect, useState } from "react"

export type cartProduct = {
    id: string,
    stripe_price_id: string,
    quantity: number,
    price: number,
}

export const CartContext = createContext({
    items: [] as cartProduct[],
    clearCart: () => {},
    getProductQuantity: (id: string) : number => {return 0},
    setProductQuantity: (id: string, newQuantity: number) => {},
    addOneToCart: (data: StoreProduct) => {},
    removeOneFromCart: (id: string) => {},
    deleteFromCart: (id: string) => {},
    getTotalCost: () : number => {return 0},
    getTotalQuantity: () : number => {return 0},
})

const getInitialState = () => {
    if (typeof window !== "undefined") {
        const newCartItems = localStorage.getItem("cartItems")
        if (newCartItems) {
            return JSON.parse(newCartItems)
        } else {
            return []
        }
    }
}

export default function CartProvider({children}: {children: React.ReactNode}) {
    const [cartProducts, setCartProducts] = useState<cartProduct[]>(getInitialState)


    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartProducts))
    }, [cartProducts])

    function clearCart() {
        setCartProducts([])
    }

    function getProductQuantity(id: string) {
        const quantity = cartProducts.find(product => product.id == id)?.quantity

        if (quantity == undefined) {
            return 0
        }

        return quantity
    }

    function setProductQuantity(id: string, newQuantity: number) {
        const quantity = cartProducts.find(product => product.id == id)?.quantity
        let newCartItems
        if (quantity == null) return
        newCartItems = newCartItems = cartProducts.map((product: cartProduct) => product.id == id ? { ...product, quantity: product.quantity = newQuantity } : product )
        setCartProducts(newCartItems)
        localStorage.setItem("cartItems", JSON.stringify(newCartItems))
    }

    function addOneToCart(data: StoreProduct) {
        const id = data.id
        const quantity = getProductQuantity(id)
        let newCartItems
        if (quantity == 0) {
            newCartItems =
                [
                    ...cartProducts,
                    {
                        id: id,
                        stripe_price_id: data.stripe_price_id,
                        quantity: 1,
                        price: data.price
                    }
                ]
        } else {
            newCartItems = cartProducts.map((product: cartProduct) => product.id == id ? { ...product, quantity: product.quantity + 1 } : product )
        }
        setCartProducts(newCartItems)
        localStorage.setItem("cartItems", JSON.stringify(newCartItems))
    }

    function removeOneFromCart(id: string) {
        const quantity = getProductQuantity(id)
        let newCartItems
        if (quantity == 1) return deleteFromCart(id)
        newCartItems = cartProducts.map((product: cartProduct) => product.id == id ? { ...product, quantity: product.quantity - 1 } : product )
        setCartProducts(newCartItems)
        localStorage.setItem("cartItems", JSON.stringify(newCartItems))
    }

    function deleteFromCart(id: string) {
        const newCartItems = (cartProducts: cartProduct[]) => cartProducts.filter((product) => {
            return product.id != id
        })
        setCartProducts(newCartItems)
        localStorage.setItem("cartItems", JSON.stringify(newCartItems))
    }

    function getTotalCost() {
        let totalCost = 0
        cartProducts?.map((product) => totalCost += product.price * product.quantity)
        return totalCost
    }

    function getTotalQuantity() {
        let quantity = 0

        cartProducts?.map((product) => quantity += product.quantity)
        return quantity
    }

    const contextValue = {
        items: cartProducts,
        clearCart,
        getProductQuantity,
        setProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost,
        getTotalQuantity,
    }
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}