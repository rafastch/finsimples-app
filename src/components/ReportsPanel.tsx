
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/useTransactions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Download, Filter } from "lucide-react";

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

interface CategoryData {
  category: string;
  receitas: number;
  despesas: number;
  type: "income" | "expense";
}

interface TotalsData {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

const ReportsPanel = () => {
  const { transactions, isLoading } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [reportType, setReportType] = useState("monthly");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Carregando relatórios...</div>
      </div>
    );
  }

  // Processar dados para gráficos
  const processMonthlyData = (): MonthlyData[] => {
    const monthlyData: Record<string, MonthlyData> = {};
    const currentYear = parseInt(selectedYear);
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const monthName = new Date(currentYear, month).toLocaleDateString('pt-BR', { month: 'short' });
        
        if (!monthlyData[monthName]) {
          monthlyData[monthName] = { month: monthName, receitas: 0, despesas: 0 };
        }
        
        if (transaction.type === 'income') {
          monthlyData[monthName].receitas += transaction.amount;
        } else {
          monthlyData[monthName].despesas += transaction.amount;
        }
      }
    });
    
    return Object.values(monthlyData);
  };

  // Processar dados por categoria
  const processCategoryData = (): CategoryData[] => {
    const categoryData: Record<string, CategoryData> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const isValidMonth = selectedMonth === "all" || date.getMonth() === parseInt(selectedMonth);
      const isValidYear = date.getFullYear() === parseInt(selectedYear);
      
      if (isValidMonth && isValidYear) {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = { 
            category: transaction.category, 
            receitas: 0, 
            despesas: 0,
            type: transaction.type
          };
        }
        
        if (transaction.type === 'income') {
          categoryData[transaction.category].receitas += transaction.amount;
        } else {
          categoryData[transaction.category].despesas += transaction.amount;
        }
      }
    });
    
    return Object.values(categoryData);
  };

  // Calcular totais
  const calculateTotals = (): TotalsData => {
    let totalReceitas = 0;
    let totalDespesas = 0;
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const isValidMonth = selectedMonth === "all" || date.getMonth() === parseInt(selectedMonth);
      const isValidYear = date.getFullYear() === parseInt(selectedYear);
      
      if (isValidMonth && isValidYear) {
        if (transaction.type === 'income') {
          totalReceitas += transaction.amount;
        } else {
          totalDespesas += transaction.amount;
        }
      }
    });
    
    return { totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas };
  };

  const monthlyData = processMonthlyData();
  const categoryData = processCategoryData();
  const totals = calculateTotals();

  const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
  const months = [
    { value: "all", label: "Todos os meses" },
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="category">Por Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totals.totalReceitas.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totals.totalDespesas.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold ${totals.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {totals.saldo.toFixed(2)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      {reportType === "monthly" && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
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
      )}

      {/* Tabela de categorias */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "monthly" ? "Resumo por Categoria" : "Detalhamento por Categoria"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Despesas</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'income' ? 'default' : 'destructive'}>
                      {item.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    R$ {item.receitas.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    R$ {item.despesas.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {(item.receitas + item.despesas).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPanel;
