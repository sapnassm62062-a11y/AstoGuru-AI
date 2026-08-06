import ReactMarkdown from "react-markdown";
import "../styles/AIChat.css";


function ChatMessage({message}){


const isAI = message.role==="ai";



return(

<div
className={`message-row ${
isAI ? "ai-row":"user-row"
}`}
>



{
isAI &&

<div className="message-avatar ai-avatar">

🌙

</div>

}





<div
className={`message-bubble ${
isAI
?
"ai-bubble"
:
"user-bubble"
}`}
>



{

isAI &&

<div className="ai-title">

✨ AstroGuru Insight

</div>

}





<div className="message-content">


<ReactMarkdown>


{message.content}


</ReactMarkdown>


</div>





<span className="message-time">

{

new Date(message.time)

.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})

}

</span>




</div>





{

!isAI &&

<div className="message-avatar user-avatar">

👤

</div>

}




</div>


);


}


export default ChatMessage;