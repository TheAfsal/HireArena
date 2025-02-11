"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { changeJobSeekerPassword } from "@/app/api/profile";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// const emailSchema = z.object({
//   email: z.string().email("Invalid email address"),
// });

type PasswordFormValues = z.infer<typeof passwordSchema>;
// type EmailFormValues = z.infer<typeof emailSchema>;

export default function LoginDetails() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  // const emailForm = useForm<EmailFormValues>({
  //   resolver: zodResolver(emailSchema),
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  // function onEmailSubmit(data: EmailFormValues) {
  //   console.log(data);
  //   // Handle email update
  // }

  async function onPasswordSubmit(data: PasswordFormValues) {
    if (data.oldPassword === data.newPassword) {
      toast({
        variant: 'destructive',
        title: "Failed to change",
        //@ts-ignore;
        description: "New password cannot be the same as the old password.",
      })
      return;
    }

    try {
      await changeJobSeekerPassword(data.oldPassword, data.newPassword);
      toast({
        variant:"default",
        title: "Password updated successfully.",
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Failed to change",
        //@ts-ignore;
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          This is login information that you can update anytime.
        </p>
      </div>

      {/* <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Update Email</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Update your email address to make sure it is safe
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>jakegyll@email.com</span>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-muted-foreground">
            Your email address is verified.
          </span>
        </div>

        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Email</Button>
          </form>
        </Form>
      </div> */}

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">New Password</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Manage your password to make sure it is safe
          </p>
        </div>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your old password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 6 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 6 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Change Password</Button>
          </form>
        </Form>
      </div>

      <div className="pt-4 border-t">
        {showDeleteConfirm ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              Are you sure you want to close your account?
            </AlertTitle>
            <AlertDescription>
              This action cannot be undone. All your data will be permanently
              deleted.
              <div className="flex gap-2 mt-4">
                <Button
                  variant="destructive"
                  onClick={() => console.log("Account deleted")}
                >
                  Yes, close my account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            variant="ghost"
            className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 p-0"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Info className="m-1" />
            Close Account
          </Button>
        )}
      </div>
    </div>
  );
}
