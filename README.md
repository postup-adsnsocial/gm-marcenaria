# G&M Móveis - Marcenaria de Luxo

Este é o projeto frontend e admin para a G&M Móveis, uma marcenaria de luxo estabelecida em 1987. O projeto foi desenvolvido com Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion e Supabase.

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.com/)
- [Lucide React](https://lucide.dev/)

## 🛠️ Configuração Inicial

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🗄️ Configuração do Supabase

Para que o painel administrativo funcione corretamente com o banco de dados, você precisa configurar o Supabase:

1. Crie um novo projeto no Supabase.
2. Vá para o **SQL Editor** e execute o seguinte script para criar as tabelas e políticas:

```sql
-- Criar tabela de projetos
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de papéis de usuário (Roles)
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Configurar RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_roles
CREATE POLICY "Usuários podem ler seu próprio papel"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Políticas para projects
CREATE POLICY "Permitir leitura pública" 
ON projects FOR SELECT 
USING (true);

-- Permitir inserção apenas para admins e editors
CREATE POLICY "Permitir inserção" 
ON projects FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Permitir atualização apenas para admins e editors
CREATE POLICY "Permitir atualização" 
ON projects FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Permitir exclusão apenas para admins
CREATE POLICY "Permitir exclusão" 
ON projects FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Trigger para criar papel padrão (viewer) para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

3. Vá para **Storage** e crie um novo bucket chamado `project-images`.
4. Configure as políticas do bucket para permitir leitura pública e uploads apenas para usuários autenticados.

> **Nota:** As políticas acima são permissivas para facilitar o desenvolvimento. Em um ambiente de produção real, você deve restringir as operações de INSERT, UPDATE e DELETE apenas para usuários autenticados (admins).

## 🔐 Acesso ao Painel Admin

- **URL:** `/admin`
- **Senha Padrão:** `gm2024`

*(Nota: O sistema possui um fallback para dados mockados caso as variáveis de ambiente do Supabase não estejam configuradas, permitindo testar a interface imediatamente).*

## 🎨 Identidade Visual

- **Primária:** `#FAF8F3` (bege claro/off-white)
- **Secundária:** `#2B2B2B` (cinza escuro quase preto)
- **Acento:** `#8B7355` (marrom dourado)
- **Tipografia:** Playfair Display (Títulos) e Inter (Corpo)
