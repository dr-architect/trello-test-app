import { makeVar, ApolloClient, InMemoryCache } from '@apollo/client';


// Инициализация реактивной переменной для управления видимостью модального окна
export const modalOpenVar = makeVar<boolean>(false);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    resolvers: {
        Mutation: {
          
        },
      },
});

export default client;
