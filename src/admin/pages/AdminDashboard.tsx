
import React from 'react';
import { useAdminQuestions } from '../hooks/useAdminQuestions';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Folder, TrendingUp, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { questions } = useAdminQuestions();
  const { categories } = useCategories();

  const stats = [
    {
      title: 'Fragen gesamt',
      value: questions.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Kategorien',
      value: categories?.length || 0,
      icon: Folder,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Signal-Fragen',
      value: questions.filter(q => q.category === 'Signale').length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Betriebsdienst-Fragen',
      value: questions.filter(q => q.category === 'Betriebsdienst').length,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Übersicht über das LokLernen CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Neueste Fragen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm truncate max-w-xs">
                      {typeof question.text === 'string' ? question.text : 'Strukturierte Frage'}
                    </p>
                    <p className="text-xs text-gray-500">{question.sub_category}</p>
                  </div>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${question.category === 'Signale' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {question.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schnellaktionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/questions/create"
                className="block p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#3F00FF] hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium">Neue Frage erstellen</p>
                  <p className="text-sm text-gray-500">Füge eine neue Frage hinzu</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
