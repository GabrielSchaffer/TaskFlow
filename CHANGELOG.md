# 📝 Changelog - TaskFlow

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.2.0] - 2024-12-19

### ✨ Novidades

- **Checkbox de Concluído no Kanban**: Implementado checkbox para marcar tarefas como concluídas diretamente no Kanban
- **Animações de Celebração**: Adicionadas animações de confetti e fogos de artifício ao completar tarefas
- **Atualizações Otimistas**: Interface agora responde instantaneamente às ações do usuário

### 🔧 Melhorias

- **Editor de Descrição**: Corrigido problema do cursor que voltava para o início durante a digitação
- **Experiência do Usuário**: Melhorada consistência entre as visualizações Kanban e "Meu Dia"
- **Performance**: Implementadas atualizações otimistas para melhor responsividade

### 🐛 Correções

- Corrigido comportamento do cursor no RichTextEditor
- Resolvido conflito entre dangerouslySetInnerHTML e posicionamento do cursor
- Melhorada sincronização entre estado local e banco de dados

## [1.1.0] - 2024-12-18

### ✨ Novidades

- **Sistema de Categorias**: Criação e gerenciamento de categorias personalizadas
- **Tema Claro/Escuro**: Alternância entre temas claro e escuro
- **Visualização Calendário**: Nova visualização em formato de calendário
- **Drag & Drop**: Sistema completo de arrastar e soltar no Kanban

### 🔧 Melhorias

- **Interface Responsiva**: Melhorada responsividade em dispositivos móveis
- **Navegação**: Adicionada sidebar com navegação intuitiva
- **Dashboard**: Implementado dashboard com métricas de produtividade

## [1.0.0] - 2024-12-17

### 🎉 Lançamento Inicial

- **Sistema de Autenticação**: Login e cadastro com Supabase
- **Gerenciamento de Tarefas**: Criação, edição e exclusão de tarefas
- **Visualização Kanban**: Interface drag & drop para organização de tarefas
- **Sistema de Prioridades**: Tarefas com níveis de prioridade (Alta, Média, Baixa)
- **Datas de Vencimento**: Sistema completo de datas e alertas
- **Tarefas Importantes**: Marcação de tarefas como importantes
- **Status de Tarefas**: Sistema de status (A Fazer, Em Andamento, Concluída)

---

## 📋 Próximas Funcionalidades

### 🔮 Roadmap

- [ ] **Notificações Push**: Alertas para tarefas próximas do vencimento
- [ ] **Relatórios**: Geração de relatórios de produtividade
- [ ] **Integração com Calendário**: Sincronização com Google Calendar
- [ ] **Templates de Tarefas**: Criação de templates para tarefas recorrentes
- [ ] **Colaboração**: Compartilhamento de tarefas entre usuários
- [ ] **API REST**: Endpoints para integração com outras aplicações
- [ ] **Modo Offline**: Funcionalidade offline com sincronização
- [ ] **Temas Personalizados**: Criação de temas customizados
- [ ] **Atalhos de Teclado**: Navegação rápida com teclado
- [ ] **Exportação**: Exportação de tarefas para PDF/Excel

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### 📝 Padrões de Commit

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

---

**Desenvolvido com ❤️ usando React + TypeScript + Material UI + Supabase**
