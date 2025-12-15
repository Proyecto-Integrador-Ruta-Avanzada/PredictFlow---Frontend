"use client";

import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/theme-store";

export default function ZustandDemo2Page() {
  const router = useRouter();
  const { theme } = useThemeStore();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-gray-900">
          Zustand Demo 2 - Estado Persistente
        </h1>
        <p className="text-gray-600 mb-8">
          Esta página demuestra que el estado de Zustand se mantiene entre rutas
        </p>

        <div className="space-y-6">
          {/* Info de los stores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tema */}
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">🎨 Tema</h3>
              <p className="text-sm text-yellow-800">
                Tema actual: <span className="font-bold text-yellow-600">{theme === "light" ? "🌞 Claro" : "🌙 Oscuro"}</span>
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Cambio el tema en demo1 y se mantiene aquí
              </p>
            </div>

          </div>

          {/* Botones de navegación */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => router.push("/zustand-demo")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              ← Volver a Demo 1
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}