"use client";

import { sendInvitation } from "@/app/api/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1, "Please select a role"),
  message: z.string().optional(),
});

interface PendingInvite {
  email: string;
  name: string;
  avatar?: string;
  timestamp: string;
}

const pendingInvites: PendingInvite[] = [
  {
    email: "jane@example.com",
    name: "Jane Doe",
    avatar: "/placeholder.svg",
    timestamp: "Just now",
  },
  {
    email: "john@example.com",
    name: "John Smith",
    avatar: "/placeholder.svg",
    timestamp: "Yesterday",
  },
];

function InviteDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await sendInvitation(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
          Invite Team Members
          <Plus className="w-4 h-4 mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on things. They'll receive an
            email invitation to join your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OWNER">OWNER</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="MANAGER">MANAGER</SelectItem>
                      <SelectItem value="INTERVIEWER">INTERVIEWER</SelectItem>
                      <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal note to your invitation..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="text-sm font-medium">Pending Invitations</div>
              <div className="space-y-3">
                {pendingInvites.map((invite, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={invite.avatar} alt={invite.name} />
                        <AvatarFallback>{invite.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {invite.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invite.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {invite.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Send Invitation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteDialog;
