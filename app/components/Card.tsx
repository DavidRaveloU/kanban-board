"use client"

import type React from "react"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"

interface CardProps {
  card: {
    id: string
    content: string
    description: string
  }
  index: number
  containerId: string
  updateCardContent: (containerId: string, cardId: string, newContent: string, newDescription: string) => void
  deleteCard: (containerId: string, cardId: string) => void
}

export default function Card({ card, index, containerId, updateCardContent, deleteCard }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(card.content)
  const [description, setDescription] = useState(card.description)

  const handleContentClick = () => {
    setIsEditing(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    const title = content.trim() === "" ? "New Card" : content
    const info = description.trim() === "" ? "" : description
    updateCardContent(containerId, card.id, title, info)
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div {...provided.dragHandleProps} className="cursor-move">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteCard(containerId, card.id)}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                className="w-full p-2 text-sm bg-transparent border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleBlur}
                className="w-full p-2 text-sm bg-transparent border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          ) : (
            <div onClick={handleContentClick} className="cursor-pointer">
              <h3 className="font-medium mb-1">{card.content}</h3>
              {card.description && <p className="text-sm text-gray-600 line-clamp-3">{card.description}</p>}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

