"use client"

import {signupAction } from "@/src/app/(commonRoute)/_action/auth"
import { useActionState, useEffect } from "react"
import ActionButton from "../ActionButton";
import { useRouter } from "next/navigation";


export default function SignupForm() {
    const [state, formAction, pending] = useActionState(signupAction, null)
    const route = useRouter()

    useEffect(()=>{
        if(!state) return
        if(!state.success){
            alert(state.message || "Signup failed")
        }
        if(state.success){
            alert(state.message || "SignUp successful")
            route.push("/")
        }
    },[state, route])
    
    return (
        <div className="flex justify-center">
            <form action={formAction} className="space-y-4 w-1/2  rounded-2xl bg-white p-6 shadow-md dark:bg-gray-900">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Name
                    </label>

                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email
                    </label>

                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Password
                    </label>

                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <ActionButton>SignUp</ActionButton>
            </form>
        </div>
    )
}
