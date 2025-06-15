
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  isRecurring?: boolean;
  frequency?: "weekly" | "monthly" | "yearly";
  endDate?: string;
  installmentInfo?: {
    totalInstallments: number;
    currentInstallment: number;
  };
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Erro ao buscar transações:", error);
        throw error;
      }

      return data.map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        amount: Number(transaction.amount),
        type: transaction.type as "income" | "expense",
        category: transaction.category,
        date: transaction.date,
        isRecurring: transaction.is_recurring,
        frequency: transaction.frequency as "weekly" | "monthly" | "yearly",
        endDate: transaction.end_date,
        installmentInfo: transaction.installment_info as any,
      }));
    },
    enabled: !!user,
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData: Transaction & { installments?: number }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { installments, ...baseTransaction } = transactionData;

      // Se tem parcelamento, criar múltiplas transações
      if (installments && installments > 1) {
        const transactions = [];
        const baseAmount = baseTransaction.amount / installments;
        
        for (let i = 1; i <= installments; i++) {
          const installmentDate = new Date(baseTransaction.date);
          installmentDate.setMonth(installmentDate.getMonth() + (i - 1));
          
          transactions.push({
            user_id: user.id,
            description: `${baseTransaction.description} - Parcela ${i} de ${installments}`,
            amount: baseAmount,
            type: baseTransaction.type,
            category: baseTransaction.category,
            date: installmentDate.toISOString().split('T')[0],
            is_recurring: false,
            installment_info: {
              totalInstallments: installments,
              currentInstallment: i,
            },
          });
        }

        const { error } = await supabase
          .from("transactions")
          .insert(transactions);

        if (error) throw error;
      } else {
        // Transação única ou recorrente
        const { error } = await supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            description: baseTransaction.description,
            amount: baseTransaction.amount,
            type: baseTransaction.type,
            category: baseTransaction.category,
            date: baseTransaction.date,
            is_recurring: baseTransaction.isRecurring,
            frequency: baseTransaction.frequency,
            end_date: baseTransaction.endDate,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Transação salva!",
        description: "A transação foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao salvar transação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction: createTransactionMutation.mutate,
    isCreating: createTransactionMutation.isPending,
  };
};
