
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CreateCategoryData {
  name: string;
  type: "income" | "expense";
}

interface UpdateCategoryData {
  id: string;
  name: string;
  type: "income" | "expense";
}

export const useCategoryMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: CreateCategoryData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: categoryData.name,
          type: categoryData.type,
          is_default: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria criada!",
        description: "A categoria foi adicionada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar categoria:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a categoria.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: UpdateCategoryData) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("categories")
        .update({
          name: categoryData.name,
          type: categoryData.type,
        })
        .eq("id", categoryData.id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria atualizada!",
        description: "A categoria foi modificada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Categoria excluída!",
        description: "A categoria foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir categoria:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    },
  });

  return {
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
