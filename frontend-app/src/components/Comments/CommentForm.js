import React, { useEffect, useState } from 'react'
import "./comments.css"
import { EventData } from '../../context/EventContext'
import { UserType } from '../../context/UserContext'


const CommentForm = ({handleSubmit, submitLabel}) => {
    const [text, setText] = useState("")
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState()
    const [eventID, setEventID] = useState()
    const {event} = EventData()
    const {studentName, userType} = UserType()
    useEffect(() => {
      setAuthor(userType == "guest" ? event.name : studentName)
      setEventID(event.eventID)
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        handleSubmit(author, content, eventID)
        setText('')
    }
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Author"
        value={author}
        disabled
      />
      <textarea 
        className='comment-form-textarea' 
        placeholder='Enter Query/Response'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className='comment-form-button'>{submitLabel}</button>
    </form>
  )
}

export default CommentForm