"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import Card from "./Card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, GripVertical } from "lucide-react"
import AddCardModal from "./AddCardModal"

interface ContainerProps {
  container: {
    id: string
    title: string
    cards: { id: string; content: string; description: string }[]
  }
  index: number
  updateContainerTitle: (containerId: string, newTitle: string) => void
  deleteContainer: (containerId: string) => void
  addCard: (containerId: string, title: string, description: string) => void
  updateCardContent: (containerId: string, cardId: string, newContent: string, newDescription: string) => void
  deleteCard: (containerId: string, cardId: string) => void
}

export default function Container({
  container,
  index,
  updateContainerTitle,
  deleteContainer,
  addCard,
  updateCardContent,
  deleteCard,
}: ContainerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(container.title)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditing])

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if(title.trim() === "")
        updateContainerTitle(container.id, "New Container")
    else
        updateContainerTitle(container.id, title)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleBlur()
    }
  }

  const handleAddCard = (title: string, description: string) => {
    addCard(container.id, title, description)
    setIsAddCardModalOpen(false)
  }

  return (
    <Draggable draggableId={container.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-gray-100 p-4  rounded-lg shadow-md w-72 border border-gray-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div {...provided.dragHandleProps} className="cursor-move">
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            {isEditing ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="font-bold text-lg bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h2 className="font-bold text-lg cursor-pointer" onDoubleClick={handleTitleClick}>
                {container.title}
              </h2>
            )}
            <Button variant="ghost" size="icon" onClick={() => deleteContainer(container.id)}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
          <Droppable droppableId={container.id} type="card" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[50px]">
                {container.cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    containerId={container.id}
                    updateCardContent={updateCardContent}
                    deleteCard={deleteCard}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Button onClick={() => setIsAddCardModalOpen(true)} className="mt-4 w-full" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Card
          </Button>
          <AddCardModal
            isOpen={isAddCardModalOpen}
            onClose={() => setIsAddCardModalOpen(false)}
            onAddCard={handleAddCard}
          />
        </div>
      )}
    </Draggable>
  )
}

