import { ApiResponse } from "@/src/types/api.types";
import axios, { AxiosResponse } from "axios"
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

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> =>{
    try{
        const instance = axiosInstance()
        const response = await instance.get<ApiResponse<TData>>(endpoint,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`GET request ${endpoint} failed`, error)
        throw error
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>>=>{
    try{
        const response = await axiosInstance().post<ApiResponse<TData>>(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`POST request ${endpoint} failed`, error)
        throw error
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>>=>{
    try{
        const response = await axiosInstance().put<ApiResponse<TData>>(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`PUT request ${endpoint} failed`, error)
        throw error
    }
}
const httpPatch = async<TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>>=>{
    try{
        const response = await axiosInstance().patch<ApiResponse<TData>>(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`PATCH request ${endpoint} failed`, error)
        throw error
    }
}
const httpDELETE = async<TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>>=>{
    try{
        const response = await axiosInstance().delete<ApiResponse<TData>>(endpoint,{
            params: options?.params,
            headers: options?.headers
        })
        return response.data
    }catch(error){
        console.error(`DELETE request ${endpoint} failed`, error)
        throw error
    }
}

// Same as httpPost, but returns the FULL axios response (status, headers,
// data) instead of just response.data. Needed anywhere we have to read
// response headers directly — e.g. relaying Set-Cookie from
// /auth/refresh-token back to the browser via Next's cookie store.
const httpPostRaw = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<AxiosResponse<ApiResponse<TData>>> => {
    try{
        const response = await axiosInstance().post<ApiResponse<TData>>(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response
    }catch(error){
        console.error(`POST (raw) request ${endpoint} failed`, error)
        throw error
    }
}

const httpPatchRaw = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<AxiosResponse<ApiResponse<TData>>> => {
    try{
        const response = await axiosInstance().patch<ApiResponse<TData>>(endpoint,data,{
            params: options?.params,
            headers: options?.headers
        })
        return response
    }catch(error){
        console.error(`PATCH (raw) request ${endpoint} failed`, error)
        throw error
    }
}

export const httpClient ={
    get : httpGet,
    put : httpPut,
    post : httpPost,
    patch : httpPatch,
    delete : httpDELETE,
    postRaw: httpPostRaw,
    patchRaw: httpPatchRaw
}