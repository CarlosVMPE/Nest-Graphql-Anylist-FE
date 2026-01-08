import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink } from '@apollo/client/core';

const uri = 'http://localhost:3000/graphql'; // Replace with your GraphQL endpoint

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const authLink = new ApolloLink((operation, forward) => {
    // Add the Authorization header to the request
    const token = localStorage.getItem('authToken');
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return forward(operation);
  });

  return {
    link: authLink.concat(httpLink.create({ uri })),
    cache: new InMemoryCache(),
  };
}

export const apolloProvider = {
  provide: APOLLO_OPTIONS,
  useFactory: createApollo,
  deps: [HttpLink],
};