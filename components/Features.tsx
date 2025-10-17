import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Compass, Calendar } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const FEATURES: Feature[] = [
  {
    id: "confort",
    title: "Confort & Charme",
    description:
      "Un chalet authentique alliant le charme du bois et le confort moderne",
    Icon: Heart,
  },
  {
    id: "activites",
    title: "Proche des activités",
    description:
      "Ski, randonnées, lacs... Toutes les activités du Jura à portée de main",
    Icon: Compass,
  },
  {
    id: "reservation",
    title: "Réservation facile",
    description:
      "Disponibilités en temps réel et réservation simple et sécurisée",
    Icon: Calendar,
  },
];

export default function ChaletFeatures() {
  return (
    <section className="bg-[#efe9e0] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4">Le chalet en bref</h2>
        <p className="text-emerald-700/80 mb-12">Découvrez un lieu d'exception où authenticité rime avec modernité</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.id} className="rounded-2xl shadow-sm">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-700/40 flex items-center justify-center mb-4">
                  <f.Icon className="w-7 h-7 text-emerald-700" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">{f.title}</h3>
                <p className="text-emerald-700/80">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
