"use client";

import { useState, useCallback } from "react";
import { Upload as UploadIcon, X, FileVideo, Image as ImageIcon, Tag, Clock, Lock, Globe, Users } from "lucide-react";
import { Badge, Button, Separator } from "@/components/ui";

const categories = [
  { id: "cantanti", name: "Cantanti" },
  { id: "musicisti", name: "Musicisti" },
  { id: "arti-varie", name: "Arti Varie" },
  { id: "artisti-di-strada", name: "Artisti Di Strada" },
  { id: "poeti", name: "Poeti" },
  { id: "dj", name: "DJ" },
  { id: "ballerini", name: "Ballerini" },
  { id: "cinema", name: "Cinema" },
  { id: "pittori", name: "Pittori" },
];

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "UNLISTED" | "PRIVATE">("PUBLIC");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "drop") {
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setVideoFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Carica un Video</h1>
          <p className="text-muted-foreground mt-2">
            Condividi la tua arte con la community di Bazziba!
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? "border-brand-yellow bg-brand-yellow/5 scale-[1.02]"
              : "border-border hover:border-brand-yellow/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrag}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center">
              <UploadIcon className="h-8 w-8 text-brand-yellow" />
            </div>
            <div>
              <p className="font-semibold">Trascina qui il tuo video o clicca per selezionare</p>
              <p className="text-sm text-muted-foreground mt-1">
                Formati supportati: MP4, MOV, AVI, WEBM (max 2GB)
              </p>
            </div>
          </label>
        </div>

        {videoFile && (
          <div className="mt-4 p-4 bg-card rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileVideo className="h-8 w-8 text-brand-yellow" />
                <div>
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVideoFile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Titolo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inserisci un titolo accattivante"
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/100 caratteri</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descrizione</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi il tuo video (opzionale)"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoria *</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-brand-yellow text-black"
                      : "bg-card hover:bg-accent text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tag</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Separa i tag con virgole (es. arte, musica, live)"
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {thumbnail ? (
                <img src={thumbnail} alt="Thumbnail" className="max-h-32 mx-auto rounded" />
              ) : (
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground">
                Seleziona un'immagine per la copertina o lascia vuoto per generarla automaticamente
              </p>
              <input type="file" accept="image/*" className="mt-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Privacy</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPrivacy("PUBLIC")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  privacy === "PUBLIC"
                    ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                    : "border-border hover:border-brand-yellow/50"
                }`}
              >
                <Globe className="h-4 w-4" />
                Pubblico
              </button>
              <button
                type="button"
                onClick={() => setPrivacy("UNLISTED")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  privacy === "UNLISTED"
                    ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                    : "border-border hover:border-brand-yellow/50"
                }`}
              >
                <Users className="h-4 w-4" />
                Non in elenco
              </button>
              <button
                type="button"
                onClick={() => setPrivacy("PRIVATE")}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  privacy === "PRIVATE"
                    ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                    : "border-border hover:border-brand-yellow/50"
                }}`}
              >
                <Lock className="h-4 w-4" />
                Privato
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>Annulla</Button>
          <Button className="bg-brand-yellow hover:bg-brand-gold-hover text-black font-semibold">
            Carica Video
          </Button>
        </div>
      </div>
    </div>
  );
}
