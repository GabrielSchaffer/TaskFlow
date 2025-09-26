# TaskFlow - Gerenciador de Tarefas Diárias

Sistema completo de gerenciamento de tarefas diárias com interface moderna e funcionalidades avançadas.

## 🆕 Novidades e Melhorias

### ✨ Últimas Atualizações

- **✅ Checkbox de Concluído no Kanban**: Agora você pode marcar tarefas como concluídas diretamente no Kanban com um clique no checkbox
- **🔧 Editor de Descrição Melhorado**: Corrigido problema do cursor que voltava para o início durante a digitação
- **🎉 Animações de Celebração**: Confetti e fogos de artifício quando você completa uma tarefa
- **⚡ Atualizações Otimistas**: Interface responde instantaneamente às suas ações

### 🚀 Funcionalidades

### ✨ Principais Recursos

- **Dashboard Inteligente**: Visão geral das tarefas do dia com métricas de produtividade
- **Duas Visualizações**: Kanban (drag & drop) e Calendário
- **Autenticação Segura**: Login e cadastro com Supabase
- **Tarefas Inteligentes**: Movimento automático para o próximo dia com aumento de prioridade
- **Categorias Personalizáveis**: Crie e gerencie suas próprias categorias
- **Tema Claro/Escuro**: Interface adaptável às suas preferências
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

### 🎯 Funcionalidades Avançadas

- **Prioridades Dinâmicas**: Tarefas não concluídas aumentam automaticamente de prioridade
- **Drag & Drop**: Reorganize tarefas facilmente no Kanban
- **Filtros Inteligentes**: Visualize tarefas por data, prioridade e status
- **Alertas Visuais**: Destaque para tarefas urgentes e atrasadas
- **Tempo Real**: Atualizações instantâneas com Supabase

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Material UI
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Drag & Drop**: React Beautiful DnD
- **Calendário**: MUI X Date Pickers
- **Estilização**: Material UI + Emotion

## 📦 Instalação

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no Supabase

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd TaskFlow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

3. Configure as variáveis de ambiente no `.env.local`:

```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configure o banco de dados

1. **Execute o script principal**:

   - Copie e cole todo o conteúdo do arquivo `database-setup.sql` no editor SQL do Supabase
   - Clique em **"Run"** para executar

2. **Execute as configurações adicionais**:

   - Copie e cole todo o conteúdo do arquivo `supabase-settings.sql` no editor SQL do Supabase
   - Clique em **"Run"** para executar

3. **Execute as configurações de perfil**:

   - Copie e cole todo o conteúdo do arquivo `user-profile-setup.sql` no editor SQL do Supabase
   - Clique em **"Run"** para executar

4. **Desabilitar verificação de email** (IMPORTANTE):
   - No Dashboard do Supabase, vá em **Authentication > Settings**
   - Na seção **"Auth"**, desmarque **"Enable email confirmations"**
   - Clique em **"Save"** para salvar as configurações

```sql
-- Criar tabela de tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT CHECK (priority IN ('Alta', 'Média', 'low')) NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de configurações do usuário
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT CHECK (theme IN ('light', 'dark')) DEFAULT 'light',
  default_view TEXT CHECK (default_view IN ('kanban', 'calendar')) DEFAULT 'kanban',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para user_settings
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Execute o projeto

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 🎨 Como Usar

### 1. **Primeiro Acesso**

- Crie uma conta ou faça login
- Configure suas categorias nas configurações
- Personalize o tema e visualização padrão

### 2. **Gerenciando Tarefas**

- Clique em "Nova Tarefa" para criar uma tarefa
- Defina título, descrição, data de vencimento, prioridade e categoria
- Use o Kanban para arrastar tarefas entre status
- Use o calendário para visualizar tarefas por data

### 3. **Funcionalidades Inteligentes**

- Tarefas não concluídas são movidas automaticamente para o próximo dia
- A prioridade aumenta automaticamente quando movidas
- Alertas visuais para tarefas urgentes e atrasadas

### 4. **Personalização**

- Crie categorias personalizadas com cores
- Alterne entre tema claro e escuro
- Escolha entre visualização Kanban ou Calendário

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejecta do Create React App

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:

- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify

1. Build do projeto: `npm run build`
2. Faça upload da pasta `build`
3. Configure as variáveis de ambiente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se o banco de dados foi configurado corretamente
4. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ usando React + TypeScript + Material UI + Supabase**
