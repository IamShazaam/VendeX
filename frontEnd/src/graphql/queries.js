import { gql } from '@apollo/client';
export const GET_ALL_FILMS = gql`
    query GetAllFilms {
        allFilms {
            films {
                id
                releaseDate
                title
                director
            }
        }
    }
`;
export const GET_FILM_INFO = gql`
    query GetFilmInfo($id: ID) {
        film(id: $id) {
            title
        }
    }
`;