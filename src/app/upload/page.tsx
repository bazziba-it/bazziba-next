"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Textarea } from "@/components/ui";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

const uploadSchema = z.object({
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  description: z.string().optional(),
  category: z.string().min(1, "Seleziona una categoria"),
  tags: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).default("PUBLIC"),
  contestId: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<{ url: string; uid: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      visibility: "PUBLIC",
    },
  });

  const selectedFile = watch("videoFile");

  // Cloudflare Stream upload
  const uploadToCloudflare = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Step 1: Create direct upload URL
      const response = await fetch("/api/upload/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create upload session");
      }

      const { uploadUrl, videoId } = await response.json();

      // Step 2: Upload the video file directly to Cloudflare R2/Stream
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadedVideo({ url: uploadUrl, uid: videoId });
          setIsUploading(false);
        } else {
          setUploadError("Upload failed. Please try again.");
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setUploadError("Upload failed. Please check your connection.");
        setIsUploading(false);
      };

      // Use TUS protocol or direct POST for Cloudflare
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);

    } catch (error: any) {
      setUploadError(error.message || "Upload failed");
      setIsUploading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Formato video non supportato. Usa MP4, WebM o MOV.");
        return;
      }

      // Validate file size (max 500MB for free tier, 5GB for paid)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError("Il file supera il limite massimo di 500MB.");
        return;
      }

      setValue("videoFile", file);
      uploadToCloudflare(file);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!uploadedVideo) {
      setUploadError("Carica prima il video");
      return;
    }

    // Submit video metadata
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        videoUrl: uploadedVideo.url,
        playbackId: uploadedVideo.uid,
        thumbnail: uploadedVideo.uid + "/thumbnail.jpg",
      }),
    });

    if (!response.ok) {
      setUploadError("Errore nel salvataggio del video");
      return;
    }

    // Reset form
    setValue("title", "");
    setValue("description", "");
    setValue("category", "");
    setSubmitted(true);
  };

  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Video caricato con successo!</h2>
            <p className="text-muted-foreground mb-4">
              Il tuo video è in coda per l'elaborazione. Riceverai una notifica quando sarà pronto.
            </p>
            <Button asChild>
              <a href="/feed">Vai al mio feed</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Carica il tuo video</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Video File</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedVideo ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-brand-yellow transition-colors"
                  onClick={() => document.getElementById("video-upload")?.click()}
                >
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    {...register("videoFile")}
                  />
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Clicca per selezionare un file video (max 500MB)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formati supportati: MP4, WebM, MOV
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-yellow/10 rounded p-2">
                      <VideoIcon className="h-6 w-6 text-brand-yellow" />
                    </div>
                    <span className="font-medium">Video caricato</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedVideo(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Caricamento in corso...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-brand-yellow h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{uploadError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dettagli del video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Titolo *
                </label>
                <Input
                  placeholder="Inserisci il titolo del video"
                  error={errors.title?.message}
                  {...register("title")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrizione
                </label>
                <Textarea
                  placeholder="Descrivi il tuo video..."
                  rows={4}
                  {...register("description")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria *
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register("category")}
                >
                  <option value="">Seleziona una categoria</option>
                  <option value="cantanti">Cantanti</option>
                  <option value="musicisti">Musicisti</option>
                  <option value="arti-varie">Arti Varie</option>
                  <option value="artisti-di-strada">Artisti Di Strada</option>
                  <option value="poeti">Poeti</option>
                  <option value="dj">DJ</option>
                  <option value="ballerini">Ballerini</option>
                  <option value="cinema">Cinema</option>
                  <option value="pittori">Pittori</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tag (separati da virgola)
                </label>
                <Input
                  placeholder="es: cover, musica, canto"
                  {...register("tags")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Visibilità
                </label>
                <div className="flex gap-3">
                  {["PUBLIC", "PRIVATE", "UNLISTED"].map((v) => (
                    <label key={v} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        value={v}
                        defaultChecked={v === "PUBLIC"}
                        {...register("visibility")}
                      />
                      <span className="text-sm">
                        {v === "PUBLIC" ? "Pubblico" : v === "PRIVATE" ? "Privato" : "Non in elenco"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!uploadedVideo}
          >
            Pubblica Video
          </Button>
        </form>
      </div>
    </div>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4 2m0 0l-4 2m4-2L9 7v10l6-5z" />
    </svg>
  );
}
