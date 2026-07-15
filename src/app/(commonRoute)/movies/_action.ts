import { httpClient } from "@/lib/axios/httpClient"

export const getMovies = async()=>{
    const movies = await httpClient.get('/media')
    return movies;
}