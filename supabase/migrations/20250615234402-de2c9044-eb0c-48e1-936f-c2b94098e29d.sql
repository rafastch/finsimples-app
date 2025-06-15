
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios perfis
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Política para usuários criarem seus próprios perfis
CREATE POLICY "Users can create own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seus próprios perfis
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Função para criar automaticamente o perfil quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
