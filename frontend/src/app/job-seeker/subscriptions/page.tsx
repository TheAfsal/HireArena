import type React from "react";
import SubscriptionPlans from "./components/SubscriptionPlans";
// import UserList from "./components/UserList"

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <main>
        <SubscriptionPlans />
        {/* <UserList /> */}
      </main>
    </div>
  );
};

export default Home;
