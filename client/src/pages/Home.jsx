import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


function Home() {

  const navigate = useNavigate();


  return (

    <div className="home-page">


      <nav className="navbar">


        <div className="brand">

          🌙 AstroGuru AI

        </div>



        <div className="nav-buttons">


          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>


          <button
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>


        </div>


      </nav>





      <section className="hero">


        <div className="hero-content">


          <h1>

            Discover Your Cosmic Journey 🌌

          </h1>


          <p>

            Get AI-powered astrology guidance based on your birth details.
            Explore career, relationships and personal growth insights.

          </p>



          <button

            className="start-btn"

            onClick={() => navigate("/signup")}

          >

            Start Your Journey ✨

          </button>


        </div>





        <div className="planet">


          🌙

        </div>


      </section>





      <section className="features">


        <div className="feature-card">

          🔮

          <h3>
            AI Astrology
          </h3>

          <p>
            Ask questions and receive personalized AI guidance.
          </p>

        </div>




        <div className="feature-card">

          ⭐

          <h3>
            Birth Analysis
          </h3>

          <p>
            Understand yourself through your birth information.
          </p>

        </div>





        <div className="feature-card">

          🌌

          <h3>
            Life Guidance
          </h3>

          <p>
            Explore career, love and personal growth insights.
          </p>

        </div>



      </section>




    </div>

  );

}


export default Home;