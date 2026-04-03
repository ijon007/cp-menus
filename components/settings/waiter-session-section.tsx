"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MIN_MINUTES = 5;
const MAX_MINUTES = 480;

interface WaiterSessionSectionProps {
  sessionDurationMinutes: number;
  onSessionDurationMinutesChange: (minutes: number) => void;
}

export default function WaiterSessionSection({
  sessionDurationMinutes,
  onSessionDurationMinutesChange,
}: WaiterSessionSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Waiter session</h3>
        <p className="text-xs text-muted-foreground">
          How long each table visit lasts for waiter-call limits. Guests can trigger up to three calls per
          table during this window; after it ends, scanning the QR again starts a fresh session.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="waiter-session-duration">Session duration (minutes)</Label>
        <Input
          id="waiter-session-duration"
          type="number"
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          step={5}
          value={sessionDurationMinutes}
          onChange={(e) => {
            const raw = e.target.valueAsNumber;
            if (!Number.isFinite(raw)) {
              onSessionDurationMinutesChange(MIN_MINUTES);
              return;
            }
            onSessionDurationMinutesChange(
              Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(raw)))
            );
          }}
        />
        <p className="text-xs text-muted-foreground">
          Between {MIN_MINUTES} and {MAX_MINUTES} minutes ({Math.floor(MAX_MINUTES / 60)} hours max).
        </p>
      </div>
    </div>
  );
}
