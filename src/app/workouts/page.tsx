"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Clock,
  Target,
  Play,
  CheckCircle,
  Calendar,
  Zap,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ExerciseModal } from "@/components/exercise-modal";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Workout {
  id: string;
  name: string;
  description: string;
  target_muscle: string;
  difficulty: string;
  exercises: any[];
  created_at: string;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data with video URLs and instructions
  const currentWorkout = {
    name: "Treino Superior A",
    exercises: [
      {
        name: "Supino Reto",
        sets: 4,
        reps: "8-10",
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Mock video URL
        instructions: "Deite-se no banco, segure a barra com as mãos afastadas na largura dos ombros. Desça lentamente até o peito e empurre para cima."
      },
      {
        name: "Remada Curvada",
        sets: 4,
        reps: "8-10",
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", // Mock video URL
        instructions: "Incline-se para frente mantendo as costas retas. Puxe a barra em direção ao abdômen contraindo as costas."
      },
      {
        name: "Desenvolvimento",
        sets: 3,
        reps: "10-12",
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", // Mock video URL
        instructions: "Sente-se no banco, segure os halteres na altura dos ombros. Empurre os pesos para cima até os braços ficarem estendidos."
      },
      {
        name: "Rosca Direta",
        sets: 3,
        reps: "10-12",
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4", // Mock video URL
        instructions: "Segure a barra com as palmas das mãos voltadas para cima. Flexione os cotovelos levantando a barra até os bíceps."
      },
      {
        name: "Tríceps Corda",
        sets: 3,
        reps: "12-15",
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4", // Mock video URL
        instructions: "Segure a corda do pulley com as duas mãos. Estenda os braços para baixo separando as pontas da corda."
      },
      {
        name: "Elevação Lateral",
        sets: 3,
        reps: "12-15",
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_30mb.mp4", // Mock video URL
        instructions: "Segure halteres nas laterais do corpo. Levante os braços lateralmente até a altura dos ombros."
      },
    ],
    duration: 45,
    progress: 33,
  };

  const weeklyPlan = [
    { day: "Segunda", workout: "Superior A", completed: true },
    { day: "Terça", workout: "Inferior", completed: true },
    { day: "Quarta", workout: "Superior B", completed: false },
    { day: "Quinta", workout: "Inferior", completed: false },
    { day: "Sexta", workout: "Superior A", completed: false },
    { day: "Sábado", workout: "Cardio", completed: false },
    { day: "Domingo", workout: "Descanso", completed: false },
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCompleteExercise = () => {
    // Update exercise completion status
    // In a real app, this would update the database
    console.log(`Exercise ${selectedExercise.name} completed`);
  };

  const handleCreateWorkout = () => {
    router.push("/workouts/create");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando treinos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Treinos Personalizados
            </h1>
            <p className="text-muted-foreground mt-2">
              Seus treinos criados pela IA com base nos seus objetivos
            </p>
          </div>
          <Button onClick={handleCreateWorkout}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Treino
          </Button>
        </div>

        {/* Treinos Criados */}
        {workouts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Seus Treinos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{workout.name}</span>
                      <Badge variant="outline">{workout.difficulty}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {workout.target_muscle} • {workout.exercises?.length || 0} exercícios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {workout.description}
                    </p>
                    <Button className="w-full" onClick={() => {
                      // Navigate to workout detail or start workout
                      toast.info("Funcionalidade em desenvolvimento");
                    }}>
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Treino
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Treino Atual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              {currentWorkout.name}
            </CardTitle>
            <CardDescription>
              {currentWorkout.exercises.length} exercícios • {currentWorkout.duration} minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso do treino</span>
                <span>{currentWorkout.progress}%</span>
              </div>
              <Progress value={currentWorkout.progress} />
            </div>

            <div className="space-y-3 mb-6">
              {currentWorkout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {exercise.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} séries • {exercise.reps} repetições
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={exercise.completed ? "secondary" : "default"}
                    onClick={() => handleStartExercise(exercise)}
                  >
                    {exercise.completed ? "Refazer" : "Iniciar"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Continuar Treino
              </Button>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Ajustar com IA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plano Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Plano Semanal
            </CardTitle>
            <CardDescription>
              Sua rotina de treinos personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyPlan.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    day.completed
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="text-center">
                    <p className="font-medium text-sm">{day.day}</p>
                    <p className="text-xs text-muted-foreground mt-1">{day.workout}</p>
                    {day.completed && (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <ExerciseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          exercise={selectedExercise}
          onComplete={handleCompleteExercise}
        />
      )}
    </div>
  );
}