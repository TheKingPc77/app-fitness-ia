"use client";

import { useRouter } from "next/navigation";
import { Dumbbell, Apple, MessageCircle, TrendingUp } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleStartWorkout = () => {
    router.push("/workouts");
  };

  const handleStartDiet = () => {
    router.push("/diet");
  };

  const handleChatWithAI = () => {
    alert("Chat com IA em breve! 🤖");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">FitTracker Pro</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Transforme seu corpo,
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              conquiste seus objetivos
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Gerencie treinos, dietas e acompanhe seu progresso com inteligência
            artificial
          </p>
        </div>

        {/* Cards de Ação */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* Card Treinos */}
          <button
            onClick={handleStartWorkout}
            className="group bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 text-left"
          >
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Dumbbell className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Treinos</h3>
            <p className="text-gray-400 mb-4">
              Crie e gerencie seus treinos personalizados
            </p>
            <div className="text-purple-400 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Começar agora
              <span>→</span>
            </div>
          </button>

          {/* Card Dieta */}
          <button
            onClick={handleStartDiet}
            className="group bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 text-left"
          >
            <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
              <Apple className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Dieta</h3>
            <p className="text-gray-400 mb-4">
              Planeje suas refeições e monitore calorias
            </p>
            <div className="text-green-400 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Planejar dieta
              <span>→</span>
            </div>
          </button>

          {/* Card Chat IA */}
          <button
            onClick={handleChatWithAI}
            className="group bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 text-left"
          >
            <div className="bg-cyan-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
              <MessageCircle className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Chat IA</h3>
            <p className="text-gray-400 mb-4">
              Converse com seu assistente fitness pessoal
            </p>
            <div className="text-cyan-400 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Iniciar conversa
              <span>→</span>
            </div>
          </button>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">
              Seu progresso hoje
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-gray-400 text-sm">Treinos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-gray-400 text-sm">Calorias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-gray-400 text-sm">Dias ativos</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
