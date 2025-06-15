
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Download,
  X,
  FileText,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportDataProps {
  onClose?: () => void;
}

const ImportData = ({ onClose }: ImportDataProps) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState({
    date: "",
    description: "",
    amount: "",
    category: ""
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock de colunas disponíveis na planilha
  const availableColumns = [
    "Data",
    "Descrição", 
    "Valor",
    "Categoria",
    "Tipo",
    "Conta",
    "Observações"
  ];

  // Mock de dados de preview
  const mockPreviewData = [
    { "Data": "2024-12-01", "Descrição": "Supermercado", "Valor": "-320.50", "Categoria": "Alimentação" },
    { "Data": "2024-12-02", "Descrição": "Salário", "Valor": "5400.00", "Categoria": "Trabalho" },
    { "Data": "2024-12-03", "Descrição": "Conta de Luz", "Valor": "-185.30", "Categoria": "Casa" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setPreviewData(mockPreviewData); // Em produção, faria o parse real do arquivo
        setStep(2);
        
        toast({
          title: "Arquivo carregado!",
          description: `${selectedFile.name} foi carregado com sucesso.`,
        });
      } else {
        toast({
          title: "Formato inválido",
          description: "Apenas arquivos Excel (.xlsx, .xls) ou CSV são aceitos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = () => {
    if (!mapping.date || !mapping.description || !mapping.amount) {
      toast({
        title: "Mapeamento incompleto",
        description: "Mapeie pelo menos Data, Descrição e Valor.",
        variant: "destructive",
      });
      return;
    }

    setImportStatus('importing');
    setStep(3);
    
    // Simular progresso de importação
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setImportStatus('success');
        
        toast({
          title: "Importação concluída!",
          description: `${previewData.length} transações foram importadas com sucesso.`,
        });
      }
    }, 200);
  };

  const downloadTemplate = () => {
    // Simular download de template
    toast({
      title: "Template baixado!",
      description: "O arquivo modelo foi baixado para Downloads.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Upload className="h-6 w-6 text-blue-600" />
                Importar Dados Financeiros
              </CardTitle>
              <CardDescription>
                Importe suas transações de planilhas Excel ou CSV
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <CheckCircle size={16} /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Etapa 1: Upload do Arquivo */}
          {step === 1 && (
            <div className="space-y-6">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Faça upload de uma planilha Excel (.xlsx, .xls) ou arquivo CSV com suas transações financeiras.
                </AlertDescription>
              </Alert>

              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione seu arquivo
                </h3>
                <p className="text-gray-600 mb-4">
                  Ou arraste e solte aqui
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload size={16} className="mr-2" />
                  Escolher Arquivo
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download size={16} className="mr-2" />
                  Baixar Modelo
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 2: Mapeamento de Colunas */}
          {step === 2 && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Mapeie as colunas da sua planilha com os campos do sistema. 
                  Data, Descrição e Valor são obrigatórios.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Mapeamento de Colunas</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Data * <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      </Label>
                      <Select value={mapping.date} onValueChange={(value) => setMapping({...mapping, date: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de data" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((col) => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Descrição * <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      </Label>
                      <Select value={mapping.description} onValueChange={(value) => setMapping({...mapping, description: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de descrição" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((col) => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Valor * <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      </Label>
                      <Select value={mapping.amount} onValueChange={(value) => setMapping({...mapping, amount: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de valor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColumns.map((col) => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Categoria <Badge variant="secondary" className="text-xs">Opcional</Badge>
                      </Label>
                      <Select value={mapping.category} onValueChange={(value) => setMapping({...mapping, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a coluna de categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhuma</SelectItem>
                          {availableColumns.map((col) => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Preview dos Dados</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <p className="text-sm font-medium">
                        {previewData.length} transações encontradas
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {previewData.slice(0, 5).map((row, index) => (
                        <div key={index} className="p-3 border-b last:border-b-0 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Data:</span>
                            <span>{row.Data}</span>
                            <span className="font-medium">Descrição:</span>
                            <span>{row.Descrição}</span>
                            <span className="font-medium">Valor:</span>
                            <span className={parseFloat(row.Valor) >= 0 ? 'text-green-600' : 'text-red-600'}>
                              R$ {Math.abs(parseFloat(row.Valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700">
                  Importar Dados
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 3: Progresso da Importação */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              {importStatus === 'importing' && (
                <>
                  <div className="flex items-center justify-center">
                    <Upload className="h-12 w-12 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-medium">Importando dados...</h3>
                  <Progress value={importProgress} className="w-full max-w-md mx-auto" />
                  <p className="text-gray-600">
                    {importProgress}% concluído - Processando transações
                  </p>
                </>
              )}

              {importStatus === 'success' && (
                <>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">Importação Concluída!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      <strong>{previewData.length} transações</strong> foram importadas com sucesso
                    </p>
                    <p className="text-gray-600">
                      Os dados já estão disponíveis no seu dashboard
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center pt-6">
                    <Button variant="outline" onClick={() => {
                      setStep(1);
                      setFile(null);
                      setImportProgress(0);
                      setImportStatus('idle');
                    }}>
                      Nova Importação
                    </Button>
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                      Ir para Dashboard
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportData;
