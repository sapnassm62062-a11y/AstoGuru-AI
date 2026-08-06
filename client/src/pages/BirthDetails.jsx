import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";


function BirthDetails() {


  const navigate = useNavigate();


  const [form, setForm] = useState({

    date: "",

    time: "",

    place: ""

  });



  const handleChange = (e) => {


    setForm({

      ...form,

      [e.target.name]: e.target.value

    });


  };





  const handleSubmit = (e) => {


    e.preventDefault();



    if(
      !form.date ||
      !form.time ||
      !form.place
    ){

      alert("Please complete all birth details");

      return;

    }



    // Save birth details

    localStorage.setItem(
      "birthDate",
      form.date
    );


    localStorage.setItem(
      "birthTime",
      form.time
    );


    localStorage.setItem(
      "birthPlace",
      form.place
    );



    // Save complete object also

    localStorage.setItem(
      "birthDetails",
      JSON.stringify(form)
    );



    alert("Birth Details Saved 🌙");



    navigate("/chat");


  };




  return (

    <div className="auth-container">


      <div className="auth-card">


        <h1>
          🌌 Birth Details
        </h1>


        <p>
          Enter your birth information for personalized AI astrology guidance.
        </p>




        <form onSubmit={handleSubmit}>


          <input

            type="date"

            name="date"

            value={form.date}

            onChange={handleChange}

          />



          <input

            type="time"

            name="time"

            value={form.time}

            onChange={handleChange}

          />



          <input

            type="text"

            name="place"

            placeholder="Birth Place"

            value={form.place}

            onChange={handleChange}

          />



          <button type="submit">

            Continue to AstroGuru 🌙

          </button>



        </form>


      </div>


    </div>

  );

}



export default BirthDetails;