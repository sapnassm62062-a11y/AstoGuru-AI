import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";


function Dashboard() {

  const navigate = useNavigate();


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };



  return (

    <div className="dashboard-page">


      <div className="dashboard-card">


        <div className="logo">

          🌙 AstroGuru AI

        </div>



        <h1>

          Welcome {user?.name || "Explorer"} ✨

        </h1>



        <p className="subtitle">

          Discover personalized astrology guidance powered by AI

        </p>




        <div className="feature-box">


          <div className="feature">

            🔮

            <h3>
              AI Astrology Chat
            </h3>

            <p>
              Ask questions about career, relationships and life guidance.
            </p>

          </div>



          <div className="feature">

            ⭐

            <h3>
              Birth Analysis
            </h3>

            <p>
              Get personalized insights using your birth details.
            </p>

          </div>



          <div className="feature">

            🌌

            <h3>
              Cosmic Guidance
            </h3>

            <p>
              Explore positive AI-based astrology suggestions.
            </p>

          </div>


        </div>





        <button

          className="primary-btn"

          onClick={() => navigate("/birth-details")}

        >

          Enter Birth Details 🌙

        </button>





        <button

          className="logout-btn"

          onClick={handleLogout}

        >

          Logout

        </button>



      </div>


    </div>

  );

}


export default Dashboard;