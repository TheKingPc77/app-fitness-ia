"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, Check, RotateCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function CameraCapture({ onCapture, onClose, title, description }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Permissão negada. Por favor, permita o acesso à câmera nas configurações do navegador.");
        } else if (err.name === "NotFoundError") {
          setError("Nenhuma câmera encontrada no dispositivo.");
        } else {
          setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
      }
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  }, [capturedImage, onCapture, onClose]);

  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [stopCamera]);

  // Iniciar câmera automaticamente
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || "Capturar Foto"}</DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Foto capturada"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex gap-3 justify-center">
            {!capturedImage ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                  className="h-12 w-12"
                  disabled={!!error}
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={capturePhoto}
                  className="h-12 px-8"
                  disabled={!!error || !stream}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capturar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="h-12 px-6"
                >
                  <X className="h-5 w-5 mr-2" />
                  Refazer
                </Button>
                <Button
                  onClick={confirmPhoto}
                  className="h-12 px-6"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Confirmar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
