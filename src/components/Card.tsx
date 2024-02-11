import React from 'react';
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column } from "../types";

export const Card: React.FC<{ columns: Column[] }> = ({ columns }) => {
    return (
      <div className="flex overflow-x-auto p-2" style={{ maxWidth: '100vw' }}>
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-none w-full max-w-xs bg-gray-200 p-4 m-2 rounded"
                style={{ maxWidth: '500px' }}
              >
                <h2 className="font-bold mb-2">{column.title}</h2>
                {column.cards.map((card, index) => (
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
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    );
  };
  