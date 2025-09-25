-- Script para corrigir a constraint de prioridade no banco de dados
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos ver as constraints atuais da tabela tasks
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'tasks'::regclass;

-- Remover a constraint antiga (se existir)
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;

-- Criar nova constraint com valores em português
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
CHECK (priority IN ('Alta', 'Média', 'Baixa'));

-- Verificar se a constraint foi criada corretamente
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'tasks'::regclass;
