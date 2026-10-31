# CONECTA MAIRIPORÃ

> **"Compre em Mairiporã. O comércio local mais perto de você."**  
> *"Juntos, o comércio local fica mais forte."*

Plataforma digital completa, moderna e responsiva dedicada a conectar os moradores aos estabelecimentos comerciais, prestadores de serviços e produtores locais da cidade de **Mairiporã - SP** (Serra da Cantareira).

---

## 🌟 Principais Funcionalidades

1. **Página Inicial (Homepage Moderna e Responsiva)**:
   - Identidade visual com verde oficial (`#087A3C`, `#064D2B`, `#E9F6EC`, `#FFC928`).
   - Logotipo oficial com o carrinho de compras integrado dentro da letra O.
   - Banner principal com fotografia de comércio e montanhas, benefícios e barra de pesquisa inteligente.
   - Grade com as 17 categorias comerciais de Mairiporã com ícones modernos.
   - Três blocos de destaque: "Ofertas da Semana", "Lojas perto de você" e "Compre Local".
   - Vitrine de lojas em destaque com endereço e bairro (Centro, Terra Preta, Lavapés, Saboó, etc.).
   - Seção "Ofertas para você" com filtros de categoria e botões diretos de consulta via WhatsApp.

2. **Guia e Busca de Lojas**:
   - Busca em tempo real por nome, produto, serviço, bairro e categoria.
   - Filtros por todos os bairros de Mairiporã (Centro, Terra Preta, Jardim Capim Branco, Lavapés, Saboó, Pirucaia, Rio Abaixo, Roseira, etc.).

3. **Página Individual da Loja**:
   - Capa, logotipo, galeria de fotografias, endereço completo, horário de funcionamento e telefone.
   - Botão destacado: **"Falar com a loja pelo WhatsApp"** com mensagem automática personalizada.
   - Catálogo integrado de produtos cadastrados e ofertas ativas da loja.

4. **Cadastro de Empresas (`/cadastre-sua-empresa`)**:
   - Formulário completo para comerciantes locais (Responsável, Razão Social/Nome Fantasia, CNPJ, Categoria, Endereço, Bairro, WhatsApp, E-mail, Horários, Logo e Fachada).
   - **Moderação prévia obrigatória**: Novos cadastros entram com status `pendente` e aguardam aprovação no Painel Administrativo.
   - Mensagem de confirmação pós-envio: *"Cadastro recebido! Nossa equipe analisará suas informações antes da publicação."*

5. **Painel Administrativo Completo (`/admin`)**:
   - Acesso seguro protegido por autenticação (com atalho de 1-clique para teste/avaliação).
   - 4 Indicadores principais em tempo real:
     - Total de Empresas
     - Empresas Aguardando Aprovação (com alerta visual)
     - Produtos Cadastrados
     - Ofertas Publicadas
   - Gestão de Empresas: Aprovar, Rejeitar, Editar, Excluir e Alternar Destaque na Home.
   - Gestão de Catálogo: Cadastrar novos produtos/ofertas vinculados às lojas, editar e excluir.
   - Gestão de Categorias e Métricas de distribuição por bairro.
   - Diagnóstico da conexão Firebase em tempo real.

6. **Sacola de Interesses (Favoritos)**:
   - Permite que o morador salve lojas e ofertas favoritas para contatar os estabelecimentos pelo WhatsApp quando desejar.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Firebase SDK** (Cloud Firestore, Firebase Authentication, Storage)
- **Modo de Demonstração Interativo**: Opera com persistência local instantânea e dados de exemplo realistas de Mairiporã caso o Firebase ainda não esteja conectado.

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# O app estará disponível em http://localhost:3000
```

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

---

## 🔐 Como Configurar o Firebase em Produção

### 1. Criar Projeto no Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em **Adicionar projeto** e dê o nome `conecta-mairipora`.
3. Ative o **Cloud Firestore** no modo de produção.
4. Ative o **Firebase Authentication** (método E-mail/Senha).

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (baseado em `.env.example`):

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="conecta-mairipora.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="conecta-mairipora"
VITE_FIREBASE_STORAGE_BUCKET="conecta-mairipora.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

### 3. Regras de Segurança do Firestore (`firestore.rules`)
O arquivo `firestore.rules` já está pronto na raiz do projeto:
- Leitura pública de lojas e produtos aprovados.
- Submissão pública de cadastros com status obrigatório `pending`.
- Moderação (aprovação, edição, exclusão e destaques) restrita a administradores.

---

## 🏙️ Bairros Atendidos em Mairiporã
- Centro
- Terra Preta
- Jardim Capim Branco
- Lavapés
- Saboó
- Pirucaia
- Rio Abaixo
- Roseira
- Parque Suíço
- Mato Dentro
- Cantareira
- Barreiro
- Capuava
