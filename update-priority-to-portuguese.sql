-- Script para atualizar prioridades de inglês para português
-- Execute este script no Supabase SQL Editor

-- Atualizar todas as tarefas existentes
UPDATE tasks 
SET priority = CASE 
  WHEN priority = 'high' THEN 'Alta'
  WHEN priority = 'medium' THEN 'Média' 
  WHEN priority = 'low' THEN 'Baixa'
  ELSE priority
END;

-- Verificar se a atualização foi bem-sucedida
SELECT priority, COUNT(*) as count 
FROM tasks 
GROUP BY priority 
ORDER BY priority;
