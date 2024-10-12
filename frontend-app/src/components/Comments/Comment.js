import React from 'react'
import "./comments.css"

const Comment = ({comment}) => {
  return (
    <div className='comment'>
        <div className='comment-image-container'>
            <img src='https://via.placeholder.com/60x60'/>
        </div>
        <div className='comment-right-part'>
            <div className='comment-content'>
                <div className='comment-author'>{comment.author}</div>
                <div>{comment.createdAt}</div>
            </div>
            <div className='comment-text'>{comment.content}</div>
        </div>
    </div>
  )
}

export default Comment