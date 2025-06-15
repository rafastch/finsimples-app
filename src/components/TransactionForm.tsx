
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Repeat, X, DollarSign, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  onClose?: () => void;
}

const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: "monthly",
    endDate: ""
  });

  const { toast } = useToast();

  const categories = {
    expense: [
      "Alimentação",
      "Transporte", 
      "Casa",
      "Saúde",
      "Educação",
      "Lazer",
      "Roupas",
      "Outros"
    ],
    income: [
      "Salário",
      "Freelance",
      "Investimentos",
      "Aluguel",
      "Outros"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log("Salvando transação:", formData);
    
    toast({
      title: "Transação salva!",
      description: `${formData.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${formData.amount} foi adicionada com sucesso.`,
    });

    // Reset form
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      frequency: "monthly",
      endDate: ""
    });

    if (onClose) onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
              Nova Transação
            </CardTitle>
            <CardDescription>
              Adicione uma nova receita ou despesa
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transação */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              className={`flex-1 h-12 ${formData.type === "expense" ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              onClick={() => setFormData({...formData, type: "expense", category: ""})}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              className={`flex-1 h-12 ${formData.type === "income" ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-600 hover:bg-green-50"}`}
              onClick={() => setFormData({...formData, type: "income", category: ""})}
            >
              Receita
            </Button>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Descrição *
            </Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário, Conta de luz..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="h-12 text-base"
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Valor (R$) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-medium">
                Data *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <Tag size={16} />
              Categoria *
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type as keyof typeof categories].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transação Recorrente */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat size={18} className="text-blue-600" />
                <Label htmlFor="recurring" className="text-base font-medium">
                  Transação Recorrente
                </Label>
              </div>
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked})}
              />
            </div>
            
            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frequência</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value) => setFormData({...formData, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Final (Opcional)</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
            >
              Salvar Transação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
