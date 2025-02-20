import Filters from "./components/Filters";
import Hero from "./components/Hero";
import JobList from "./components/JobList";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <SearchBar />
        <div className="py-8 flex gap-8">
          <Filters />
          <JobList />
        </div>
      </div>
    </main>
  );
}


// import React, { useState, useEffect } from "react";

// const ProductDisplay = () => (
//   <section>
//     <div className="product">
//       <img
//         src="https://i.imgur.com/EHyR2nP.png"
//         alt="The cover of Stubborn Attachments"
//       />
//       <div className="description">
//       <h3>Stubborn Attachments</h3>
//       <h5>$20.00</h5>
//       </div>
//     </div>
//     <form action="http://localhost:5000/create-checkout-session" method="POST">
//       <button type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// //@ts-ignore
// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

//   return message ? (
//     <Message message={message} />
//   ) : (
//     <ProductDisplay />
//   );
// }