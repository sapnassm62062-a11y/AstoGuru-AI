import { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import TypingLoader from "../components/TypingLoader";
import "../styles/AIChat.css";


function Chat(){


const user = JSON.parse(
    localStorage.getItem("user")
) || {};



const birthDetails =
JSON.parse(
    localStorage.getItem("birthDetails")
)
||
{
    date:"",
    time:"",
    place:""
};





const [history,setHistory] = useState(()=>{

const saved =
localStorage.getItem("astroHistory");


return saved
?
JSON.parse(saved)
:
[];

});





const [activeChat,setActiveChat] = useState(null);


const [loading,setLoading] = useState(false);





useEffect(()=>{


localStorage.setItem(

"astroHistory",

JSON.stringify(history)

);


},[history]);







const messages =

activeChat !== null

?

history[activeChat]?.messages || []

:

[];







const createNewChat = ()=>{


const newChat = {


id:Date.now(),


title:"New Astro Chat",


messages:[]

};



setHistory(prev=>[

...prev,

newChat

]);



setActiveChat(
history.length
);



};








const clearHistory=()=>{


setHistory([]);

setActiveChat(null);

localStorage.removeItem(
"astroHistory"
);


};









const sendMessage = async(question)=>{



let chatIndex = activeChat;



if(chatIndex===null){


const newChat={

id:Date.now(),

title:
question.slice(0,25),

messages:[]

};



setHistory(prev=>[

...prev,

newChat

]);



chatIndex = history.length;


setActiveChat(chatIndex);


}




const userMsg={


role:"user",

content:question,

time:new Date()


};




setHistory(prev=>{


const copy=[...prev];


copy[chatIndex].messages.push(userMsg);


if(copy[chatIndex].title==="New Astro Chat"){

copy[chatIndex].title =
question.slice(0,25);

}


return copy;


});





setLoading(true);






try{


const res = await fetch(

`${import.meta.env.VITE_API_URL}/api/chat`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

question,

name:user.name,

birthDate:birthDetails.date,

birthTime:birthDetails.time,

birthPlace:birthDetails.place


})


}

);



const data =
await res.json();





const aiMsg={

role:"ai",

content:
data.reply ||
data.message ||
"AI error",

time:new Date()

};






setHistory(prev=>{


const copy=[...prev];


copy[chatIndex]
.messages.push(aiMsg);


return copy;


});




}

catch(error){


console.log(error);


}





finally{


setLoading(false);


}


};









return(


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



{

messages.map((msg,index)=>(

<ChatMessage

key={index}

message={msg}

/>

))

}





{
messages.length === 0 && (

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
onClick={()=>sendMessage(
"Tell me about my career"
)}
>

💼 Career Guidance

<span>
Explore career opportunities
</span>

</button>





<button
onClick={()=>sendMessage(
"Tell me about my relationship"
)}
>

❤️ Relationship

<span>
Understand relationship patterns
</span>

</button>






<button
onClick={()=>sendMessage(
"Give me study guidance"
)}
>

🎓 Study Guidance

<span>
Improve your learning journey
</span>

</button>






<button
onClick={()=>sendMessage(
"How can I improve myself?"
)}
>

🌱 Personal Growth

<span>
Build better habits
</span>

</button>



</div>


</div>

)
}





{

loading && <TypingLoader/>

}




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