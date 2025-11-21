"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Target, Dumbbell, Heart, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const quizSchema = z.object({
  goal: z.string().min(1, "Selecione um objetivo"),
  experience: z.string().min(1, "Selecione seu nível"),
  problems: z.array(z.string()).min(1, "Selecione pelo menos um problema"),
  activity: z.string().min(1, "Selecione seu nível de atividade"),
  diet: z.string().min(1, "Selecione seu hábito alimentar"),
  age: z.string().min(1, "Digite sua idade"),
  weight: z.string().min(1, "Digite seu peso"),
  height: z.string().min(1, "Digite sua altura"),
  name: z.string().min(2, "Digite seu nome"),
  email: z.string().email("Email inválido"),
  additionalInfo: z.string().optional(),
});

type QuizData = z.infer<typeof quizSchema>;

const questions = [
  {
    id: "goal",
    title: "Qual é seu objetivo principal?",
    description: "Nos ajude a personalizar sua experiência",
    type: "radio",
    options: [
      { value: "lose_weight", label: "Perder peso", icon: Target },
      { value: "gain_muscle", label: "Ganhar massa muscular", icon: Dumbbell },
      { value: "improve_health", label: "Melhorar saúde geral", icon: Heart },
      { value: "increase_endurance", label: "Aumentar resistência", icon: Clock },
    ],
  },
  {
    id: "experience",
    title: "Qual seu nível de experiência com exercícios?",
    description: "Isso nos ajuda a ajustar a intensidade",
    type: "radio",
    options: [
      { value: "beginner", label: "Iniciante", description: "Nunca ou pouco treino" },
      { value: "intermediate", label: "Intermediário", description: "Treino regular há alguns meses" },
      { value: "advanced", label: "Avançado", description: "Treino intenso há anos" },
    ],
  },
  {
    id: "problems",
    title: "Quais problemas você enfrenta atualmente?",
    description: "Selecione todos que se aplicam",
    type: "checkbox",
    options: [
      { value: "back_pain", label: "Dor nas costas" },
      { value: "knee_pain", label: "Dor nos joelhos" },
      { value: "shoulder_pain", label: "Dor nos ombros" },
      { value: "lack_motivation", label: "Falta de motivação" },
      { value: "time_management", label: "Dificuldade para gerenciar tempo" },
      { value: "nutrition_confusion", label: "Confusão com nutrição" },
      { value: "injury_recovery", label: "Recuperação de lesão" },
      { value: "stress", label: "Estresse alto" },
    ],
  },
  {
    id: "activity",
    title: "Qual seu nível atual de atividade física?",
    description: "Dias por semana que você se exercita",
    type: "radio",
    options: [
      { value: "sedentary", label: "Sedentário", description: "Pouco ou nenhum exercício" },
      { value: "light", label: "Leve", description: "1-2 dias por semana" },
      { value: "moderate", label: "Moderado", description: "3-4 dias por semana" },
      { value: "active", label: "Ativo", description: "5+ dias por semana" },
    ],
  },
  {
    id: "diet",
    title: "Como descreveria seus hábitos alimentares?",
    description: "Seja honesto para melhores resultados",
    type: "radio",
    options: [
      { value: "poor", label: "Ruins", description: "Fast food, processados" },
      { value: "fair", label: "Regulares", description: "Algumas refeições saudáveis" },
      { value: "good", label: "Boa", description: "Maioria das refeições saudáveis" },
      { value: "excellent", label: "Excelente", description: "Dieta balanceada e consistente" },
    ],
  },
  {
    id: "personal",
    title: "Dados pessoais básicos",
    description: "Para personalizar seu plano",
    type: "form",
    fields: [
      { name: "name", label: "Nome completo", type: "text", placeholder: "Seu nome" },
      { name: "email", label: "Email", type: "email", placeholder: "seu@email.com" },
      { name: "age", label: "Idade", type: "number", placeholder: "25" },
      { name: "weight", label: "Peso (kg)", type: "number", placeholder: "70" },
      { name: "height", label: "Altura (cm)", type: "number", placeholder: "170" },
    ],
  },
  {
    id: "additional",
    title: "Informações adicionais",
    description: "Conte-nos mais sobre suas necessidades específicas",
    type: "textarea",
    placeholder: "Ex: Tenho alergia a lactose, prefiro treinos em casa, etc.",
  },
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizData>>({ problems: [] });
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<QuizData>({
    resolver: zodResolver(quizSchema),
  });

  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: QuizData) => {
    try {
      // Aqui seria a integração com Supabase
      console.log("Dados do quiz:", data);
      
      // Simular salvamento
      localStorage.setItem("quizData", JSON.stringify(data));
      
      // Redirecionar para checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            Quiz de Onboarding
          </h1>
          <p className="text-center text-muted-foreground">
            Vamos conhecer suas necessidades para criar o plano perfeito
          </p>
        </motion.div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Passo {currentStep + 1} de {questions.length}</span>
                <span>{Math.round(progress)}% completo</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentQuestion.title}
                </CardTitle>
                <CardDescription>
                  {currentQuestion.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentQuestion.type === "radio" && (
                  <RadioGroup
                    value={answers[currentQuestion.id as keyof QuizData] as string}
                    onValueChange={(value) => {
                      setAnswers({ ...answers, [currentQuestion.id]: value });
                      setValue(currentQuestion.id as keyof QuizData, value);
                    }}
                    className="space-y-3"
                  >
                    {currentQuestion.options?.map((option) => {
                      const Icon = option.icon || Target;
                      return (
                        <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                          <Label
                            htmlFor={option.value}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            {option.icon && <Icon className="h-5 w-5 text-primary flex-shrink-0" />}
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-muted-foreground">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <input
                          type="checkbox"
                          id={option.value}
                          checked={(answers.problems || []).includes(option.value)}
                          onChange={(e) => {
                            const currentProblems = answers.problems || [];
                            const newProblems = e.target.checked
                              ? [...currentProblems, option.value]
                              : currentProblems.filter(p => p !== option.value);
                            setAnswers({ ...answers, problems: newProblems });
                            setValue("problems", newProblems);
                          }}
                          className="rounded border-gray-300 h-4 w-4"
                        />
                        <Label htmlFor={option.value} className="cursor-pointer flex-1 font-medium">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "form" && (
                  <div className="space-y-4">
                    {currentQuestion.fields?.map((field) => (
                      <div key={field.name}>
                        <Label htmlFor={field.name} className="font-medium">{field.label}</Label>
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          {...register(field.name as keyof QuizData)}
                          className="mt-1"
                        />
                        {errors[field.name as keyof QuizData] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[field.name as keyof QuizData]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "textarea" && (
                  <div>
                    <Textarea
                      placeholder={currentQuestion.placeholder}
                      {...register("additionalInfo")}
                      className="min-h-[120px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="hover:scale-105 transition-transform"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentStep === questions.length - 1 ? (
            <Button onClick={handleSubmit(onSubmit)} className="hover:scale-105 transition-transform">
              Finalizar Quiz
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="hover:scale-105 transition-transform">
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
