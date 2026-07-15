"use client"

import { getMovies } from "@/src/app/(commonRoute)/movies/_action"
import { useQuery } from "@tanstack/react-query"

export default function MoviesList() {
  const data = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies()
  })

  console.log(data);

  return (
    <div>moviesList</div>
  )
}
