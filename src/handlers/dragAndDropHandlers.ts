import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DropResult } from 'react-beautiful-dnd';
import { BoardData } from '../types'; // Путь до ваших типов может отличаться
import { Column } from '../types';

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

export const onDragEnd = (
    result: DropResult,
    client: ApolloClient<NormalizedCacheObject>,
    updateBoardState: (updatedColumns: Column[]) => void // Предположим, у вас есть такая функция для обновления состояния
  ): void => {
    const { source, destination, draggableId } = result;

    if (!destination) {
        return;
    }

    // Проверка на перемещение внутри одной колонки и без изменения позиции
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
    }

    // Получаем текущие данные о доске из кэша Apollo
    const data = client.readQuery({ query: GET_BOARD_QUERY });
    if (!data) {
        return;
    }

    const sourceColumn = data.board.columns.find((column: Column) => column.id === source.droppableId);
    const finishColumn = data.board.columns.find((column: Column) => column.id === destination.droppableId);

    // Создаем копии массивов карточек для исходной и целевой колонок
    const startCards = Array.from(sourceColumn.cards);
    const finishCards = finishColumn ? Array.from(finishColumn.cards) : startCards;

    // Удаляем карточку из исходной колонки
    const [movingCard] = startCards.splice(source.index, 1);

    // Если карточка перемещается в другую колонку, добавляем ее туда
    if (source.droppableId !== destination.droppableId) {
        finishCards.splice(destination.index, 0, movingCard);
    } else {
        // Иначе перемещаем внутри исходной колонки
        startCards.splice(destination.index, 0, movingCard);
    }

    // Теперь создаем обновленный массив колонок
    const updatedColumns = data.board.columns.map((column: Column) => {
        if (column.id === source.droppableId) {
            return { ...column, cards: startCards };
        } else if (column.id === destination.droppableId) {
            return { ...column, cards: finishCards };
        }
        return column;
    });

    console.log(updatedColumns, 'updatedColumns');


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
