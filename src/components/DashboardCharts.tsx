
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, Filter } from "lucide-react";

interface DashboardChartsProps {
  selectedPeriod: string;
}

const DashboardCharts = ({ selectedPeriod }: DashboardChartsProps) => {
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Carregando gráficos...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar transações baseado no período selecionado
  const getFilteredTransactions = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return transactions.filter(transaction => {
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
  };

  const filteredTransactions = getFilteredTransactions();

  // Processar dados para gráfico de pizza (categorias de despesa)
  const expensesByCategory = () => {
    const categoryData = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
      }
    });
    
    return Object.entries(categoryData).map(([category, value]) => ({
      name: category,
      value: Number(value),
    }));
  };

  // Processar dados para gráfico de barras
  const monthlyComparison = () => {
    const monthlyData = {};
    
    if (selectedPeriod === "current-month") {
      // Para mês atual, mostrar por semanas
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      for (let week = 1; week <= 4; week++) {
        const weekKey = `Sem ${week}`;
        monthlyData[weekKey] = { month: weekKey, receitas: 0, despesas: 0 };
      }
      
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dayOfMonth = date.getDate();
        const weekNumber = Math.ceil(dayOfMonth / 7);
        const weekKey = `Sem ${weekNumber}`;
        
        if (monthlyData[weekKey]) {
          if (transaction.type === 'income') {
            monthlyData[weekKey].receitas += transaction.amount;
          } else {
            monthlyData[weekKey].despesas += transaction.amount;
          }
        }
      });
    } else {
      // Para outros períodos, mostrar por meses
      const currentDate = new Date();
      const monthsToShow = selectedPeriod === "last-6-months" ? 6 : 12;
      
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        monthlyData[monthKey] = { month: monthKey, receitas: 0, despesas: 0 };
      }
      
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        
        if (monthlyData[monthKey]) {
          if (transaction.type === 'income') {
            monthlyData[monthKey].receitas += transaction.amount;
          } else {
            monthlyData[monthKey].despesas += transaction.amount;
          }
        }
      });
    }
    
    return Object.values(monthlyData);
  };

  const expensesData = expensesByCategory();
  const monthlyData = monthlyComparison();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "current-month": return "Mês Atual";
      case "last-6-months": return "Últimos 6 Meses";
      case "current-year": return "Ano Atual";
      default: return "Todos os Períodos";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza - Despesas por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Despesas por Categoria ({getPeriodLabel()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expensesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma despesa no período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Evolução */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução - {getPeriodLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, '']} />
              <Legend />
              <Bar dataKey="receitas" fill="#16a34a" name="Receitas" />
              <Bar dataKey="despesas" fill="#dc2626" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
