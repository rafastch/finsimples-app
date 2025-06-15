
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, TrendingUp, Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GoalsPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    category: "",
    deadline: ""
  });

  const { toast } = useToast();

  // Mock data - seria substituído por dados reais
  const goals = [
    {
      id: 1,
      name: "Reserva de Emergência",
      target: 10000,
      current: 3500,
      category: "Economia",
      deadline: "2024-12-31",
      progress: 35
    },
    {
      id: 2,
      name: "Viagem de Férias",
      target: 5000,
      current: 2800,
      category: "Lazer",
      deadline: "2024-07-15",
      progress: 56
    },
    {
      id: 3,
      name: "Curso de Especialização",
      target: 2500,
      current: 1800,
      category: "Educação",
      deadline: "2024-03-30",
      progress: 72
    }
  ];

  const categories = [
    "Economia",
    "Investimento",
    "Lazer",
    "Educação",
    "Casa",
    "Transporte",
    "Saúde",
    "Outros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.target || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log("Nova meta:", formData);
    
    toast({
      title: "Meta criada!",
      description: `Meta "${formData.name}" foi criada com sucesso.`,
    });

    // Reset form
    setFormData({
      name: "",
      target: "",
      category: "",
      deadline: ""
    });
    setShowForm(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (progress: number, deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) {
      return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
    }
    if (daysLeft < 0) {
      return <Badge variant="destructive">Vencida</Badge>;
    }
    if (daysLeft <= 30) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Urgente</Badge>;
    }
    return <Badge variant="outline">Em Progresso</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            Metas Financeiras
          </h2>
          <p className="text-gray-600 mt-2">
            Defina e acompanhe suas metas de economia e investimento
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
        >
          <Plus size={20} className="mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Metas</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Metas Atingidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {goals.filter(g => g.progress >= 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Próximo Vencimento</p>
                <p className="text-2xl font-bold text-gray-900">23 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{goal.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{goal.category}</Badge>
                    {getStatusBadge(goal.progress, goal.deadline)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso: R$ {goal.current.toLocaleString('pt-BR')}</span>
                  <span>Meta: R$ {goal.target.toLocaleString('pt-BR')}</span>
                </div>
                <Progress value={goal.progress} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{goal.progress.toFixed(1)}% concluído</span>
                  <span>Faltam: R$ {(goal.target - goal.current).toLocaleString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Nova Meta */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nova Meta Financeira</CardTitle>
              <CardDescription>
                Defina uma nova meta para acompanhar seu progresso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName">Nome da Meta *</Label>
                  <Input
                    id="goalName"
                    placeholder="Ex: Reserva de emergência"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Valor Alvo (R$) *</Label>
                  <Input
                    id="target"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo Final</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Criar Meta
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoalsPanel;
