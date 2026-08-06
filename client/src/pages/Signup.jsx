import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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


  const handleSignup = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/signup`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(form)
  }
);


      const data = await response.json();


      console.log("Signup Response:", data);


      if(response.ok){

        alert("Account Created Successfully ✅");

        navigate("/login");

      }
      else{

        alert(data.message || "Signup Failed");

      }


    }
    catch(error){

      console.log("Signup Error:", error);

      alert("Server not connected ❌");

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
          Create Account
        </h2>



        <form onSubmit={handleSignup}>


          <input

            type="text"

            name="name"

            placeholder="Enter your name"

            value={form.name}

            onChange={handleChange}

            required

          />



          <input

            type="email"

            name="email"

            placeholder="Enter email"

            value={form.email}

            onChange={handleChange}

            required

          />



          <input

            type="password"

            name="password"

            placeholder="Create password"

            value={form.password}

            onChange={handleChange}

            required

          />



          <button 
            type="submit"
            disabled={loading}
          >

            {
              loading 
              ? "Creating..."
              : "Create Account"
            }

          </button>



        </form>



        <p>

          Already have an account?

          <span
            onClick={() => navigate("/login")}
          >
             Login
          </span>

        </p>



      </div>


    </div>

  );

}


export default Signup;