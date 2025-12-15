"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "./components/theme-toggle";

export default function ZustandDemoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-gray-900">
          Zustand + Next.js App Router
        </h1>
        <p className="text-gray-600 mb-8">
          Demostración de estado global con tres stores: Tema, Contador y Usuario
        </p>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              🎨 Store de Tema
            </h2>
            <ThemeToggle />
          </div>

          {/* Botón para ir a Demo 2 */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push("/zustand-demo2")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
            >
              Ir a Demo 2 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}