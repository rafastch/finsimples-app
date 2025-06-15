
-- Criar tabela de transações
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  date date NOT NULL,
  is_recurring boolean DEFAULT false,
  frequency text CHECK (frequency IN ('weekly', 'monthly', 'yearly')),
  end_date date,
  installment_info jsonb, -- Para armazenar informações de parcelamento
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar tabela de categorias personalizadas
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, name, type)
);

-- Habilitar RLS para as transações
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para transações
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Habilitar RLS para as categorias
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias
CREATE POLICY "Users can view their own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Inserir categorias padrão para novos usuários
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Categorias padrão de despesa
  INSERT INTO public.categories (user_id, name, type, is_default) VALUES
    (NEW.id, 'Alimentação', 'expense', true),
    (NEW.id, 'Transporte', 'expense', true),
    (NEW.id, 'Casa', 'expense', true),
    (NEW.id, 'Saúde', 'expense', true),
    (NEW.id, 'Educação', 'expense', true),
    (NEW.id, 'Lazer', 'expense', true),
    (NEW.id, 'Roupas', 'expense', true),
    (NEW.id, 'Outros', 'expense', true);
  
  -- Categorias padrão de receita
  INSERT INTO public.categories (user_id, name, type, is_default) VALUES
    (NEW.id, 'Salário', 'income', true),
    (NEW.id, 'Freelance', 'income', true),
    (NEW.id, 'Investimentos', 'income', true),
    (NEW.id, 'Aluguel', 'income', true),
    (NEW.id, 'Outros', 'income', true);
  
  RETURN NEW;
END;
$$;

-- Trigger para criar categorias padrão quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created_categories
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.create_default_categories();
