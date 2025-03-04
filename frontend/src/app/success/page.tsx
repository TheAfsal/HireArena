"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { verifySubscription } from "../api/subscription";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setMessage("Invalid session. Redirecting...");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    verifySubscription(sessionId)
      .then((res:any) => {
        setMessage("Subscription activated successfully! Redirecting...");
        setTimeout(() => router.push("/job-seeker"), 3000);
      })
      .catch((err:any) => {
        console.error(err);
        setMessage("Payment verification failed. Please contact support.");
        setTimeout(() => router.push("/"), 5000);
      })
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? <p>Verifying payment...</p> : <p>{message}</p>}
    </div>
  );
};

export default SuccessPage;
