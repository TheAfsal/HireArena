"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AcceptInvitation, fetchInvitationDetails } from "@/app/api/auth";
import { useParams } from "next/navigation";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function SignupPage() {
  const [loading,setLoading] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState<
    PasswordRequirement[]
  >([
    { text: "At least 6 characters long", met: false },
    { text: "Contains at least one uppercase letter", met: false },
    { text: "Contains at least one number", met: false },
    { text: "Contains at least one special character", met: false },
  ]);
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
        console.log(error);
      }
    };

    invitationDetails();
  }, [token]);

  const checkPasswordRequirements = (pass: string) => {
    const requirements = [
      { text: "At least 6 characters long", met: pass.length >= 6 },
      {
        text: "Contains at least one uppercase letter",
        met: /[A-Z]/.test(pass),
      },
      { text: "Contains at least one number", met: /[0-9]/.test(pass) },
      {
        text: "Contains at least one special character",
        met: /[!@#$%^&*]/.test(pass),
      },
    ];
    setPasswordRequirements(requirements);
    return requirements.every((req) => req.met);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordRequirements(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkPasswordRequirements(password) || !name.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      await AcceptInvitation(token as string, name, password);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Account Setup
          </CardTitle>
          <CardDescription className="text-center">
            Set up your password to access your team workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={invitationDetails.email}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <Text className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  {passwordRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          requirement.met ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          requirement.met ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {requirement.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {confirmPassword && password !== confirmPassword && (
              <Alert variant="destructive">
                <AlertDescription>Passwords do not match</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                !passwordRequirements.every((req) => req.met)
              }
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
