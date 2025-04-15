import { ForgotPassword } from "@/app/api/auth";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface EmailPopupProps {
  onClose: () => void;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Email entered:", email);
      await ForgotPassword(email);

      onClose();
      toast({
        title: "Success",
        description: "Email sent successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid email",
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Please enter your email address
        </h2>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="py-2">We will sent you a link to change your passowrd</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
