interface WaitingForApprovalProps {
  status: "pending" | "rejected";
}

export default function WaitingForApproval({ status }: WaitingForApprovalProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Waiting for Approval
            </h1>
            <p className="text-muted-foreground">
              Your access request is {status === "pending" ? "pending" : "rejected"}. 
              Please wait for an administrator to review your request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

