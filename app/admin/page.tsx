"use client";

/* Next */
import { useRouter } from "next/navigation";
import { useState } from "react";

/* Convex */
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";

/* Components */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useUser, useClerk } from "@clerk/nextjs";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, Logout05Icon } from "@hugeicons/core-free-icons";

function AdminDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isAdmin = useQuery(api.userAccess.isAdmin);
  // Only fetch users if user is confirmed as admin
  const allUsers = useQuery(
    api.userAccess.getAllUsers,
    isAdmin === true ? {} : "skip"
  );
  const approveUserMutation = useMutation(api.userAccess.approveUser);
  const rejectUserMutation = useMutation(api.userAccess.rejectUser);

  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  // Show loading or unauthorized message
  if (isAdmin === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
          <Button onClick={() => router.push("/menu")}>Go to Menu</Button>
        </div>
      </div>
    );
  }

  const pendingUsers = allUsers?.filter((user) => user.status === "pending") || [];
  const approvedUsers = allUsers?.filter((user) => user.status === "approved") || [];
  const rejectedUsers = allUsers?.filter((user) => user.status === "rejected") || [];

  const handleApprove = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      await approveUserMutation({ userId });
      toast.success("User approved successfully");
    } catch (error) {
      toast.error("Failed to approve user");
      console.error(error);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setProcessingUserId(userId);
      await rejectUserMutation({ userId });
      toast.success("User rejected");
    } catch (error) {
      toast.error("Failed to reject user");
      console.error(error);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const UserTable = ({ users, showActions = false }: { users: typeof allUsers; showActions?: boolean }) => {
    if (!users || users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Requested</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                {user.name || "N/A"}
              </TableCell>
              <TableCell>{user.email || user.userId}</TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {user.userId.slice(0, 20)}...
              </TableCell>
              <TableCell>{formatDate(user.requestedAt)}</TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(user.userId)}
                      disabled={processingUserId === user.userId}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user.userId)}
                      disabled={processingUserId === user.userId}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
              <HugeiconsIcon icon={Logout05Icon} strokeWidth={2} />
              Log out
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                <AlertDialogAction size="sm" variant="destructive" onClick={handleLogout}>Log out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Access Management</CardTitle>
              <CardDescription>
                Review and manage user access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">
                    Pending
                    {pendingUsers.length > 0 && (
                      <Badge variant="secondary" className="ml-2 size-5 p-0">
                        {pendingUsers.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved
                    {approvedUsers.length > 0 && (
                      <Badge variant="default" className="ml-2 size-5 p-0">
                        {approvedUsers.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected
                    {rejectedUsers.length > 0 && (
                      <Badge variant="destructive" className="ml-2 size-5 p-0">
                        {rejectedUsers.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                  <UserTable users={pendingUsers} showActions={true} />
                </TabsContent>
                <TabsContent value="approved" className="mt-4">
                  <UserTable users={approvedUsers} showActions={false} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-4">
                  <UserTable users={rejectedUsers} showActions={false} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AdminDashboard />
      </Authenticated>
    </>
  );
}

