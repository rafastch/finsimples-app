
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Receitas</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">R$ 5.420,00</p>
                <p className="text-xs text-gray-500 mt-1">+12% vs mês anterior</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Despesas</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">R$ 3.890,00</p>
                <p className="text-xs text-gray-500 mt-1">+5% vs mês anterior</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Saldo</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">R$ 1.530,00</p>
                <p className="text-xs text-gray-500 mt-1">Meta: R$ 2.000,00</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Economia</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">R$ 820,00</p>
                <p className="text-xs text-gray-500 mt-1">76% da meta</p>
              </div>
            </div>

            {/* Gráficos do Dashboard */}
            <div className="mb-8">
              <DashboardCharts />
            </div>

            {/* Lista de Transações */}
            <div className="mb-8">
              <TransactionsList />
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
