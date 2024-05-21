"use client"
import { AddMediaToProduct } from "@/app/dashboard/[shopId]/products/[productId]/page"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"

const AddMediaFromUrlContent = ({type, itemid} : {type: "Product" | "Collection", itemid: string}) => {
    let [url, setUrl] = useState("")
    const addFn = type == "Product" ? (url: string, id: string) => AddMediaToProduct(url, id) : (url: string, id: string) => {}

    return (
        <DialogContent className="border-default-100">
            <DialogHeader>
                <DialogTitle>Add media to {type}</DialogTitle>
                <DialogDescription>Only links that end with .jpg or .png are valid for images. And videos are only supported from youtube or vimeo.</DialogDescription>
            </DialogHeader>
            <Input type="url" placeholder="https://" className="border-default-100" onChangeCapture={e => setUrl(e.currentTarget.value)} />
            <DialogFooter>
                <Button type="submit" variant="outline" className="border-default-100 hover:bg-default-100" onClick={() => AddMediaToProduct(url, itemid)}>Add</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddMediaFromUrlContent