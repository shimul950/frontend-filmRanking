
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';

export default async function page() {
  const data = await fetch("http://localhost:5000/api/v1/media")
  const movies = await data.json();
  
  return (
    <div>movies page
      <ul>
        {movies?.data.data.map((movie : any) =>(
          <li key={movie.id}>
            {movie.title}
            <Link href={`movies/${movie.id}`}>View details</Link>
          </li>
          
        ))}
      </ul>
    </div>
  )
}
