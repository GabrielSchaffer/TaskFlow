-- Script para corrigir prioridades passo a passo
-- Execute este script no Supabase SQL Editor

-- PASSO 1: Primeiro, vamos ver quais valores existem atualmente
SELECT priority, COUNT(*) as count 
FROM tasks 
GROUP BY priority 
ORDER BY priority;

-- PASSO 2: Remover temporariamente a constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;

-- PASSO 3: Atualizar todas as tarefas existentes
UPDATE tasks 
SET priority = CASE 
  WHEN priority = 'high' THEN 'Alta'
  WHEN priority = 'medium' THEN 'Média' 
  WHEN priority = 'low' THEN 'Baixa'
  ELSE priority
END;

-- PASSO 4: Verificar se a atualização foi bem-sucedida
SELECT priority, COUNT(*) as count 
FROM tasks 
GROUP BY priority 
ORDER BY priority;

-- PASSO 5: Criar nova constraint com valores em português
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
CHECK (priority IN ('Alta', 'Média', 'Baixa'));

-- PASSO 6: Verificar se a constraint foi criada corretamente
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'tasks'::regclass;
