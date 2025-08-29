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
		"id": 7,
		"username": "operador08",
		"name": "Yan Lima",
		"role": "OPERADOR",
		"createdAt": "2025-08-29T00:37:04.941Z"
	}
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
		"createdAt": "2025-08-28T23:50:08.079Z"
	}
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
  },
  {
    "id": 2,
    "username": "operador01",
    "name": "Yan Lima",
    "role": "OPERADOR",
    "createdAt": "2025-08-28T22:00:00.000Z",
    "_count": {
      "coils": 257
    }
  }

  ...
]
```

### Bobinas

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
	"type": "t40cm",
	"size": 30,
	"warehouse": "A",
	"createdById": 2
}
```

**Exemplo de resposta:**
```json
{
	"id": 159,
	"type": "t40cm",
	"size": 30,
	"warehouse": "A",
	"manufactureDate": "2025-08-29T00:40:54.973Z",
	"createdById": 2,
	"createdBy": {
		"id": 2,
		"username": "operador01",
		"name": "João Silva"
	}
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