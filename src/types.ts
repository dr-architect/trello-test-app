// src/types.ts
export interface Card {
    __typename: 'Card';
    id: string;
    content: string;
  }
  
  export interface Column {
    __typename: 'Column';
    id: string;
    title: string;
    cards: Card[];
  }
  
  export interface Board {
    __typename: 'Board';
    columns: Column[];
  }
  
  export interface BoardData {
    board: {
      __typename: 'Board';
      columns: Column[];
    }
  }
