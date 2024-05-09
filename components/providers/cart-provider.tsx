import { createContext, useState } from "react"

export type cartProduct = {
    id: string,
    quantity: number
}

export const CartContext = createContext({
    items: [] as cartProduct[],
    getProductQuantity: (id: string) : number => {return 0},
    addOneToCart: (id: string) => {},
    removeOneFromCart: (id: string) => {},
    deleteFromCart: (id: string) => {},
    getTotalCost: () => {},
})

export default function CartProvider({children}: {children: React.ReactNode}) {
    const [cartProducts, setCartProducts] = useState<cartProduct[]>([])

    function getProductQuantity(id: string) {
        const quantity = cartProducts.find(product => product.id == id)?.quantity

        if (quantity == undefined) {
            return 0
        }

        return quantity
    }

    function addOneToCart(id: string) {
        const quantity = getProductQuantity(id)

        if (quantity == 0) {
            setCartProducts(
                [
                    ...cartProducts,
                    {
                        id: id,
                        quantity: 1
                    }
                ]
            )
        } else {
            setCartProducts(
                cartProducts.map((product: cartProduct) => product.id == id ? { ...product, quantity: product.quantity + 1 } : product )
            )
        }
    }

    function removeOneFromCart(id: string) {
        const quantity = getProductQuantity(id)

        if (quantity == 1) {
            deleteFromCart(id)
        } else {
            setCartProducts(
                cartProducts.map((product: cartProduct) => product.id == id ? { ...product, quantity: product.quantity - 1 } : product )
            )
        }
    }

    function deleteFromCart(id: string) {
        setCartProducts((cartProducts: cartProduct[]) => cartProducts.filter((product) => {
            return product.id != id
        }))
    }

    function getTotalCost() {
        let totalCost = 0

    }

    const contextValue = {
        items: cartProducts,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost,
    }
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}