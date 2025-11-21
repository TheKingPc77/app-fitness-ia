"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, CheckCircle, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    name: string;
    sets: number;
    reps: string;
    videoUrl?: string;
    instructions?: string;
  };
  onComplete: () => void;
}

export function ExerciseModal({ isOpen, onClose, exercise, onComplete }: ExerciseModalProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentSet(1);
      setCompletedSets([]);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCompleteSet = () => {
    if (!completedSets.includes(currentSet)) {
      setCompletedSets([...completedSets, currentSet]);
    }

    if (currentSet < exercise.sets) {
      setCurrentSet(currentSet + 1);
    } else {
      // All sets completed
      onComplete();
      onClose();
    }
  };

  const handleRestart = () => {
    setCurrentSet(1);
    setCompletedSets([]);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const progress = (completedSets.length / exercise.sets) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{exercise.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Siga o vídeo para executar o exercício corretamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Section */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {exercise.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                src={exercise.videoUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-2" />
                  <p>Vídeo em breve</p>
                </div>
              </div>
            )}

            {exercise.videoUrl && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <Button onClick={handlePlayPause} size="lg">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Progresso da Série</h3>
              <Badge variant="outline">
                {completedSets.length} / {exercise.sets} séries
              </Badge>
            </div>
            <Progress value={progress} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: exercise.sets }, (_, i) => i + 1).map((set) => (
                <div
                  key={set}
                  className={`p-3 rounded-lg border-2 ${
                    completedSets.includes(set)
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : set === currentSet
                      ? "border-primary bg-primary/10"
                      : "border-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Série {set}</span>
                    {completedSets.includes(set) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exercise.reps} repetições
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Instruções:</h4>
              <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleCompleteSet} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completar Série {currentSet}
            </Button>
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}