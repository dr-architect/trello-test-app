import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import Board from './components/Board';
import { gql } from '@apollo/client';
import './index.css';

const INITIAL_DATA = {
  board: {
    __typename: 'Board',
    columns: [
      {
        __typename: 'Column',
        id: 'column-1',
        title: 'To Do',
        cards: [
          { __typename: 'Card', id: 'card-1', content: 'Task 1' },
          { __typename: 'Card', id: 'card-3', content: 'Task 3' },
        ],
      },
      {
        __typename: 'Column',
        id: 'column-2',
        title: 'In Progress',
        cards: [
          { __typename: 'Card', id: 'card-2', content: 'Task 2' },
          { __typename: 'Card', id: 'card-4', content: 'Task 4' },
        ],
      },
    ],
  },
};

client.writeQuery({
  query: gql`
    query InitData {
      board @client
    }
  `,
  data: INITIAL_DATA,
});


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Board />
      </div>
    </ApolloProvider>
  );
}

export default App;
