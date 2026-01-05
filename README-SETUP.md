# Configuração do Sistema OPERADOR

## Visão Geral

O **Sistema OPERADOR** é uma aplicação web completa de prática deliberada sob atrito controlado, desenvolvida com tecnologias modernas e arquitetura full-stack. A aplicação foi configurada com sucesso e está totalmente funcional.

## Arquitetura Técnica

A aplicação utiliza uma stack moderna e robusta composta por:

**Frontend:**
- React 19.2.1 com TypeScript 5.9.3
- Vite 7.1.9 como bundler e dev server
- TailwindCSS 4.1.14 para estilização
- Radix UI para componentes acessíveis
- tRPC 11.6.0 para comunicação type-safe com backend
- React Query para gerenciamento de estado

**Backend:**
- Express 4.21.2 como servidor HTTP
- tRPC 11.6.0 para API type-safe
- Drizzle ORM 0.44.6 para acesso ao banco de dados
- MySQL 8.0.44 como banco de dados
- JWT (via jose 6.1.0) para autenticação (desativada por padrão)
- bcrypt 6.0.0 para hashing de senhas

**DevOps:**
- pnpm 10.4.1 como gerenciador de pacotes
- tsx 4.20.6 para execução de TypeScript em desenvolvimento
- Vitest 2.1.9 para testes

## Estrutura do Banco de Dados

O sistema possui 8 tabelas principais criadas e configuradas:

| Tabela | Descrição |
|--------|-----------|
| **users** | Armazena dados dos usuários (email, senha hasheada, role) |
| **sessions** | Gerencia tokens JWT para autenticação |
| **missions** | Contém as 4 missões operacionais do sistema |
| **daily_progress** | Tracking binário diário (FEITO/NÃO FEITO) |
| **weekly_review** | Revisões semanais com reset automático |
| **guides** | Mini-ebooks organizados por camadas |
| **ai_interactions** | Histórico de conversas com agentes de IA |
| **autonomy_tracking** | Métricas de autonomia do usuário |

## Configuração Realizada

### 1. Ambiente de Desenvolvimento

Foi criado um arquivo `.env` com as seguintes configurações:

```env
DATABASE_URL=mysql://root:password@localhost:3306/operador_db
JWT_SECRET=operador-secret-key-change-in-production
VITE_APP_ID=operador-app
NODE_ENV=development
```

### 2. Banco de Dados MySQL

O MySQL 8.0.44 foi instalado e configurado:
- Serviço iniciado e rodando
- Banco de dados `operador_db` criado com charset UTF-8
- Usuário root configurado com senha `password`
- Todas as 8 tabelas criadas via Drizzle ORM

### 3. Dependências

Todas as 756 dependências foram instaladas com sucesso via pnpm, incluindo:
- Bibliotecas de UI (Radix UI, Framer Motion, Recharts)
- Ferramentas de desenvolvimento (TypeScript, ESBuild, Vite)
- Pacotes de backend (Express, Drizzle, MySQL2)

### 4. Scripts de Build

Os scripts de build necessários foram aprovados:
- `@tailwindcss/oxide` - Compilador do TailwindCSS
- `bcrypt` - Módulo nativo para hashing
- `esbuild` - Bundler de alta performance

## Como Usar

### Iniciar o Servidor de Desenvolvimento

```bash
cd /home/ubuntu/operador-app
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### Executar Testes

```bash
cd /home/ubuntu/operador-app
pnpm test
```

**Status dos Testes:** ✅ 13 testes passando (2 arquivos)

### Build para Produção

```bash
cd /home/ubuntu/operador-app
pnpm build
```

Isso irá:
1. Compilar o frontend com Vite
2. Fazer bundle do backend com esbuild
3. Gerar arquivos otimizados na pasta `dist/`

### Iniciar em Produção

```bash
cd /home/ubuntu/operador-app
pnpm start
```

### Gerenciar Banco de Dados

```bash
# Gerar e aplicar migrations
cd /home/ubuntu/operador-app
pnpm db:push

# Acessar MySQL diretamente
mysql -u root -ppassword operador_db
```

## Funcionalidades Implementadas

### 1. Dashboard Principal
- Visualização de missões completas (0 de 4)
- Status da missão atual
- Indicador de estado mental (Frustração - Semana 1)

### 2. Ritual Diário Simples
Sistema de 3 fases para prática diária:
- **Fase 1: CORTE** (5 min) - Eliminar distrações
- **Fase 2: AÇÃO** (15 min) - Executar ação mínima
- **Fase 3: REGISTRO** (1 min) - Documentar resultado

### 3. Sistema O.P.E.R.A.D.O.R
Mapa completo das 8 fases do sistema:
- **O**bservar - Identificar padrões sem julgamento
- **P**osicionar - Definir decisão objetiva
- **E**struturar - Simplificar em ação mínima
- **R**otina - Estabelecer repetição com atrito
- **A**justar - Escutar feedback frio
- **D**esacelerar - Confrontar fuga
- **O**perar - Definir critério binário
- **R**evisar - Preparar autonomia

### 4. Biblioteca de Guias
Mini-ebooks organizados por 5 camadas:
- Ilusão
- Clareza
- Padrão
- Escape
- Autonomia

### 5. Agentes de IA
4 agentes especializados:
- **Clareza** - Confronta autoengano
- **Decisão** - Força escolha objetiva
- **Execução** - Simplifica ação
- **Corte** - Elimina distrações

### 6. Autonomia e Saída
Sistema de tracking para detectar quando o usuário está pronto para operar sozinho.

## Design e Filosofia

O sistema adota um **design brutalist minimalista**:
- Fundo preto com texto branco
- Bordas brancas nos elementos
- Zero ornamentação
- Comunicação direta e confrontadora
- Sem acolhimento emocional

**Princípios do Sistema:**
1. Ação antes de explicação
2. Desconforto é parte do método
3. Pouco conteúdo, muita repetição
4. Sem acolhimento emocional
5. Feedback rápido e frio
6. Autonomia como objetivo final

## Status Atual

✅ **Aplicação 100% funcional**
- Frontend carregando corretamente
- Backend respondendo
- Banco de dados configurado
- Navegação entre páginas funcionando
- Testes passando (13/13)
- Interface brutalist renderizando

## Próximos Passos (Opcional)

Para produção, considere:

1. **Segurança:**
   - Alterar `JWT_SECRET` para valor criptograficamente seguro
   - Configurar CORS adequadamente
   - Implementar rate limiting

2. **Performance:**
   - Configurar cache de queries
   - Otimizar imagens e assets
   - Implementar CDN

3. **Monitoramento:**
   - Adicionar logging estruturado
   - Implementar métricas de performance
   - Configurar alertas

4. **Deploy:**
   - Configurar CI/CD
   - Preparar Docker containers
   - Configurar backup do banco de dados

## Comandos Úteis

```bash
# Verificar tipo TypeScript
pnpm check

# Formatar código
pnpm format

# Limpar e reinstalar dependências
rm -rf node_modules pnpm-lock.yaml && pnpm install

# Resetar banco de dados
mysql -u root -ppassword -e "DROP DATABASE operador_db; CREATE DATABASE operador_db;"
pnpm drizzle-kit push
```

## Suporte

Para questões técnicas, consulte:
- Documentação do Drizzle ORM: https://orm.drizzle.team
- Documentação do tRPC: https://trpc.io
- Documentação do Vite: https://vitejs.dev

---

**Sistema configurado e validado em:** 04 de Janeiro de 2026
**Status:** ✅ Pronto para uso
