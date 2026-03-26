# 🚀 Todo App - Backend (NestJS)

Este projeto é a evolução de um aplicativo ToDo, onde o objetivo principal é transformar uma aplicação simples em um **sistema completo com backend estruturado**, autenticação de usuários e boas práticas de desenvolvimento utilizadas no mercado.

---

## 🧠 Objetivo do projeto

O foco deste projeto não é apenas "fazer funcionar", mas sim:

* Construir uma API real com arquitetura profissional
* Entender na prática como funciona autenticação (login e registro)
* Trabalhar com persistência de dados
* Evoluir um projeto simples para algo próximo do mercado
* Consolidar conceitos de backend

---

## 🛠️ Tecnologias utilizadas

* Node.js
* NestJS
* MongoDB
* Mongoose
* Bcrypt
* Docker *(planejado para próximas etapas)*

---

## 📌 O que está sendo desenvolvido

### 🔐 Autenticação (em desenvolvimento)

* [x] Estrutura inicial do backend
* [x] Conexão com banco de dados
* [x] Modelagem de usuário
* [x] Registro de usuário (register)
* [ ] Login de usuário
* [ ] Autenticação com JWT
* [ ] Proteção de rotas

---

### ✅ Futuras implementações

* CRUD de tarefas (Tasks)
* Associação de tarefas com usuário
* Estatísticas de produtividade
* Possível sistema de gamificação
* Containerização com Docker

---

## 🧱 Arquitetura do projeto

O projeto segue uma estrutura baseada em boas práticas do NestJS:

```
src/
 ├── auth/
 ├── user/
 └── app.module.ts
```

Separação de responsabilidades:

* **Auth** → autenticação (login/registro)
* **User** → dados do usuário
* **Modules** → organização do sistema

---

## 🔄 Fluxo da aplicação

### Registro:

1. Usuário envia nome, email e senha
2. Backend valida os dados
3. Senha é criptografada com bcrypt
4. Usuário é salvo no banco

---

### Login (próximo passo):

1. Usuário envia email e senha
2. Backend valida credenciais
3. Sistema retorna acesso (futuramente com JWT)

---

## 🎯 Objetivo final

Transformar este projeto em um backend completo que:

* siga boas práticas
* seja utilizável em produção (nível júnior)
* sirva como portfólio técnico real
* demonstre conhecimento em arquitetura backend

---

## 📚 Aprendizados aplicados

* Separação de responsabilidades (Controller, Service, Module)
* Modelagem de dados
* Segurança com hash de senha
* Estruturação de APIs REST
* Organização de projeto escalável

---

## 📌 Status do projeto

🚧 Em desenvolvimento

---

## 👨‍💻 Autor

Desenvolvido por Junior Bonini com foco em evolução para backend e construção de base sólida como desenvolvedor FullStack.
