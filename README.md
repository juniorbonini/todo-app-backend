# ⚙️ Ascending Time Forge — Backend

API REST desenvolvida com **NestJS**, **MongoDB** e **TypeScript**, responsável pela camada de dados e autenticação do app Ascending Time Forge.

O projeto foi construído com foco em **arquitetura profissional**, **segurança real** e **boas práticas de mercado** — indo além do "apenas funcionar" para algo próximo do que se usa em produção.

---

## 🚀 Tecnologias

- Node.js
- NestJS
- MongoDB
- Mongoose
- Bcrypt
- JWT (JSON Web Token)
- Nodemailer (envio de e-mails)
- TypeScript
- Docker *(planejado)*

---

## ✅ Funcionalidades implementadas

### 🔐 Autenticação

- Registro de usuário com validação de dados
- Hash de senha com Bcrypt
- Login com retorno de token JWT
- Proteção de rotas com `AuthGuard` (JWT)
- Decorator de usuário autenticado (`@ActiveUser`)

### 📬 Serviço de E-mail

- Envio de código de verificação por e-mail
- Estrutura de `MailService` com controller e service dedicados
- Base pronta para fluxo de recuperação de senha

### 🛡️ Tratamento de Erros

- Filtro global de exceções (`ExceptionFilter`)
- Respostas padronizadas via `ApiResponse`
- Melhor experiência para o consumidor da API

### 🔧 Utilitários

- `commit-generator` — padronização de mensagens de commit
- Interfaces tipadas: `ActiveUser`, `ApiResponse`, `JwtPayload`

---

## 🔄 Fluxo de autenticação

**Registro:**

1. Usuário envia nome, e-mail e senha
2. Backend valida os dados
3. Senha é criptografada com Bcrypt
4. Usuário é salvo no banco
5. E-mail de verificação é enviado com código

**Login:**

1. Usuário envia e-mail e senha
2. Backend valida credenciais
3. Sistema retorna token JWT

**Rotas protegidas:**

- Decoradas com `@UseGuards(AuthGuard)` via JWT Strategy

---

## 🧱 Arquitetura

| Camada | Responsabilidade |
| --- | --- |
| `Controller` | Recebe requisições e delega para o Service |
| `Service` | Contém a lógica de negócio |
| `Module` | Organiza e conecta as partes do sistema |
| `DTO` | Valida e tipifica os dados de entrada |
| `Schema` | Define a modelagem dos dados no MongoDB |
| `Guard` | Protege rotas autenticadas |
| `Decorator` | Extrai dados do usuário autenticado |
| `Filter` | Trata erros de forma global e padronizada |

---

## 📁 Estrutura de pastas

```
src/
├── auth/
│   ├── controller/
│   ├── decorators/
│   ├── dto/
│   ├── service/
│   ├── validators/
│   └── auth.module.ts
├── exception/
│   └── exception.filter.ts
├── interfaces/
│   ├── active.user.ts
│   ├── api-response.ts
│   └── jwt.payload.ts
├── jwt/
│   ├── jwt.auth.guard.ts
│   └── jwt.strategy.ts
├── mailservice/
│   ├── controller/
│   ├── service/
│   └── mail.module.ts
├── scripts/
│   ├── api-response.ts
│   └── commit-generator.ts
├── task/
│   ├── controller/
│   ├── dto/
│   ├── schema/
│   ├── service/
│   └── task.module.ts
├── user/
│   ├── controller/
│   ├── dto/
│   ├── schemas/
│   ├── service/
│   └── user.module.ts
├── app.module.ts
└── main.ts
```

---

## 🎯 Próximas implementações

- [ ] Conclusão do fluxo de recuperação de senha
- [ ] CRUD completo de tarefas associado ao usuário autenticado
- [ ] Estatísticas de produtividade por usuário
- [ ] Sistema de gamificação (XP e níveis)
- [ ] Containerização com Docker

---

## ▶️ Como executar

```bash
# Instalar dependências
pnpm install

# Modo desenvolvimento
pnpm run start:dev

# Modo produção
pnpm run start:prod
```

---

## 📚 Aprendizados aplicados

- Separação de responsabilidades (Controller, Service, Module)
- Modelagem de dados com Mongoose
- Segurança com hash de senha e JWT
- Proteção de rotas com Guards
- Tratamento global de erros
- Envio de e-mails transacionais
- Organização de projeto escalável

---

## 👨‍💻 Autor

Desenvolvido por **Junior Bonini** com foco em evolução para backend e construção de base sólida como desenvolvedor FullStack.
