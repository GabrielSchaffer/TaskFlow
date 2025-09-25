-- Adicionar campo 'important' na tabela tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS important BOOLEAN DEFAULT FALSE;

-- Criar índice para melhor performance nas consultas de tarefas importantes
CREATE INDEX IF NOT EXISTS idx_tasks_important ON tasks(important);

-- Atualizar tarefas existentes para ter o campo important como false por padrão
UPDATE tasks 
SET important = FALSE 
WHERE important IS NULL;
