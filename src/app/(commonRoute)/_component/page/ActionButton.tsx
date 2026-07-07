"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";


export default function ActionButton(
    { children }:
        { children: React.ReactNode }
) {
    const { pending } = useFormStatus()
    return <Button type="submit">{pending ? "loading..." : children}</Button>

}