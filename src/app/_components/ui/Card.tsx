import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string | number;
  sections: Section[];
  highlightColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sections,
  highlightColor = "#1677ff",
}) => {
  return (
    <div className="w-full h-full">
      <Card className="h-full border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-50 border-b border-gray-100 pb-4">
          <CardTitle style={{ color: highlightColor }} className="text-lg m-0 font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">
            {value}
          </h3>

          <div className="flex-1 flex flex-col gap-4">
            {sections.map((section, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Separator />}
                <section>
                  <h4 className="font-semibold text-sm mb-2 text-slate-700">{section.title}</h4>
                  <div className="text-sm text-slate-600">
                    {section.content}
                  </div>
                </section>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCard;
