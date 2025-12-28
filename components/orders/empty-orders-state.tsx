export default function EmptyOrdersState() {
  return (
    <div className="border border-border bg-card rounded-lg p-12">
      <div className="text-center">
        <p className="text-muted-foreground">No orders yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Orders placed through your public menu will appear here.
        </p>
      </div>
    </div>
  );
}

