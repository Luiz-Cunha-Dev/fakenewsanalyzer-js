# Fake News Analyzer

Este projeto é um analisador de notícias falsas que utiliza várias tecnologias, incluindo Puppeteer, WhatsApp Web.js e MySQL.

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js e npm instalados

## Configuração

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example` e preencha as variáveis de ambiente:
    ```sh
    cp .env.example .env
    ```

3. Edite o arquivo `.env` com suas configurações:
    ```env
    DB_HOST=db
    DB_USER=root
    DB_NAME=fakeanalyzer
    DB_PASSWORD=sua_senha
    MAX_CONCURRENT_MESSAGES=5
    GEMINI_API_KEY=sua_chave_gemini
    ```

## Executando o Projeto

### Usando Docker

1. Construa e inicie os containers Docker:
    ```sh
    docker-compose up --build
    ```

2. O MySQL será iniciado e o script `fakeanalyzer.sql` será executado para configurar o banco de dados.

### Usando Node.js

1. Instale as dependências do projeto:
    ```sh
    npm install
    ```

2. Inicie o projeto:
    ```sh
    npm start
    ```

## Uso

1. Escaneie o QR code gerado pelo WhatsApp Web.js para autenticar o cliente do WhatsApp.
2. Envie mensagens para o número do WhatsApp autenticado para analisar se são fake news.

## Estrutura do Projeto

- `src/`: Contém o código-fonte do projeto.
- `db_data/`: Contém os dados do banco de dados MySQL.
- `docker-compose.yml`: Arquivo de configuração do Docker Compose.
- `.env.example`: Exemplo de arquivo de configuração de variáveis de ambiente.

## Tecnologias Utilizadas

- Node.js
- Docker
- MySQL
- Puppeteer
- WhatsApp Web.js
- Google Generative AI

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT.