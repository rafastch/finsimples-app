
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, Plus, Upload, Users, Calendar } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TransactionForm from "@/components/TransactionForm";
import ImportData from "@/components/ImportData";
import GoalsPanel from "@/components/GoalsPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showImportData, setShowImportData] = useState(false);
  const { toast } = useToast();

  // Mock data - seria substituído por dados reais
  const monthlyData = {
    totalIncome: 5400.00,
    totalExpenses: 3850.00,
    balance: 1550.00,
    savingsGoal: 2000.00,
    savingsProgress: 77.5
  };

  const recentTransactions = [
    { id: 1, description: "Salário", amount: 5400.00, type: "income", date: "2024-12-01", category: "Trabalho" },
    { id: 2, description: "Supermercado", amount: -320.50, type: "expense", date: "2024-12-14", category: "Alimentação" },
    { id: 3, description: "Conta de Luz", amount: -185.30, type: "expense", date: "2024-12-13", category: "Casa" },
    { id: 4, description: "Freelance", amount: 800.00, type: "income", date: "2024-12-12", category: "Trabalho" },
  ];

  const handleAddTransaction = () => {
    setShowTransactionForm(true);
  };

  const handleImportData = () => {
    setShowImportData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Olá! Bem-vindo ao FinSimples
                </h1>
                <p className="text-xl text-gray-600">
                  Sua gestão financeira simplificada e inteligente
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleImportData} variant="outline" size="lg" className="flex items-center gap-2">
                  <Upload size={20} />
                  Importar Dados
                </Button>
                <Button onClick={handleAddTransaction} size="lg" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus size={20} />
                  Nova Transação
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard" className="space-y-6">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                    <TrendingUp className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {monthlyData.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                    <TrendingDown className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {monthlyData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                    <DollarSign className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {monthlyData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta de Economia</CardTitle>
                    <Target className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{monthlyData.savingsProgress.toFixed(1)}%</div>
                    <Progress value={monthlyData.savingsProgress} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Transações Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Transações Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimas movimentações da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionForm />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsPanel />
            </TabsContent>

            <TabsContent value="import">
              <ImportData />
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        {showTransactionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TransactionForm onClose={() => setShowTransactionForm(false)} />
            </div>
          </div>
        )}

        {showImportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <ImportData onClose={() => setShowImportData(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
