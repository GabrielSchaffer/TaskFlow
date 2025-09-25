#!/bin/bash

echo "🚀 Configurando TaskFlow..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo "📝 Criando arquivo de configuração..."
    cp env.example .env.local
    echo "⚠️  IMPORTANTE: Configure as variáveis de ambiente no arquivo .env.local"
    echo "   - REACT_APP_SUPABASE_URL=sua_url_do_supabase"
    echo "   - REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase"
    echo ""
    echo "📋 Execute o script database-setup.sql no editor SQL do Supabase"
    echo "   antes de iniciar o projeto."
else
    echo "✅ Arquivo .env.local já existe"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no arquivo .env.local"
echo "2. Execute o script database-setup.sql no Supabase"
echo "3. Execute 'npm start' para iniciar o projeto"
echo ""
echo "📖 Para mais informações, consulte o README.md"
