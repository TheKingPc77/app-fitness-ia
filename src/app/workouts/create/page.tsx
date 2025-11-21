"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
}

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [targetMuscle, setTargetMuscle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: "10-12", rest: 60 }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const muscleGroups = [
    "Peito", "Costas", "Ombros", "Braços", "Pernas", "Glúteos", "Abdômen", "Cardio", "Full Body"
  ];

  const difficulties = ["Iniciante", "Intermediário", "Avançado"];

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: "10-12", rest: 60 }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updatedExercises);
  };

  const handleSave = async () => {
    // Validate form
    if (!workoutName.trim()) {
      toast.error("Por favor, insira um nome para o treino");
      return;
    }

    if (exercises.some(ex => !ex.name.trim())) {
      toast.error("Por favor, preencha o nome de todos os exercícios");
      return;
    }

    setIsSaving(true);

    try {
      const workoutData = {
        name: workoutName,
        description: workoutDescription,
        target_muscle: targetMuscle,
        difficulty,
        exercises
      };

      const { error } = await supabase
        .from('workouts')
        .insert([workoutData]);

      if (error) throw error;

      toast.success("Treino criado com sucesso!");
      router.push("/workouts");
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error("Erro ao salvar treino. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Criar Novo Treino
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie um treino personalizado com exercícios selecionados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Treino</CardTitle>
                <CardDescription>
                  Informações básicas sobre o treino
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Treino</Label>
                  <Input
                    id="name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Ex: Treino Superior A"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={workoutDescription}
                    onChange={(e) => setWorkoutDescription(e.target.value)}
                    placeholder="Descreva o objetivo do treino..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Grupo Muscular Principal</Label>
                  <Select value={targetMuscle} onValueChange={setTargetMuscle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo muscular" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((muscle) => (
                        <SelectItem key={muscle} value={muscle}>
                          {muscle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dificuldade</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercises */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Exercícios
                  <Button onClick={addExercise} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Exercício
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure os exercícios do treino
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">Exercício {index + 1}</Badge>
                        {exercises.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome do Exercício</Label>
                          <Input
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, "name", e.target.value)}
                            placeholder="Ex: Supino Reto"
                          />
                        </div>

                        <div>
                          <Label>Séries</Label>
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>

                        <div>
                          <Label>Repetições</Label>
                          <Input
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, "reps", e.target.value)}
                            placeholder="Ex: 10-12"
                          />
                        </div>

                        <div>
                          <Label>Descanso (segundos)</Label>
                          <Input
                            type="number"
                            value={exercise.rest}
                            onChange={(e) => updateExercise(index, "rest", parseInt(e.target.value) || 30)}
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Notas (opcional)</Label>
                        <Textarea
                          value={exercise.notes || ""}
                          onChange={(e) => updateExercise(index, "notes", e.target.value)}
                          placeholder="Instruções específicas, dicas..."
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Salvando..." : "Salvar Treino"}
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/workouts")}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}