import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Movies from './components/movies';

const client = new ApolloClient({
  uri: process.env.API_URL,
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));
root.render(<ApolloProvider client={client}><Movies /></ApolloProvider>);