"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Apple,
  Clock,
  Target,
  Play,
  CheckCircle,
  Calendar,
  Zap,
  Plus,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Diet {
  id: string;
  name: string;
  description: string;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: any[];
  created_at: string;
}

export default function DietPage() {
  const router = useRouter();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for current diet
  const currentDiet = {
    name: "Dieta de Definição",
    meals: [
      {
        time: "07:00",
        name: "Café da Manhã",
        items: ["Aveia com frutas", "Iogurte grego"],
        calories: 350,
        completed: true
      },
      {
        time: "10:00",
        name: "Lanche da Manhã",
        items: ["Maçã", "Nozes"],
        calories: 200,
        completed: true
      },
      {
        time: "12:00",
        name: "Almoço",
        items: ["Frango grelhado", "Arroz integral", "Salada"],
        calories: 500,
        completed: false
      },
      {
        time: "15:00",
        name: "Lanche da Tarde",
        items: ["Whey protein", "Banana"],
        calories: 250,
        completed: false
      },
      {
        time: "19:00",
        name: "Jantar",
        items: ["Peixe", "Batata doce", "Brócolis"],
        calories: 450,
        completed: false
      },
    ],
    goals: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70
    },
    progress: 40,
  };

  useEffect(() => {
    loadDiets();
  }, []);

  const loadDiets = async () => {
    try {
      const { data, error } = await supabase
        .from('diets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiets(data || []);
    } catch (error) {
      console.error('Error loading diets:', error);
      toast.error('Erro ao carregar dietas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiet = () => {
    router.push("/diet/create");
  };

  const totalCalories = currentDiet.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedMeals = currentDiet.meals.filter(meal => meal.completed).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando dietas...</div>
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
              Dietas Personalizadas
            </h1>
            <p className="text-muted-foreground mt-2">
              Suas dietas criadas com base nos seus objetivos nutricionais
            </p>
          </div>
          <Button onClick={handleCreateDiet}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Dieta
          </Button>
        </div>

        {/* Dietas Criadas */}
        {diets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Suas Dietas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diets.map((diet) => (
                <Card key={diet.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{diet.name}</span>
                      <Badge variant="outline">
                        <Flame className="h-3 w-3 mr-1" />
                        {diet.goals?.calories || 0} kcal
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {diet.meals?.length || 0} refeições • Meta diária
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {diet.description}
                    </p>
                    <Button className="w-full" onClick={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}>
                      <Play className="h-4 w-4 mr-2" />
                      Seguir Dieta
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dieta Atual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              {currentDiet.name}
            </CardTitle>
            <CardDescription>
              {currentDiet.meals.length} refeições • {totalCalories} / {currentDiet.goals.calories} kcal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso do dia</span>
                <span>{currentDiet.progress}%</span>
              </div>
              <Progress value={currentDiet.progress} />
            </div>

            <div className="space-y-3 mb-6">
              {currentDiet.meals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {meal.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {meal.time} • {meal.calories} kcal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {meal.items.join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={meal.completed ? "secondary" : "default"}
                    onClick={() => {
                      toast.info("Funcionalidade em desenvolvimento");
                    }}
                  >
                    {meal.completed ? "Refazer" : "Marcar"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Continuar Dieta
              </Button>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Ajustar com IA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metas Nutricionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas Nutricionais do Dia
            </CardTitle>
            <CardDescription>
              Acompanhe seu progresso nutricional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalCalories}</p>
                <p className="text-sm text-muted-foreground">Calorias</p>
                <p className="text-xs text-muted-foreground">Meta: {currentDiet.goals.calories}</p>
                <Progress value={(totalCalories / currentDiet.goals.calories) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">120g</p>
                <p className="text-sm text-muted-foreground">Proteína</p>
                <p className="text-xs text-muted-foreground">Meta: {currentDiet.goals.protein}g</p>
                <Progress value={(120 / currentDiet.goals.protein) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">180g</p>
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <p className="text-xs text-muted-foreground">Meta: {currentDiet.goals.carbs}g</p>
                <Progress value={(180 / currentDiet.goals.carbs) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">65g</p>
                <p className="text-sm text-muted-foreground">Gordura</p>
                <p className="text-xs text-muted-foreground">Meta: {currentDiet.goals.fat}g</p>
                <Progress value={(65 / currentDiet.goals.fat) * 100} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}