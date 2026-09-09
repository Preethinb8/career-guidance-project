import { useState } from "react";
import API_URL from "../api";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setError("");

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/chatbot/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: userQuestion,
          }),
        }
      );

      const data = await response.json();

      console.log("Chatbot Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get AI response"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);

      setError(
        error.message || "Cannot connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (text) => {
    setQuestion(text);
    setError("");
  };

  return (
    <div className="chatbot-page">

      <h1>🤖 AI Career Chatbot</h1>

      <p>
        Ask questions about careers, learning, resumes,
        and interview preparation.
      </p>

      <div className="suggestion-buttons">

        <button
          onClick={() =>
            useSuggestion(
              "What career would be suitable for my skills?"
            )
          }
        >
          💼 Career Guidance
        </button>

        <button
          onClick={() =>
            useSuggestion(
              "What skills should I learn to become a software developer?"
            )
          }
        >
          📚 Learning Guidance
        </button>

        <button
          onClick={() =>
            useSuggestion(
              "How can I improve my resume?"
            )
          }
        >
          📄 Resume Improvement
        </button>

        <button
          onClick={() =>
            useSuggestion(
              "What questions should I prepare for a software developer interview?"
            )
          }
        >
          🎤 Interview Preparation
        </button>

      </div>

      <div className="chat-container">

        {messages.length === 0 && (
          <div className="welcome-message">

            <h2>👋 Welcome to CareerGuide AI</h2>

            <p>
              I can help you with career guidance,
              learning plans, resume improvement,
              and interview preparation.
            </p>

          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.type === "user"
                ? "chat-message user-message"
                : "chat-message ai-message"
            }
          >

            <strong>
              {message.type === "user"
                ? "You"
                : "🤖 CareerGuide AI"}
            </strong>

            <p>{message.text}</p>

          </div>
        ))}

        {loading && (
          <div className="chat-message ai-message">

            <strong>🤖 CareerGuide AI</strong>

            <p>Thinking...</p>

          </div>
        )}

      </div>

      {error && (
        <div className="chat-error">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-input-area">

        <textarea
          placeholder="Ask your career question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="3"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default Chatbot;