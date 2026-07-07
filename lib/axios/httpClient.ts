
import axios from "axios"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL){
    throw new Error("API_BASE_URL is not defined in environment variables")
}

const axiosInstance = () =>{
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "content-Type" :"application/json"
        }
    })

    return instance
}

export interface ApiRequestOptions{
    params?: Record<string, unknown>;
    headers?: Record<string, string>
}

const httpGet = async(endpoint: string, options?: ApiRequestOptions) =>{
    try{
        const response = await axiosInstance().get(endpoint,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`GET request ${endpoint} failed`, error)
        throw error
    }
}

const httpPost = async(endpoint: string, data: unknown, options?: ApiRequestOptions)=>{
    try{
        const response = await axiosInstance().post(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`GET request ${endpoint} failed`, error)
        throw error
    }
}

const httpPut = async(endpoint: string, data: unknown, options?: ApiRequestOptions)=>{
    try{
        const response = await axiosInstance().put(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`PUT request ${endpoint} failed`, error)
        throw error
    }
}
const httpPatch = async(endpoint: string, data: unknown, options?: ApiRequestOptions)=>{
    try{
        const response = await axiosInstance().patch(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`PATCH request ${endpoint} failed`, error)
        throw error
    }
}
const httpDELETE = async(endpoint: string, options?: ApiRequestOptions)=>{
    try{
        const response = await axiosInstance().delete(endpoint,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`DELETE request ${endpoint} failed`, error)
        throw error
    }
}

export const httpClient ={
    get : httpGet,
    put : httpPut,
    post : httpPost,
    patch : httpPatch,
    delete : httpDELETE
}