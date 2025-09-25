-- Adicionar campo 'color_theme' na tabela user_settings
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS color_theme VARCHAR(50) DEFAULT 'blue-purple';

-- Atualizar configurações existentes para ter o campo color_theme
UPDATE user_settings 
SET color_theme = 'blue-purple' 
WHERE color_theme IS NULL;
