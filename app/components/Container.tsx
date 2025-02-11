"use client"

import React, { useEffect, useRef, useState } from "react"

interface ContainerProps{
    container: {
        id: string
        title: string
        cards: {id: string, content: string, description: string}[]
    }
    index: number
    updateContainerTitle: (containerId: string, newTitle: string)=>void
    deleteContainer: (containerId: string)=> void 
    addCard: (containerId: string, title: string, description: string)=> void
    updateCardContent: (containerId: string, cardId: string, newContent: string, newDescription: string) => void
    deleteCard: (containerId:string, cardId: string) => void
}

export default function Container({
    container, 
    index, 
    updateContainerTitle,
    deleteContainer, 
    addCard, 
    updateCardContent, 
    deleteCard 
}: ContainerProps){
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle]= useState(container.title)
    const titleInputRef = useRef<HTMLInputElement>(null)
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)

    useEffect(()=>{
        if(isEditing && titleInputRef.current)
            titleInputRef.current.focus()
    }, [isEditing])
    const handleTitleClick = () => {
        setIsEditing(true)
    }
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setTitle(e.target.value)
    }

    const handleTitleBlur = () =>{
        setIsEditing(false)
        updateContainerTitle(container.id, title)
    }

    const handleKeyDown = (e: React.KeyboardEvent) =>{
        if(e.key === "Enter")
            handleTitleBlur()
    }
    const handleAddCard = (title: string, description: string) =>{
        addCard(container.id, title, description)
        setIsAddCardModalOpen(false)
    }
}
