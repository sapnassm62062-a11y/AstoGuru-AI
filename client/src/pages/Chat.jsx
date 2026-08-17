import { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import TypingLoader from "../components/TypingLoader";
import "../styles/AIChat.css";

function Chat() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const birthDetails =
    JSON.parse(localStorage.getItem("birthDetails")) || {
      date: "",
      time: "",
      place: "",
    };

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("astroHistory");

    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    localStorage.setItem(
      "astroHistory",
      JSON.stringify(history)
    );
  }, [history]);

  const messages =
    activeChat !== null &&
    history[activeChat]
      ? history[activeChat].messages || []
      : [];

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Astro Chat",
      messages: [],
    };

    setHistory((prev) => [...prev, newChat]);

    setActiveChat(history.length);
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveChat(null);
    localStorage.removeItem("astroHistory");
  };

  const sendMessage = async (question) => {
    if (!question || !question.trim()) return;

    let chatIndex = activeChat;

    // Create chat if no chat is selected
    if (chatIndex === null) {
      const newChat = {
        id: Date.now(),
        title: question.slice(0, 25),
        messages: [],
      };

      setHistory((prev) => [...prev, newChat]);

      chatIndex = history.length;

      setActiveChat(chatIndex);
    }

    const userMsg = {
      role: "user",
      content: question,
      time: new Date().toISOString(),
    };

    // Add user message
    setHistory((prev) => {
      const copy = [...prev];

      if (!copy[chatIndex]) {
        copy[chatIndex] = {
          id: Date.now(),
          title: question.slice(0, 25),
          messages: [],
        };
      }

      copy[chatIndex].messages.push(userMsg);

      if (
        copy[chatIndex].title === "New Astro Chat"
      ) {
        copy[chatIndex].title =
          question.slice(0, 25);
      }

      return copy;
    });

    setLoading(true);

    try {
      const chatURL = `${API_URL}/api/chat`;

      console.log("AI Chat URL:", chatURL);

      const response = await fetch(chatURL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: question,

          name: user.name || "",

          birthDate: birthDetails.date || "",

          birthTime: birthDetails.time || "",

          birthPlace: birthDetails.place || "",
        }),
      });

      console.log(
        "AI Chat Status:",
        response.status
      );

      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Server returned non-JSON:",
          text
        );

        throw new Error(
          `AI server returned ${response.status}. Check the /api/chat backend route.`
        );
      }

      console.log("AI Chat Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "AI server error"
        );
      }

      const aiReply =
        data.reply ||
        data.response ||
        data.answer ||
        data.message;

      if (!aiReply) {
        throw new Error(
          "AI did not return a response."
        );
      }

      const aiMsg = {
        role: "ai",
        content: aiReply,
        time: new Date().toISOString(),
      };

      setHistory((prev) => {
        const copy = [...prev];

        if (!copy[chatIndex]) {
          return prev;
        }

        copy[chatIndex].messages.push(aiMsg);

        return copy;
      });
    } catch (error) {
      console.error("AI Chat Error:", error);

      const errorMsg = {
        role: "ai",
        content:
          "Sorry, AI response nahi aa pa raha. Please check the server connection. ❌",
        time: new Date().toISOString(),
      };

      setHistory((prev) => {
        const copy = [...prev];

        if (!copy[chatIndex]) {
          return prev;
        }

        copy[chatIndex].messages.push(errorMsg);

        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-layout">

      <ChatSidebar
        history={history}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onNewChat={createNewChat}
        onClearChat={clearHistory}
      />

      <main className="chat-main">

        <header className="chat-header">

          <h1>
            🌙 AstroGuru AI
          </h1>

          <p>
            AI Astrology Guidance Assistant
          </p>

        </header>

        <div className="chat-body">

          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
            />
          ))}

          {messages.length === 0 && (
            <div className="astro-empty-state">

              <div className="moon-animation">
                🌙
              </div>

              <h1>
                Welcome {user.name || "Explorer"}
              </h1>

              <h2>
                Your Personal AI Astrology Guide
              </h2>

              <p>
                Ask AstroGuru anything about career,
                study, relationship and personal growth.
              </p>

              <div className="prompt-cards">

                <button
                  onClick={() =>
                    sendMessage(
                      "Tell me about my career"
                    )
                  }
                >
                  💼 Career Guidance

                  <span>
                    Explore career opportunities
                  </span>
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "Tell me about my relationship"
                    )
                  }
                >
                  ❤️ Relationship

                  <span>
                    Understand relationship patterns
                  </span>
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "Give me study guidance"
                    )
                  }
                >
                  🎓 Study Guidance

                  <span>
                    Improve your learning journey
                  </span>
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "How can I improve myself?"
                    )
                  }
                >
                  🌱 Personal Growth

                  <span>
                    Build better habits
                  </span>
                </button>

              </div>

            </div>
          )}

          {loading && <TypingLoader />}

        </div>

        <ChatInput
          onSend={sendMessage}
          disabled={loading}
        />

      </main>

    </div>
  );
}

export default Chat;