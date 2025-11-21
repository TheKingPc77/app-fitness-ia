"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressData {
  date: string;
  weight?: number;
  calories?: number;
  workouts?: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  type: "weight" | "calories" | "workouts";
  title: string;
  description?: string;
}

export function ProgressChart({ data, type, title, description }: ProgressChartProps) {
  const getValue = (item: ProgressData) => {
    switch (type) {
      case "weight":
        return item.weight || 0;
      case "calories":
        return item.calories || 0;
      case "workouts":
        return item.workouts || 0;
      default:
        return 0;
    }
  };

  const values = data.map(getValue);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const firstValue = values[0] || 0;
  const lastValue = values[values.length - 1] || 0;
  const trend = lastValue - firstValue;
  const trendPercentage = firstValue !== 0 ? ((trend / firstValue) * 100).toFixed(1) : "0";

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  const getColor = () => {
    switch (type) {
      case "weight":
        return trend < 0 ? "bg-green-500" : "bg-orange-500";
      case "calories":
        return "bg-orange-500";
      case "workouts":
        return "bg-blue-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {trend !== 0 && (
              <>
                {trend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend > 0 ? "text-orange-500" : "text-green-500"
                  }`}
                >
                  {trend > 0 ? "+" : ""}
                  {trendPercentage}%
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const value = getValue(item);
            const height = getBarHeight(value);
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="relative group flex-1 w-full flex items-end">
                  <div
                    className={`w-full ${getColor()} rounded-t-lg transition-all hover:opacity-80 cursor-pointer`}
                    style={{ height: "100%" }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value.toFixed(1)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Inicial</p>
            <p className="text-lg font-bold">{firstValue.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Atual</p>
            <p className="text-lg font-bold">{lastValue.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Variação</p>
            <p className={`text-lg font-bold ${trend > 0 ? "text-orange-500" : "text-green-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
