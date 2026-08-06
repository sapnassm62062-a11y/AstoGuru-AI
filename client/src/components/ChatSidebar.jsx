import "./../styles/AIChat.css";


function ChatSidebar({

    history,

    activeChat,

    setActiveChat,

    onNewChat,

    onClearChat

}) {



const user = JSON.parse(

    localStorage.getItem("user")

) || {};



const birth = JSON.parse(

    localStorage.getItem("birthDetails")

) || {};






return (

<aside className="chat-sidebar">



    <div className="brand">


        <h2>
            🌙 AstroGuru AI
        </h2>


        <p>
            AI Astrology Assistant
        </p>


    </div>







    <button

        className="new-chat-btn"

        onClick={onNewChat}

    >

        ＋ New Chat

    </button>








    <div className="history">


        <h4>
            Chat History
        </h4>




        {

        history.length === 0 ?


        (

        <p className="empty-history">

            No conversations yet

        </p>

        )


        :


        (

        history.map((chat,index)=>(


            <div

            key={chat.id}


            className={

            activeChat === index

            ?

            "history-item active"

            :

            "history-item"

            }



            onClick={()=>setActiveChat(index)}

            >


                <span>
                    💬
                </span>



                <span>

                {chat.title || "New Chat"}

                </span>



            </div>



        ))

        )


        }





    </div>








    <button

        className="clear-btn"

        onClick={onClearChat}

    >

        🗑 Clear History

    </button>









    <div className="astro-profile">


    <div className="profile-avatar">

        {
            user.name
            ?
            user.name.charAt(0).toUpperCase()
            :
            "U"
        }

    </div>



    <h3>
        {user.name || "Explorer"}
    </h3>


    <p className="profile-email">
        {user.email || "astro.user@gmail.com"}
    </p>



    <span className="astro-badge">

        🌙 Astro Explorer

    </span>





    <div className="profile-divider"></div>





    <h4 className="birth-title">

        Birth Profile ✨

    </h4>




    <div className="birth-info">


        <div className="birth-item">

            <span>📅</span>

            <p>
                {birth.date || "Not Added"}
            </p>

        </div>



        <div className="birth-item">

            <span>⏰</span>

            <p>
                {birth.time || "Not Added"}
            </p>

        </div>



        <div className="birth-item">

            <span>📍</span>

            <p>
                {birth.place || "Not Added"}
            </p>

        </div>



    </div>

<button

    className="logout-btn"

    onClick={()=>{

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("birthDetails");

        window.location.href="/login";

    }}

>

    🚪 Logout

</button>

</div>




</aside>

);


}


export default ChatSidebar;