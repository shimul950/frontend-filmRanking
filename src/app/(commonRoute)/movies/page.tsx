
/* eslint-disable @typescript-eslint/no-explicit-any */

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getMovies } from './_action';
import MoviesList from '@/components/modules/movies/moviesList';


export default async function moviesPage() {
    const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  })

   return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoviesList/>
    </HydrationBoundary>
  )
}
