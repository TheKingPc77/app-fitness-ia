"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Check, CreditCard, Star, Zap, Crown, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  plan: z.string().min(1, "Selecione um plano"),
  cardNumber: z.string().min(16, "Número do cartão inválido"),
  expiryDate: z.string().min(5, "Data de validade inválida"),
  cvv: z.string().min(3, "CVV inválido"),
  name: z.string().min(2, "Nome no cartão obrigatório"),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

const plans = [
  {
    id: "basic",
    name: "Básico",
    price: 29.99,
    period: "mês",
    description: "Perfeito para começar",
    features: [
      "Treinos personalizados",
      "Acompanhamento básico",
      "Dicas de nutrição",
      "App mobile",
    ],
    icon: Zap,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    period: "mês",
    description: "Para resultados reais",
    features: [
      "Tudo do Básico",
      "IA personalizada avançada",
      "Consultoria nutricional",
      "Suporte prioritário",
      "Relatórios detalhados",
    ],
    icon: Star,
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 79.99,
    period: "mês",
    description: "Experiência completa",
    features: [
      "Tudo do Premium",
      "Treinador pessoal virtual",
      "Análise de progresso semanal",
      "Receitas personalizadas",
      "Suporte 24/7",
      "Descontos em suplementos",
    ],
    icon: Crown,
    popular: false,
  },
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [quizData, setQuizData] = useState<any>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    // Carregar dados do quiz
    const data = localStorage.getItem("quizData");
    if (data) {
      setQuizData(JSON.parse(data));
      // Sugerir plano baseado nas respostas
      const suggestedPlan = suggestPlan(JSON.parse(data));
      setSelectedPlan(suggestedPlan);
      setValue("plan", suggestedPlan);
    } else {
      router.push("/quiz");
    }
  }, [router, setValue]);

  const suggestPlan = (data: any) => {
    // Lógica simples para sugerir plano
    if (data.experience === "advanced" || data.goal === "gain_muscle") {
      return "elite";
    } else if (data.activity === "moderate" || data.activity === "active") {
      return "premium";
    }
    return "basic";
  };

  const onSubmit = async (data: CheckoutData) => {
    try {
      // Simular processamento do pagamento
      console.log("Processando pagamento:", { ...data, quizData });
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar para dashboard
      router.push("/");
    } catch (error) {
      console.error("Erro no checkout:", error);
    }
  };

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            Escolha seu Plano
          </h1>
          <p className="text-center text-muted-foreground">
            Baseado no seu perfil, recomendamos o plano {selectedPlanData?.name}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Planos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Planos Disponíveis</h2>
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "ring-2 ring-primary border-primary"
                        : "hover:shadow-md"
                    } ${plan.popular ? "relative" : ""}`}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setValue("plan", plan.id);
                    }}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-4 bg-primary">
                        Mais Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {plan.name}
                            <RadioGroupItem value={plan.id} />
                          </CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        R$ {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Formulário de Pagamento */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informações de Pagamento
                </CardTitle>
                <CardDescription>
                  Preencha os dados do seu cartão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber")}
                      className="mt-1"
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Validade</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        {...register("expiryDate")}
                        className="mt-1"
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        {...register("cvv")}
                        className="mt-1"
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Nome no Cartão</Label>
                    <Input
                      id="name"
                      placeholder="João Silva"
                      {...register("name")}
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {selectedPlanData && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Plano {selectedPlanData.name}</span>
                        <span className="font-bold">R$ {selectedPlanData.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Total</span>
                        <span>R$ {selectedPlanData.price}</span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <Shield className="h-4 w-4 mr-2" />
                    Finalizar Compra
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Pagamento seguro processado por nossa plataforma
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}