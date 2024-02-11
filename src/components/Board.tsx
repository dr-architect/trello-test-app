import React from 'react';
import { useApolloClient, gql, ApolloClient, NormalizedCacheObject, useQuery } from '@apollo/client';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Board as BoardType, BoardData, Column as ColumnType, Column } from '../types';
import AddCard from './addCard';

// Запрос для получения данных доски из кэша Apollo


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

const Board: React.FC = () => {
    const client = useApolloClient();
    const { data, loading, error } = useQuery(GET_BOARD_QUERY);



    const onDragEnd = (result: any) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const data = client.readQuery({ query: GET_BOARD_QUERY });
        if (!data) {
            return;
        }

        const sourceColumn = data.board.columns.find((column: Column) => column.id === source.droppableId);
        const finishColumn = data.board.columns.find((column: Column) => column.id === destination.droppableId);

        const startCards = Array.from(sourceColumn.cards);
        const finishCards = finishColumn ? Array.from(finishColumn.cards) : startCards;

        const [movingCard] = startCards.splice(source.index, 1);

        if (source.droppableId !== destination.droppableId) {
            finishCards.splice(destination.index, 0, movingCard);
        } else {
            startCards.splice(destination.index, 0, movingCard);
        }

        const updatedColumns = data.board.columns.map((column: Column) => {
            if (column.id === source.droppableId) {
                return { ...column, cards: startCards };
            } else if (column.id === destination.droppableId) {
                return { ...column, cards: finishCards };
            }
            return column;
        });


        // Обновляем кэш
        client.writeQuery({
            query: GET_BOARD_QUERY,
            data: {
                board: {
                    ...data.board,
                    columns: updatedColumns,
                },
            },
        });
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto p-2" style={{ maxWidth: '100vw' }}>
                {data?.board?.columns.map((column: any) => (
                    <Droppable key={column.id} droppableId={column.id}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex-none w-full max-w-xs bg-gray-200 p-4 m-2 rounded"
                                style={{ maxWidth: '500px' }}
                            >
                                <h2 className="font-bold mb-2">{column.title}</h2>
                                {column.cards.map((card: any, index: any) => (
                                    <Draggable key={card.id} draggableId={card.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-2 m-2 rounded shadow"
                                            >
                                                {card.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                <AddCard columnId={column.id} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default Board;
