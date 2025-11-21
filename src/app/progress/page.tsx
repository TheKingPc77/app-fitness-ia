"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Upload,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Image as ImageIcon,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProgressPage() {
  // Mock data
  const measurements = {
    weight: { current: 75.2, previous: 76.8, change: -1.6 },
    bodyFat: { current: 18.5, previous: 19.2, change: -0.7 },
    chest: { current: 95, previous: 94, change: 1 },
    waist: { current: 82, previous: 84, change: -2 },
    arms: { current: 32, previous: 31, change: 1 },
    legs: { current: 58, previous: 57, change: 1 },
  };

  const progressPhotos = [
    {
      id: 1,
      date: "2024-01-01",
      front: "/placeholder-front.jpg",
      side: "/placeholder-side.jpg",
      back: "/placeholder-back.jpg",
    },
    {
      id: 2,
      date: "2024-01-15",
      front: "/placeholder-front.jpg",
      side: "/placeholder-side.jpg",
      back: "/placeholder-back.jpg",
    },
  ];

  const aiAnalysis = [
    "Parabéns! Você perdeu 1.6kg desde a última medição.",
    "Sua circunferência da cintura diminuiu 2cm - ótimo trabalho!",
    "A gordura corporal está diminuindo consistentemente.",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Acompanhamento de Progresso
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore sua evolução com fotos e medições corporais
          </p>
        </div>

        {/* Análise da IA */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Análise da IA
            </CardTitle>
            <CardDescription>
              Insights inteligentes sobre seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAnalysis.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{analysis}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medições Corporais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Medições Corporais
            </CardTitle>
            <CardDescription>
              Última atualização: 15 Jan 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(measurements).map(([key, data]) => (
                <div key={key} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key}</h4>
                    <div className="flex items-center gap-1">
                      {data.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : data.change < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        data.change > 0 ? "text-green-500" :
                        data.change < 0 ? "text-red-500" : "text-gray-500"
                      }`}>
                        {data.change > 0 ? "+" : ""}{data.change}{key === "weight" ? "kg" : "cm"}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{data.current}{key === "weight" ? "kg" : "cm"}</div>
                  <p className="text-xs text-muted-foreground">
                    Anterior: {data.previous}{key === "weight" ? "kg" : "cm"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button>
                <Camera className="h-4 w-4 mr-2" />
                Atualizar Medições
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Fotos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Adicionar Fotos de Progresso
            </CardTitle>
            <CardDescription>
              Tire fotos frontal, lateral e posterior para acompanhar mudanças
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="front-photo" className="cursor-pointer">
                  <span className="text-sm font-medium">Foto Frontal</span>
                  <Input id="front-photo" type="file" accept="image/*" className="hidden" />
                </Label>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="side-photo" className="cursor-pointer">
                  <span className="text-sm font-medium">Foto Lateral</span>
                  <Input id="side-photo" type="file" accept="image/*" className="hidden" />
                </Label>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="back-photo" className="cursor-pointer">
                  <span className="text-sm font-medium">Foto Posterior</span>
                  <Input id="back-photo" type="file" accept="image/*" className="hidden" />
                </Label>
              </div>
            </div>

            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Salvar Fotos de Progresso
            </Button>
          </CardContent>
        </Card>

        {/* Galeria de Progresso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Galeria de Progresso
            </CardTitle>
            <CardDescription>
              Compare suas fotos ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{photo.date}</h4>
                    <Button variant="outline" size="sm">
                      Comparar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground ml-2">Frontal</span>
                    </div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground ml-2">Lateral</span>
                    </div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground ml-2">Posterior</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}