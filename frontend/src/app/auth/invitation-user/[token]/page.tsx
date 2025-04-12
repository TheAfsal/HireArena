"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { AppDispatch } from "@/redux/store";
import React from "react";
import Image from "next/image";
import { fetchInvitationDetails } from "@/app/api/auth";

function InvitationAccept() {
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading] = useState<boolean>(true);

  const [invitationDetails, setInvitationDetails] = useState<{
    email: string;
    message: string;
    role: string;
    name: string;
  }>({
    email: "",
    message: "",
    role: "",
    name: "",
  });

  const params = useParams();

  const token = params.token;

  useEffect(() => {
    const invitationDetails = async () => {
      try {
        let response = await fetchInvitationDetails(token as string);
        console.log(response);
        setInvitationDetails(response.data);
      } catch (error: unknown) {
        //@ts-ignore
        setError(error.message || "Something went wrong. Please try again."); // Set error message
        //@ts-ignore
        console.log(error.message);
      }finally{
        setLoading(false)
      }
    };

    invitationDetails();
  }, [token]);

  if(loading){
    return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="px-4 py-8 md:px-6 lg:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Image
            src="/invitationBanner.jpg"
            alt="Acme Logo"
            width={600}
            height={200}
            className="w-full rounded-lg"
          />
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              You&apos;re invited to join {invitationDetails.name}
            </h1>

            <div className="space-y-4 text-gray-600">
              <p>Hey there,</p>
              <p>
                {invitationDetails.message ??
                  `I&apos;m Alex, the CEO of Acme. We&apos;re building the best job
              search experience on the planet and we&apos;d love for you to join
              us.`}
              </p>
            </div>

            <div>
              <Link
                href={`/auth/invitation-signup/${token}`}
                className="rounded-xl bg-blue-400 hover:bg-blue-700 hover:text-white py-3 px-5 mt-10"
              >
                Join {invitationDetails.name}
              </Link>
            </div>

            <div className="grid gap-6 pt-8 md:grid-cols-3">
              <Card className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">
                    Create a profile
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  Get started by creating your profile. It only takes a few
                  minutes.
                </p>
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900">
                  Connect with your team
                </h3>
                <p className="text-sm text-gray-500">
                  Connect with your team members to collaborate on hiring.
                </p>
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900">Start hiring</h3>
                <p className="text-sm text-gray-500">
                  Use our platform to post jobs, manage candidates and make
                  great hires.
                </p>
              </Card>
            </div>

            <div className="pt-6 text-sm text-gray-500">
              <p>
                If you have any questions or need help, please visit our Help
                Center or contact our support team at{" "}
                <Link
                  href="mailto:support@acme.com"
                  className="text-blue-600 hover:underline"
                >
                  support@acme.com
                </Link>
              </p>
              <p className="mt-2">Best, Alex</p>
            </div>

            <footer className="border-t pt-6 mt-8 text-center text-sm text-gray-500">
              <div className="space-x-4">
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:underline">
                  Terms of Service
                </Link>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationAccept;

// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"

// function InvitationPage() {
//   return (
//     <div className="min-h-screen bg-[#faf7f5] px-4 py-8 md:px-6 lg:py-12">
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-8 text-center">
//           <Image
//             src="/invitationBanner.jpg"
//             alt="Acme Logo"
//             width={600}
//             height={200}
//             className="w-full rounded-lg"
//           />
//         </div>

//         <div className="space-y-6">
//           <h1 className="text-2xl font-semibold text-gray-900">You&apos;re invited to join Acme</h1>

//           <div className="space-y-4 text-gray-600">
//             <p>Hey there,</p>
//             <p>
//               I&apos;m Alex, the CEO of Acme. We&apos;re building the best job search experience on the planet and
//               we&apos;d love for you to join us.
//             </p>
//           </div>

//           <Button className="bg-blue-600 hover:bg-blue-700">Join Acme</Button>

//           <div className="grid gap-6 pt-8 md:grid-cols-3">
//             <Card className="p-4 space-y-2">
//               <div className="flex items-center gap-2">
//                 <div className="h-5 w-5 rounded-full border-2 border-green-500 flex items-center justify-center">
//                   <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 8 8">
//                     <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
//                   </svg>
//                 </div>
//                 <h3 className="font-medium text-gray-900">Create a profile</h3>
//               </div>
//               <p className="text-sm text-gray-500">
//                 Get started by creating your profile. It only takes a few minutes.
//               </p>
//             </Card>

//             <Card className="p-4 space-y-2">
//               <h3 className="font-medium text-gray-900">Connect with your team</h3>
//               <p className="text-sm text-gray-500">Connect with your team members to collaborate on hiring.</p>
//             </Card>

//             <Card className="p-4 space-y-2">
//               <h3 className="font-medium text-gray-900">Start hiring</h3>
//               <p className="text-sm text-gray-500">
//                 Use our platform to post jobs, manage candidates and make great hires.
//               </p>
//             </Card>
//           </div>

//           <div className="pt-6 text-sm text-gray-500">
//             <p>
//               If you have any questions or need help, please visit our Help Center or contact our support team at{" "}
//               <Link href="mailto:support@acme.com" className="text-blue-600 hover:underline">
//                 support@acme.com
//               </Link>
//             </p>
//             <p className="mt-2">Best, Alex</p>
//           </div>

//           <footer className="border-t pt-6 mt-8 text-center text-sm text-gray-500">
//             <div className="space-x-4">
//               <Link href="#" className="hover:underline">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="hover:underline">
//                 Terms of Service
//               </Link>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default InvitationPage
