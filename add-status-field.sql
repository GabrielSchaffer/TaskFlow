-- Script para adicionar campo status na tabela tasks
-- Execute este script no Supabase SQL Editor

-- Verificar se a coluna status já existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'status';

-- Adicionar coluna status se não existir
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'todo';

-- Atualizar constraint para incluir valores válidos de status
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
CHECK (status IN ('todo', 'in_progress', 'completed'));

-- Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'status';
