import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_FILM_INFO } from '../graphql/queries';

const MovieInfo = ({ id, close }) => {

  const { loading, error, data } = useQuery(GET_FILM_INFO, {
    variables: {
      id
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  return <div>
    <span onClick={close}>Close</span>
    <h2>{data.film.title}</h2>
  </div>;
}

export default MovieInfo;