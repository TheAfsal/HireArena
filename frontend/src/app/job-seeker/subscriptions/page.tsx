import type React from "react";
import SubscriptionPlans from "./components/SubscriptionPlans";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main><SubscriptionPlans /></main>
    </div>
  );
};

export default Home;
