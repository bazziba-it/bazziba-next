"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";
import { Calendar, Trophy, Video } from "lucide-react";
import type { Contest } from "@/types";

const entrySchema = z.object({
  videoId: z.string().min(1, "Seleziona un video"),
});

type EntryFormData = z.infer<typeof entrySchema>;

interface ContestEntryProps {
  contest: Contest & {
    entries: Array<{
      id: string;
      videoId: string;
      video: {
        id: string;
        title: string;
        thumbnail?: string | null;
        viewCount: number;
      };
    }>;
  };
}

export function ContestEntry({ contest }: ContestEntryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  const [contestEntries, setContestEntries] = useState(contest.entries || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
  });

  const onSubmit = async (data: EntryFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contest/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestId: contest.id,
          videoId: data.videoId,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit entry");

      toast.success("Partecipazione al contest inviata con successo!");
      setHasEntry(true);
    } catch (error) {
      toast.error("Errore nell'invio della partecipazione");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check contest phase
  const status = contest.status as string;
  const canEnter = status === "ACTIVE" || status === "VOTING";
  const isInPrereg = status === "PREREGISTRATION" || status === "UPCOMING";

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Partecipa al Contest</h2>
        <div className={`flex items-center gap-1 text-sm ${
          canEnter ? "text-green-500" : isInPrereg ? "text-yellow-500" : "text-gray-500"
        }`}>
          <Calendar className="h-4 w-4" />
          {isInPrereg ? "Iscrizione in corso" : canEnter ? "In corso" : "Terminato"}
        </div>
      </div>

      {!canEnter && isInPrereg && (
        <p className="text-sm text-muted-foreground">
          Il contest non è ancora aperto alla partecipazione. Registra il tuo video ora e sarai 
          tra i primi a partecipare quando inizia la votazione!
        </p>
      )}

      {canEnter && !hasEntry && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Seleziona il tuo video
            </label>
            <select
              {...register("videoId")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Seleziona un video...</option>
              {contestEntries.map((entry) => (
                <option key={entry.video.id} value={entry.video.id}>
                  {entry.video.title}
                </option>
              ))}
            </select>
            {errors.videoId && (
              <p className="text-xs text-destructive mt-1">{errors.videoId.message}</p>
            )}
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            <Trophy className="h-4 w-4 mr-2" />
            Partecipa al Contest
          </Button>
        </form>
      )}

      {hasEntry && (
        <div className="flex items-center gap-2 text-green-600">
          <Trophy className="h-4 w-4" />
          <span className="font-medium">Il tuo video è stato selezionato per il contest!</span>
        </div>
      )}

      {contestEntries.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nessun video disponibile per partecipare al contest.
        </p>
      )}
    </div>
  );
}

export function ContestEntryForm({ contest }: ContestEntryProps) {
  return <ContestEntry contest={contest} />;
}
