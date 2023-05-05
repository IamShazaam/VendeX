import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_ALL_FILMS } from '../graphql/queries';
import MovieInfo from './movieInfo';
const Movies = () => {
  const [movieInfoModal, setMovieInfoModal] = useState(null);
  const { loading, error, data } = useQuery(GET_ALL_FILMS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  return (<>
    <h1>Films</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Title</th>
          <th>Released</th>
          <th>Director</th>
        </tr>
      </thead>
      <tbody>
        {data.allFilms.films.map(film => <tr key={film.id}>
          <td onClick={() => setMovieInfoModal(film.id)}>{film.title}</td>
          <td>{film.releaseDate}</td>
          <td>{film.director}</td>
        </tr>)}
      </tbody>
    </table>

    {movieInfoModal && <MovieInfo id={movieInfoModal} close={() => setMovieInfoModal(null)} />}
  </>);
}

export default Movies;