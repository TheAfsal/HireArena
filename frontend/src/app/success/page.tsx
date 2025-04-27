import { Suspense } from "react";
import SuccessPage from "./components/successPage";

export default function GoogleLoginPage() {
  return (
    <Suspense fallback={<div> Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
