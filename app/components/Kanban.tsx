"use client"

import { useState } from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import Container from "./Container"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface Card {
  id: string
  content: string
  description: string
}

interface KanbanContainer {
  id: string
  title: string
  cards: Card[]
}

export default function Kanban() {
  const [containers, setContainers] = useState<KanbanContainer[]>([
    { id: "backlog", title: "Backlog", cards: [] },
    { id: "in-progress", title: "In Progress", cards: [] },
    { id: "done", title: "Done", cards: [] },
  ])

  const onDragEnd = (result:  DropResult) => {
    const { source, destination, type } = result

    if (!destination) return

    if (type === "container") {
      const newContainers = Array.from(containers)
      const [reorderedContainer] = newContainers.splice(source.index, 1)
      newContainers.splice(destination.index, 0, reorderedContainer)
      setContainers(newContainers)
    } else if (type === "card") {
      const sourceContainer = containers.find((c) => c.id === source.droppableId)
      const destContainer = containers.find((c) => c.id === destination.droppableId)

      if (sourceContainer && destContainer) {
        const newSourceCards = Array.from(sourceContainer.cards)
        const [movedCard] = newSourceCards.splice(source.index, 1)

        if (source.droppableId === destination.droppableId) {
          newSourceCards.splice(destination.index, 0, movedCard)
          const newContainers = containers.map((c) =>
            c.id === sourceContainer.id ? { ...c, cards: newSourceCards } : c,
          )
          setContainers(newContainers)
        } else {
          const newDestCards = Array.from(destContainer.cards)
          newDestCards.splice(destination.index, 0, movedCard)
          const newContainers = containers.map((c) =>
            c.id === sourceContainer.id
              ? { ...c, cards: newSourceCards }
              : c.id === destContainer.id
                ? { ...c, cards: newDestCards }
                : c,
          )
          setContainers(newContainers)
        }
      }
    }
  }

  const addContainer = () => {
    const newContainer: KanbanContainer = {
      id: `container-${Date.now()}`,
      title: "New Container",
      cards: [],
    }
    setContainers([...containers, newContainer])
  }

  const updateContainerTitle = (containerId: string, newTitle: string) => {
    const newContainers = containers.map((c) => (c.id === containerId ? { ...c, title: newTitle } : c))
    setContainers(newContainers)
  }

  const deleteContainer = (containerId: string) => {
    const newContainers = containers.filter((c) => c.id !== containerId)
    setContainers(newContainers)
  }

  const addCard = (containerId: string, title: string, description: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      content: title,
      description: description,
    }
    const newContainers = containers.map((c) => (c.id === containerId ? { ...c, cards: [...c.cards, newCard] } : c))
    setContainers(newContainers)
  }

  const updateCardContent = (containerId: string, cardId: string, newContent: string, newDescription: string) => {
    const newContainers = containers.map((c) =>
      c.id === containerId
        ? {
            ...c,
            cards: c.cards.map((card) =>
              card.id === cardId ? { ...card, content: newContent, description: newDescription } : card,
            ),
          }
        : c,
    )
    setContainers(newContainers)
  }

  const deleteCard = (containerId: string, cardId: string) => {
    const newContainers = containers.map((c) =>
      c.id === containerId
        ? {
            ...c,
            cards: c.cards.filter((card) => card.id !== cardId),
          }
        : c,
    )
    setContainers(newContainers)
  }

  return (
    //center button
    <div className="flex flex-col items-center">
      <Button onClick={addContainer} className="my-12">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Container
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="container" direction="horizontal" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-4">
              {containers.map((container, index) => (
                <Container
                  key={container.id}
                  container={container}
                  index={index}
                  updateContainerTitle={updateContainerTitle}
                  deleteContainer={deleteContainer}
                  addCard={addCard}
                  updateCardContent={updateCardContent}
                  deleteCard={deleteCard}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
