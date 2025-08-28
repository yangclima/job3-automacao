# JOB3-Automacao Backend API

Este documento descreve as rotas disponíveis na API do backend.

## Rotas da API

# JOB3-Automacao Backend API

Este documento descreve as rotas disponíveis na API do backend para o sistema IHM.

## Rotas da API

### Autenticação

#### 1. [POST] /register
Cadastra um novo usuário no sistema.

**Body esperado:**
```json
{
  "username": "operador01",
  "name": "João Silva",
  "password": "senha123",
  "role": "OPERADOR"
}
```

**Roles disponíveis:**
- `OPERADOR` - Acesso básico ao sistema
- `GERENTE` - Acesso completo, incluindo gerenciamento de usuários

**Exemplo de resposta:**
```json
{
  "user": {
    "id": 2,
    "username": "operador01",
    "name": "João Silva",
    "role": "OPERADOR",
    "createdAt": "2025-08-28T22:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. [POST] /login
Realiza login no sistema.

**Body esperado:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Exemplo de resposta:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "role": "GERENTE",
    "createdAt": "2025-08-28T22:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Gerenciamento (Rotas para Gerentes)

#### 3. [GET] /users
Lista todos os usuários do sistema com contagem de bobinas criadas.
**Acesso:** Apenas GERENTE

**Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "role": "GERENTE",
    "createdAt": "2025-08-28T22:00:00.000Z",
    "_count": {
      "coils": 25
    }
  }
]
```

### Bobinas (Rotas Protegidas)

**Nota:** Todas as rotas de bobinas requerem autenticação. Inclua o token no header:
```
Authorization: Bearer <seu-token-jwt>
```

#### 4. [GET] /coils
Retorna a lista de bobinas cadastradas com informações do usuário que as criou.

**Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "type": "t20cm",
    "size": 100.5,
    "warehouse": "A",
    "manufactureDate": "2025-08-28T12:00:00.000Z",
    "createdBy": {
      "id": 1,
      "username": "admin",
      "name": "Administrador"
    },
    "createdById": 1
  }
]
```

#### 5. [POST] /coils
Cria uma nova bobina (automaticamente associada ao usuário logado).

**Body esperado:**
```json
{
  "type": "t20cm",
  "size": 100.5,
  "warehouse": "A"
}
```

**Exemplo de resposta:**
```json
{
  "id": 2,
  "type": "t20cm",
  "size": 100.5,
  "warehouse": "A",
  "manufactureDate": "2025-08-28T12:00:00.000Z",
  "createdBy": {
    "id": 1,
    "username": "admin",
    "name": "Administrador"
  },
  "createdById": 1
}
```

## Usuário Padrão

O sistema vem com um usuário administrador padrão:
- **Username:** admin
- **Senha:** admin123

## População do Banco de Dados

Para popular o banco com dados de teste, execute:

```bash
node src/populate.js
```

Este script criará:
- **6 usuários** com diferentes perfis (admin, operadores, supervisor, técnico)
- **150 bobinas** distribuídas aleatoriamente entre os usuários
- Datas de fabricação variando nos últimos 5 meses

### Usuários Criados:
- `admin` / `admin123` - Administrador (**GERENTE**)
- `operador01` / `senha123` - João Silva (**OPERADOR**)
- `operador02` / `senha123` - Maria Santos (**OPERADOR**)
- `operador03` / `senha123` - Pedro Oliveira (**OPERADOR**)
- `supervisor01` / `senha123` - Ana Costa (**GERENTE**)
- `tecnico01` / `senha123` - Carlos Ferreira (**OPERADOR**)

## Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação. Os tokens são válidos por 8 horas (duração de um turno de trabalho).

## Sistema de Permissões

O sistema possui dois níveis de acesso:

### OPERADOR
- Pode criar bobinas
- Pode visualizar todas as bobinas
- Acesso às funcionalidades básicas do sistema

### GERENTE  
- Todas as permissões do operador
- Pode listar todos os usuários do sistema
- Pode ver estatísticas de produção por usuário
- Acesso completo ao sistema

**Nota:** O token JWT contém informações sobre o role do usuário, permitindo que o frontend controle a interface exibida conforme as permissões.

---

> Para mais detalhes sobre autenticação, parâmetros ou respostas, consulte o código-fonte ou entre em contato com o responsável pelo projeto.
