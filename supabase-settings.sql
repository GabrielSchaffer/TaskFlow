-- Configurações do Supabase para desabilitar verificação de email
-- Execute este script no editor SQL do Supabase

-- IMPORTANTE: Para desabilitar verificação de email, você DEVE fazer isso no Dashboard:
-- 1. Vá em Authentication > Settings
-- 2. Desmarque "Enable email confirmations"
-- 3. Clique em "Save"

-- Criar função para inserir configurações padrão do usuário
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir configurações padrão quando um usuário é criado
  INSERT INTO user_settings (user_id, theme, default_view)
  VALUES (NEW.id, 'light', 'kanban');
  
  -- Inserir categorias padrão
  INSERT INTO categories (name, color, user_id) VALUES
  ('Trabalho', '#2196f3', NEW.id),
  ('Pessoal', '#4caf50', NEW.id),
  ('Estudo', '#ff9800', NEW.id),
  ('Saúde', '#f44336', NEW.id),
  ('Lazer', '#9c27b0', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();
