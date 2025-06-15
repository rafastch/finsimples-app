
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  isDefault: boolean;
}

export const useCategories = () => {
  const { user } = useAuth();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
      }

      return data.map(category => ({
        id: category.id,
        name: category.name,
        type: category.type as "income" | "expense",
        isDefault: category.is_default,
      }));
    },
    enabled: !!user,
  });

  const getCategories = (type: "income" | "expense") => {
    return categories.filter(category => category.type === type);
  };

  return {
    categories,
    isLoading,
    getCategories,
  };
};
