import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TransactionForm from "@/components/TransactionForm";
import GoalsPanel from "@/components/GoalsPanel";
import ImportData from "@/components/ImportData";
import UserMenu from "@/components/UserMenu";
import CategoryManager from "@/components/CategoryManager";
import TransactionsList from "@/components/TransactionsList";
import ReportsPanel from "@/components/ReportsPanel";
import DashboardCharts from "@/components/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";
import { Filter } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const { transactions } = useTransactions();

  // Calcular totais baseado no período selecionado
  const calculateTotals = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (selectedPeriod) {
        case "current-month":
          return transactionDate.getFullYear() === currentYear && 
                 transactionDate.getMonth() === currentMonth;
        case "last-6-months":
          const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
          return transactionDate >= sixMonthsAgo;
        case "current-year":
          return transactionDate.getFullYear() === currentYear;
        case "all":
        default:
          return true;
      }
    });

    let totalReceitas = 0;
    let totalDespesas = 0;
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalReceitas += transaction.amount;
      } else {
        totalDespesas += transaction.amount;
      }
    });
    
    return { totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas };
  };

  const totals = calculateTotals();

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "current-month": return "Mês Atual";
      case "last-6-months": return "Últimos 6 Meses";
      case "current-year": return "Ano Atual";
      default: return "Todos os Períodos";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "transactions":
        return <TransactionForm />;
      case "goals":
        return <GoalsPanel />;
      case "import":
        return <ImportData />;
      case "settings":
        return <CategoryManager />;
      case "reports":
        return <ReportsPanel />;
      default:
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <UserMenu />
            </div>

            {/* Filtro de Período - Versão Compacta */}
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">Período:</span>
                <div className="w-48">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="h-8 text-sm border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Mês Atual</SelectItem>
                      <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
                      <SelectItem value="current-year">Ano Atual</SelectItem>
                      <SelectItem value="all">Todos os Períodos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Cards de totais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Receitas - {getPeriodLabel()}
                </h3>
                <p className="text-2xl font-bold text-green-600 mt-2">R$ {totals.totalReceitas.toFixed(2)}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Despesas - {getPeriodLabel()}
                </h3>
                <p className="text-2xl font-bold text-red-600 mt-2">R$ {totals.totalDespesas.toFixed(2)}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Saldo - {getPeriodLabel()}
                </h3>
                <p className={`text-2xl font-bold mt-2 ${totals.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {totals.saldo.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Economia</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">R$ 820,00</p>
                <p className="text-xs text-gray-500 mt-1">Meta mensal</p>
              </div>
            </div>

            {/* Gráficos do Dashboard */}
            <div className="mb-8">
              <DashboardCharts selectedPeriod={selectedPeriod} />
            </div>

            {/* Lista de Transações */}
            <div className="mb-8">
              <TransactionsList selectedPeriod={selectedPeriod} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Bem-vindo ao FinSimples!</h2>
              <p className="text-gray-600 mb-4">
                Seu controle financeiro pessoal e familiar em um só lugar. 
                Comece adicionando suas primeiras transações ou importando dados de uma planilha.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab("transactions")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Transação
                </button>
                <button 
                  onClick={() => setActiveTab("import")}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Importar Planilha
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
