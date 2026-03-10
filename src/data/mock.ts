import { Project } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Cozinha Gourmet Contemporânea',
    category: 'Cozinhas',
    description: 'Projeto de cozinha integrada com ilha central em lâmina de madeira natural Nogueira e acabamento em laca fosca. Puxadores usinados e iluminação embutida em LED.',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Closet Master Elegance',
    category: 'Closets',
    description: 'Closet espaçoso com portas em vidro reflecta bronze e perfis em alumínio champanhe. Interior em MDF padrão tecido com iluminação linear em todas as prateleiras.',
    image_url: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Home Office Executivo',
    category: 'Home Office',
    description: 'Escritório projetado para produtividade e elegância. Mesa em L com tampo engrossado e painel ripado em Freijó. Estante iluminada para livros e decorações.',
    image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Painel TV Living',
    category: 'Salas',
    description: 'Painel para TV em grande formato com revestimento em pedra sintética e rack suspenso em laca brilho. Detalhes em filetes dourados e fita de LED.',
    image_url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Suíte Master Aconchego',
    category: 'Quartos',
    description: 'Cabeceira estofada em linho com painéis laterais ripados em madeira Carvalho. Mesas de cabeceira suspensas com gavetas com fecho toque.',
    image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2070&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Gabinete Banho Spa',
    category: 'Banheiros',
    description: 'Gabinete suspenso para banheiro com acabamento resistente à umidade em tom Fendi. Gavetões com divisórias internas em acrílico e puxador cava.',
    image_url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  }
];

export const categories = [
  'Cozinhas',
  'Closets',
  'Home Office',
  'Salas',
  'Quartos',
  'Banheiros'
];
