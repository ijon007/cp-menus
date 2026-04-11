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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
import { useClerk } from "@clerk/nextjs";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout05Icon } from "@hugeicons/core-free-icons";

const isDev = process.env.NODE_ENV === "development";

function AdminDashboard() {
  const router = useRouter();
  const { signOut } = useClerk();
  const isAdmin = useQuery(api.userAccess.isAdmin);
  const effectiveIsAdmin = isDev || isAdmin === true;
  const allUsers = useQuery(
    api.userAccess.getAllUsers,
    effectiveIsAdmin ? {} : "skip"
  );
  const approveUserMutation = useMutation(api.userAccess.approveUser);
  const rejectUserMutation = useMutation(api.userAccess.rejectUser);
  const entitlements = useQuery(
    api.adminEntitlements.listApprovedWithBusiness,
    effectiveIsAdmin ? {} : "skip"
  );
  const setWaiterEnabledMutation = useMutation(api.adminEntitlements.setWaiterEnabled);

  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [togglingBusinessId, setTogglingBusinessId] = useState<string | null>(null);

  if (!isDev && isAdmin === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isDev && isAdmin === false) {
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

  type UserAccessRow = NonNullable<typeof allUsers>[number];
  const pendingUsers = allUsers?.filter((u: UserAccessRow) => u.status === "pending") ?? [];
  const approvedUsers = allUsers?.filter((u: UserAccessRow) => u.status === "approved") ?? [];
  const rejectedUsers = allUsers?.filter((u: UserAccessRow) => u.status === "rejected") ?? [];

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

  type EntitlementRow = NonNullable<typeof entitlements>[number];

  const handleWaiterToggle = async (row: EntitlementRow, enabled: boolean) => {
    if (!row.business) return;
    try {
      setTogglingBusinessId(row.business._id);
      await setWaiterEnabledMutation({
        businessInfoId: row.business._id,
        enabled,
      });
      toast.success(enabled ? "Waiter features enabled" : "Waiter features disabled");
    } catch (error) {
      toast.error("Failed to update feature");
      console.error(error);
    } finally {
      setTogglingBusinessId(null);
    }
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

  const UserTable = ({ users, showActions = false }: { users: UserAccessRow[]; showActions?: boolean }) => {
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

        <Tabs defaultValue="access" className="grid gap-6">
          <TabsList className="w-full max-w-md justify-start">
            <TabsTrigger value="access">Access requests</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="access" className="mt-0">
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
                        <Badge variant="secondary" className="size-4 p-0">
                          {pendingUsers.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved
                      {approvedUsers.length > 0 && (
                        <Badge variant="default" className="size-4 p-0">
                          {approvedUsers.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected
                      {rejectedUsers.length > 0 && (
                        <Badge variant="destructive" className="size-4 p-0">
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
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Product features</CardTitle>
                <CardDescription>
                  Turn waiter tools and guest call-waiter on or off per approved restaurant. Menu-only accounts stay on the public menu without waiter surfaces.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!entitlements || entitlements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved users yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead className="text-right">Waiter</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entitlements.map((row: EntitlementRow) => {
                        const canToggle = row.business !== null;
                        const checked = row.business?.waiterEnabled ?? false;
                        const switchEl = (
                          <div className="flex items-center justify-end gap-2">
                            <Label htmlFor={`waiter-${row.userId}`} className="sr-only">
                              Waiter features for {row.name || row.email || row.userId}
                            </Label>
                            <Switch
                              id={`waiter-${row.userId}`}
                              checked={checked}
                              disabled={!canToggle || togglingBusinessId === row.business?._id}
                              onCheckedChange={(next: boolean) => {
                                void handleWaiterToggle(row, next);
                              }}
                            />
                          </div>
                        );
                        return (
                          <TableRow key={row.userId}>
                            <TableCell className="font-medium">
                              {row.name || "N/A"}
                            </TableCell>
                            <TableCell>{row.email || row.userId}</TableCell>
                            <TableCell>
                              {row.business ? (
                                row.business.businessName
                              ) : (
                                <span className="text-muted-foreground">Not set up yet</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!canToggle ? (
                                <Tooltip>
                                  <TooltipTrigger
                                    render={<span className="inline-flex justify-end">{switchEl}</span>}
                                  />
                                  <TooltipContent side="left">
                                    This user has not created a restaurant yet. Features apply after they set up their menu.
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                switchEl
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

