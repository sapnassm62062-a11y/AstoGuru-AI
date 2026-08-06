import { useState, useRef } from "react";


function ChatInput({ onSend, disabled }) {


  const [text, setText] = useState("");

  const textareaRef = useRef(null);



  const handleChange = (e) => {


    setText(e.target.value);



    const textarea = textareaRef.current;


    textarea.style.height = "auto";


    textarea.style.height =
      textarea.scrollHeight + "px";


  };





  const sendMessage = () => {


    if(!text.trim() || disabled){

      return;

    }


    onSend(text);


    setText("");



    if(textareaRef.current){

      textareaRef.current.style.height = "auto";

    }


  };







  const handleKeyDown = (e) => {


    if(e.key === "Enter" && !e.shiftKey){

      e.preventDefault();

      sendMessage();

    }


  };





  return (

    <div className="chat-input-container">



      <textarea

        ref={textareaRef}

        value={text}

        onChange={handleChange}

        onKeyDown={handleKeyDown}

        placeholder="Ask AstroGuru anything..."

        rows="1"

        disabled={disabled}

      />





      <button

        className="send-btn"

        onClick={sendMessage}

        disabled={disabled}

      >


        {
          disabled
          ?
          "⏳"
          :
          "➤"
        }


      </button>



    </div>

  );

}



export default ChatInput;