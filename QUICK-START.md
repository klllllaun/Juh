# Guia Rápido - Sistema OPERADOR

## Iniciar a Aplicação

### 1. Certifique-se de que o MySQL está rodando

```bash
sudo systemctl status mysql
# Se não estiver rodando:
sudo systemctl start mysql
```

### 2. Inicie o servidor de desenvolvimento

```bash
cd /home/ubuntu/operador-app
pnpm dev
```

O servidor estará disponível em **http://localhost:3000**

## Credenciais do Banco de Dados

```
Host: localhost
Porta: 3306
Usuário: root
Senha: password
Database: operador_db
```

## Estrutura de Pastas

```
operador-app/
├── client/          # Código React (frontend)
├── server/          # Código Express + tRPC (backend)
├── shared/          # Tipos compartilhados
├── drizzle/         # Schema e migrations do banco
├── .env             # Variáveis de ambiente
└── package.json     # Dependências e scripts
```

## Scripts Principais

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento |
| `pnpm build` | Compila para produção |
| `pnpm start` | Inicia em modo produção |
| `pnpm test` | Executa testes |
| `pnpm db:push` | Aplica migrations no banco |

## Páginas Disponíveis

- `/dashboard` - Dashboard principal
- `/ritual-diario` - Ritual Diário Simples (3 fases)
- `/sistema-operador` - Mapa completo O.P.E.R.A.D.O.R
- `/biblioteca` - Biblioteca de guias
- `/agentes` - Agentes de IA
- `/autonomia` - Tracking de autonomia

## Status

✅ Aplicação configurada e funcional  
✅ Banco de dados criado (8 tabelas)  
✅ Testes passando (13/13)  
✅ Interface brutalist renderizando

## Problemas Comuns

### Erro de conexão com MySQL
```bash
sudo systemctl restart mysql
```

### Porta 3000 já em uso
```bash
# Encontrar processo usando a porta
sudo lsof -i :3000
# Matar processo
kill -9 <PID>
```

### Dependências desatualizadas
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

**Pronto para usar!** 🚀
