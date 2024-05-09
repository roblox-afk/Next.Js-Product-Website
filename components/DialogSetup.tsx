// TODO: Do i need this file?
"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRef, useState } from "react"

export default function DialogSetup({children}:{children: React.ReactNode}) {
    const open = useRef(false)
    return { node: (
        <Dialog>
            {children}
        </Dialog>
    ), state: open}
}