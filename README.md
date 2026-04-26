# GrowTwitter

Rede social fictícia inspirada no Twitter, desenvolvida com React, TypeScript e Material UI, utilizando a [GrowTwitter API](https://github.com/academygrowdev-leticialeal/growtwitter-api).

## Tecnologias e recursos

- Componentização com React e Material UI;
- Tipagem estática com TypeScript para maior segurança;
- Gerenciamento de estado global com Redux Toolkit;
- Persistência de sessão e preferência de tema com Redux Persist;
- Roteamento e controle de acesso com React Router;
- Integração com API REST utilizando Axios;
- Feedback visual de interações com indicadores de carregamento e alertas;
- Uso de Optimistic UI em funcionalidades selecionadas para maior fluidez;
- Layout responsivo para dispositivos móveis e desktop.

## Funcionalidades

### 1. Autenticação

- Login e logout de usuários;
- Cadastro de novos usuários.

### 2. Usuários

- Página de perfil de usuário;
- Seguir e deixar de seguir usuários;
- Listagem de usuários não seguidos.

### 3. Growtweets

- Feed com posts de usuários seguidos;
- Publicar e excluir growtweets;
- Responder, curtir e descurtir growtweets;
- Visualizar detalhes e respostas de um growtweet.

### 4. Interface

- Alternância entre temas claro e escuro.

## Preview

![Preview Tema Light](https://private-user-images.githubusercontent.com/69807930/583824965-47840bdb-8b21-4454-bba9-dd75d78b1df3.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzcxNjM1MzQsIm5iZiI6MTc3NzE2MzIzNCwicGF0aCI6Ii82OTgwNzkzMC81ODM4MjQ5NjUtNDc4NDBiZGItOGIyMS00NDU0LWJiYTktZGQ3NWQ3OGIxZGYzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA0MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNDI2VDAwMjcxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWMwOWVkZmY0MGJlMDIyYjFhNWE5ODhmM2FiNjQ1YjczZWIxYjFmNjVkNmU4N2EyZTJkYmRlMzM5ODE3MjQ3YzUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.PqYJX6ryYWTYwzSEoWhrcHBE9hM5MeZsucNZvHecGOQ)
![Preview Tema Dark](https://private-user-images.githubusercontent.com/69807930/583824969-681b3201-8937-4182-86d1-8f409d20f214.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzcxNjM1MzQsIm5iZiI6MTc3NzE2MzIzNCwicGF0aCI6Ii82OTgwNzkzMC81ODM4MjQ5NjktNjgxYjMyMDEtODkzNy00MTgyLTg2ZDEtOGY0MDlkMjBmMjE0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA0MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNDI2VDAwMjcxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTcxOTdjYzc4ZGE0OWU5ZDU2NzQxYjNmZjRkMTQyZmZiMWE1NTk5MGRkOWI1ZTZlOGExMDVmNDllODUxNGZiYmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.fxQmw0LXiGIRXy0hLgKimnLXKqDWJaJ2Ar2zblK8KVg)
