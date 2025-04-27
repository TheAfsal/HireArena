import { Suspense } from "react";
import GoogleLoginContent from "./components/googleLoginContent";

export default function GoogleLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleLoginContent />
    </Suspense>
  );
}
