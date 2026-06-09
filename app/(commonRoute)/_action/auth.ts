/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers"

export async function loginAction(preState:any , formData:any){
    try{

        const email = formData.get("email")
        const password = formData.get("password")

        if(!email || !password){
            throw new Error('Email and password is required')
        }

        const response = await fetch("http://localhost:5000/api/v1/auth/login",{
            method:"POST",
            headers:{
                "content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
            cache: "no-cache"

        
        })

        const result = await response.json()
        if(!response.ok){
            return {success: false, message: result.message || "Login failed"}
        }

        const {accessToken, refreshToken} = result.data;
        const cookieOptions = await cookies()

        cookieOptions.set({
            name:"accessToken",
            value:accessToken,  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"none"     
        })
        cookieOptions.set({
            name:"refreshToken",
            value:refreshToken,  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"none"     
        })
        return result
    }catch (error){
        console.log(error);
    }
}
export async function signupAction(preState:any , formData:any){
    try{
        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")

        if(!name || !email || !password){
            throw new Error('Name, Email and password is required')
        }

        const response = await fetch("http://localhost:5000/api/v1/auth/register",{
            method:"POST",
            headers:{
                "content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            }),
            cache: "no-cache"

        
        })

        const result = await response.json()
        if(!response.ok){
            return {success: false, message: result.message || "Signup failed"}
        }

        const {accessToken, refreshToken} = result.data;
        const cookieOptions = await cookies()

        cookieOptions.set({
            name:"accessToken",
            value:accessToken,  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"none"     
        })
        cookieOptions.set({
            name:"refreshToken",
            value:refreshToken,  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"none"     
        })
        return result
    }catch (error){
        console.log(error);
    }
}