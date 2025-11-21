"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Meal {
  time: string;
  name: string;
  items: string[];
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

export default function CreateDietPage() {
  const router = useRouter();
  const [dietName, setDietName] = useState("");
  const [dietDescription, setDietDescription] = useState("");
  const [calorieGoal, setCalorieGoal] = useState(2200);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [carbsGoal, setCarbsGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(80);
  const [meals, setMeals] = useState<Meal[]>([
    { time: "07:00", name: "Café da Manhã", items: [""], calories: 0 }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const mealTemplates = [
    { time: "07:00", name: "Café da Manhã" },
    { time: "10:00", name: "Lanche da Manhã" },
    { time: "12:00", name: "Almoço" },
    { time: "15:00", name: "Lanche da Tarde" },
    { time: "19:00", name: "Jantar" },
    { time: "21:00", name: "Ceia" }
  ];

  const addMeal = () => {
    const nextMeal = mealTemplates.find(template =>
      !meals.some(meal => meal.time === template.time)
    ) || { time: "12:00", name: "Refeição" };

    setMeals([...meals, {
      time: nextMeal.time,
      name: nextMeal.name,
      items: [""],
      calories: 0
    }]);
  };

  const removeMeal = (index: number) => {
    if (meals.length > 1) {
      setMeals(meals.filter((_, i) => i !== index));
    }
  };

  const updateMeal = (index: number, field: keyof Meal, value: any) => {
    const updatedMeals = meals.map((meal, i) =>
      i === index ? { ...meal, [field]: value } : meal
    );
    setMeals(updatedMeals);
  };

  const addFoodItem = (mealIndex: number) => {
    const updatedMeals = meals.map((meal, i) =>
      i === mealIndex ? { ...meal, items: [...meal.items, ""] } : meal
    );
    setMeals(updatedMeals);
  };

  const updateFoodItem = (mealIndex: number, itemIndex: number, value: string) => {
    const updatedMeals = meals.map((meal, i) =>
      i === mealIndex ? {
        ...meal,
        items: meal.items.map((item, j) => j === itemIndex ? value : item)
      } : meal
    );
    setMeals(updatedMeals);
  };

  const removeFoodItem = (mealIndex: number, itemIndex: number) => {
    const updatedMeals = meals.map((meal, i) =>
      i === mealIndex ? {
        ...meal,
        items: meal.items.filter((_, j) => j !== itemIndex)
      } : meal
    );
    setMeals(updatedMeals);
  };

  const handleSave = async () => {
    // Validate form
    if (!dietName.trim()) {
      toast.error("Por favor, insira um nome para a dieta");
      return;
    }

    if (meals.some(meal => !meal.name.trim() || meal.items.some(item => !item.trim()))) {
      toast.error("Por favor, preencha todos os campos das refeições");
      return;
    }

    setIsSaving(true);

    try {
      const dietData = {
        name: dietName,
        description: dietDescription,
        goals: {
          calories: calorieGoal,
          protein: proteinGoal,
          carbs: carbsGoal,
          fat: fatGoal
        },
        meals
      };

      const { error } = await supabase
        .from('diets')
        .insert([dietData]);

      if (error) throw error;

      toast.success("Dieta criada com sucesso!");
      router.push("/diet");
    } catch (error) {
      console.error('Error saving diet:', error);
      toast.error("Erro ao salvar dieta. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

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
            Criar Nova Dieta
          </h1>
          <p className="text-muted-foreground mt-2">
            Planeje suas refeições com metas nutricionais personalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Diet Details */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detalhes da Dieta</CardTitle>
                <CardDescription>
                  Informações básicas sobre o plano alimentar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Dieta</Label>
                  <Input
                    id="name"
                    value={dietName}
                    onChange={(e) => setDietName(e.target.value)}
                    placeholder="Ex: Dieta de Definição"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={dietDescription}
                    onChange={(e) => setDietDescription(e.target.value)}
                    placeholder="Descreva os objetivos da dieta..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Metas Nutricionais</CardTitle>
                <CardDescription>
                  Defina suas metas diárias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Calorias (kcal)</Label>
                  <Input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Proteína (g)</Label>
                  <Input
                    type="number"
                    value={proteinGoal}
                    onChange={(e) => setProteinGoal(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Carboidratos (g)</Label>
                  <Input
                    type="number"
                    value={carbsGoal}
                    onChange={(e) => setCarbsGoal(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Gordura (g)</Label>
                  <Input
                    type="number"
                    value={fatGoal}
                    onChange={(e) => setFatGoal(parseInt(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meals */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Refeições
                  <Button onClick={addMeal} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Refeição
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure as refeições do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {meals.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {meal.time}
                        </Badge>
                        {meals.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeal(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Nome da Refeição</Label>
                          <Input
                            value={meal.name}
                            onChange={(e) => updateMeal(index, "name", e.target.value)}
                            placeholder="Ex: Café da Manhã"
                          />
                        </div>

                        <div>
                          <Label>Calorias Estimadas</Label>
                          <Input
                            type="number"
                            value={meal.calories}
                            onChange={(e) => updateMeal(index, "calories", parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Food Items */}
                      <div className="space-y-2 mb-4">
                        <Label className="flex items-center justify-between">
                          Alimentos
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addFoodItem(index)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </Label>
                        {meal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem(index, itemIndex, e.target.value)}
                              placeholder="Ex: Aveia com frutas"
                            />
                            {meal.items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFoodItem(index, itemIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Nutritional Info */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Proteína (g)</Label>
                          <Input
                            type="number"
                            value={meal.protein || ""}
                            onChange={(e) => updateMeal(index, "protein", parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Carboidratos (g)</Label>
                          <Input
                            type="number"
                            value={meal.carbs || ""}
                            onChange={(e) => updateMeal(index, "carbs", parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Gordura (g)</Label>
                          <Input
                            type="number"
                            value={meal.fat || ""}
                            onChange={(e) => updateMeal(index, "fat", parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Notas (opcional)</Label>
                        <Textarea
                          value={meal.notes || ""}
                          onChange={(e) => updateMeal(index, "notes", e.target.value)}
                          placeholder="Instruções de preparo, dicas..."
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Resumo Nutricional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalCalories}</p>
                    <p className="text-sm text-muted-foreground">Calorias</p>
                    <p className="text-xs text-muted-foreground">Meta: {calorieGoal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalProtein}g</p>
                    <p className="text-sm text-muted-foreground">Proteína</p>
                    <p className="text-xs text-muted-foreground">Meta: {proteinGoal}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalCarbs}g</p>
                    <p className="text-sm text-muted-foreground">Carboidratos</p>
                    <p className="text-xs text-muted-foreground">Meta: {carbsGoal}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalFat}g</p>
                    <p className="text-sm text-muted-foreground">Gordura</p>
                    <p className="text-xs text-muted-foreground">Meta: {fatGoal}g</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Salvando..." : "Salvar Dieta"}
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/diet")}>
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