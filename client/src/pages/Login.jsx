import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";


function Login() {


  const navigate = useNavigate();


  const [form, setForm] = useState({

    email: "",
    password: ""

  });


  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };




  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {


      const response = await fetch(
`${import.meta.env.VITE_API_URL}/api/auth/login`,

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify(form)

        }

      );



      const data = await response.json();



      console.log("Login Response:", data);



      if(response.ok){


        localStorage.setItem(
          "token",
          data.token
        );


        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );



        alert("Login Successful 🌙");


        navigate("/dashboard");


      }
      else{


        alert(
          data.message || "Login Failed"
        );


      }



    }
    catch(error){


      console.log(error);

      alert(
        "Server not connected ❌"
      );


    }


    finally{

      setLoading(false);

    }


  };





  return (

    <div className="auth-container">


      <div className="auth-card">



        <h1>
          🌙 AstroGuru AI
        </h1>


        <h2>
          Welcome Back
        </h2>



        <p>
          Login to explore your cosmic guidance
        </p>




        <form onSubmit={handleLogin}>


          <input

            type="email"

            name="email"

            placeholder="Enter Email"

            value={form.email}

            onChange={handleChange}

            required

          />




          <input

            type="password"

            name="password"

            placeholder="Enter Password"

            value={form.password}

            onChange={handleChange}

            required

          />




          <button type="submit">


            {
              loading
              ?
              "Logging in..."
              :
              "Login 🌙"
            }


          </button>



        </form>




        <p className="switch-text">


          New user?


          <span
            onClick={() => navigate("/signup")}
          >

            Create Account

          </span>


        </p>



      </div>


    </div>

  );


}


export default Login;