# 🚀 Guia de Deploy Permanente - Sistema OPERADOR

Siga estes passos para colocar seu sistema online para sempre na **Render**.

## 1. Preparar o GitHub
1. Crie um novo repositório no seu GitHub (ex: `meu-operador`).
2. Não inicialize com README ou licença.

## 2. Subir o Código
Abra o terminal na pasta do projeto e execute:

```bash
# Adicionar o endereço do seu repositório
git remote add origin https://github.com/SEU_USUARIO/meu-operador.git

# Enviar os arquivos
git branch -M main
git push -u origin main
```

## 3. Ativar na Render
1. Acesse [dashboard.render.com](https://dashboard.render.com).
2. Clique no botão **"New"** (topo direito) e escolha **"Blueprint"**.
3. Conecte sua conta do GitHub e selecione o repositório `meu-operador`.
4. Clique em **"Approve"**.

**O que vai acontecer:**
- A Render lerá o arquivo `render.yaml` que eu criei.
- Ela criará automaticamente um **Banco de Dados MySQL**.
- Ela criará o **Servidor Web**.
- Em poucos minutos, você receberá um link `https://operador-app.onrender.com` (ou similar).

## 💡 Dicas Importantes
- **Banco de Dados**: A Render configurará o `DATABASE_URL` sozinha. Você não precisa mexer em nada.
- **Segurança**: O sistema está configurado para ser aberto (sem login), conforme o estado atual do seu código.
- **Custo**: No plano "Free" da Render, o banco de dados expira após 90 dias. Para uso profissional contínuo, considere o plano "Starter".

---
**Configurado com sucesso por Manus AI.**
