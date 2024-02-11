import React, { useState } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const ADD_CARD_MUTATION = gql`
  mutation AddCard($columnId: String!, $card: CardInput!) {
    addCard(columnId: $columnId, card: $card) @client {
      id
    }
  }
`;

const GET_BOARD_QUERY = gql`
  query GetBoard {
    board @client {
      columns {
        id
        title
        cards {
          id
          content
        }
      }
    }
  }
`;

interface AddCardComponentProps {
    columnId: string;
  }
  

const AddCardComponent: React.FC<AddCardComponentProps> = ({ columnId } ) => {
  const [cardContent, setCardContent] = useState('');
  const client = useApolloClient();

  const handleAddCard = () => {
    const cardId = uuidv4(); 
      const card = { __typename: 'Card', id: cardId, content: cardContent };
      const data = client.readQuery({ query: GET_BOARD_QUERY });

      
      client.writeQuery({
        query: GET_BOARD_QUERY,
        data: updateCardsInColumn(data, columnId, card)
    });

    setCardContent(''); 
  };

  return (
      <div>
      <input
        type="text"
        value={cardContent}
        onChange={(e) => setCardContent(e.target.value)}
        placeholder="Enter card content"
      />
      <button onClick={handleAddCard}>Add Card</button>
    </div>
  );
};

function updateCardsInColumn(data: any, columnId: string, newCard: any) {
    const { board: { columns } } = data;
  
    const updatedColumns = columns.map((column: any) => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, { ...newCard, __typename: 'Card' }],
        };
      }
      return column;
    });
  
    return {
      ...data,
      board: {
        ...data.board,
        columns: updatedColumns,
      },
    };
  }

export default AddCardComponent;
