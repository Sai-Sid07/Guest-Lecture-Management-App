import React, { useEffect, useState } from "react";
import "./comments.css";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { EventData } from "../../context/EventContext";

const Comments = () => {
const [comments, setComments] = useState([]);
const {event} = EventData()
    useEffect(() => {
        console.log(event.eventID)
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
        const response = await fetch(`http://localhost:5000/api/comments/:${event.eventID}`);
        const data = await response.json()
        setComments(data);
        } catch (error) {
        console.error('Error fetching comments:', error);
        }
    };

    const handleSubmit = async (author, content, eventID) => {

        try {
        const newComment = new FormData()
        newComment.append("author", author)
        newComment.append("content", content)
        newComment.append("eventID", eventID)
        const response = await fetch('http://localhost:5000/api/comments', {
            method: "POST",
            body: newComment
        });
        if(response.ok){
            console.log("Submitted Successfully")
            fetchComments();
        }
        } catch (error) {
        console.error('Error submitting comment:', error);
        }
    };

  return (
    <>
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            >
              <div className="flex justify-center items-center h-[50%]">
                <h1 className="text-5xl font-semibold tracking-wide text-center bg-transparent text-white">
                  Q&A Section
                </h1>
              </div>
            </span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="comments">
                  <h3 className="comments-title">Your Queries/Responses</h3>
                  <div className="comment-form-title mb-5">Write Comment</div>
                  <CommentForm submitLabel="Write" handleSubmit={handleSubmit} />
                  <div className="comments-container">
                    {comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                      />
                    ))}
                  </div>
                </div>
                <div>
                </div>
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"></div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"></div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                    <div className="py-6 px-3 mt-32 sm:mt-0 flex justify-center sm:block"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Comments;
