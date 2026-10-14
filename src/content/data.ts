import type { ContactChannel, Experience, Project, SectionId } from './types'

export const sections: readonly SectionId[] = ['sobre', 'projetos', 'experiencias', 'contato']

export const skills = [
    'TypeScript',
    'React',
    'Vue',
    'Tailwind CSS',
    'Three.js',
    'Laravel',
    'Python',
    'Figma',
    'Git',
] as const

/* Ordem cronológica crescente: a timeline lê de cima (mais antigo) para baixo. */
export const projects: readonly Project[] = [
    {
        id: 'cozinha-facil',
        year: 2026,
        name: 'CozinhaFácil',
        description: {
            'pt-BR': 'Projeto da faculdade: catálogo de receitas que responde "o que tem na sua geladeira hoje?". Filtra pelos ingredientes que você tem em casa, mostra a compatibilidade de cada receita e organiza por categoria, com página de detalhes e cadastro consumindo uma API REST.',
            en: 'College project: a recipe catalog that answers "what\'s in your fridge today?". It filters by the ingredients you have at home, shows how well each recipe matches and groups them by category, with detail and sign-up pages consuming a REST API.',
        },
        tech: ['HTML', 'CSS', 'JavaScript', 'JSON Server'],
        repo: 'https://github.com/ICEI-PUC-Minas-EngSoft-DIW/trabalho-pr-tico-semana-13-Leticia-soares404',
        media: '/projetos/cozinha-facil.jpg',
    },
    {
        id: 'rana-estudio',
        year: 2026,
        name: 'Rana Estúdio',
        description: {
            'pt-BR': 'Landing page do meu estúdio de design: cena 3D de um lago com sapo venenoso, logo animada na carga e conteúdo bilíngue.',
            en: 'Landing page for my design studio: a 3D pond scene with a poison frog, animated logo on load and bilingual content.',
        },
        tech: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Cloudflare Workers'],
        repo: 'https://github.com/rana-estudio/landing-page-rana-estudio',
        live: 'https://ranaestudio.com',
        media: '/projetos/rana-estudio.png',
    },
    {
        id: 'portfolio',
        year: 2026,
        name: 'Portfólio interativo',
        description: {
            'pt-BR': 'Este site: fundo em shader que reage ao mouse, cursor próprio, tema claro e escuro, PT/EN e formulário com envio por e-mail.',
            en: 'This site: a shader background that reacts to the mouse, custom cursor, light and dark themes, PT/EN and an email contact form.',
        },
        tech: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'EmailJS'],
        repo: 'https://github.com/Leticia-soares404/portfolio-profissional',
        media: '/projetos/portfolio.png',
    },
]

export const experiences: readonly Experience[] = [
    {
        id: 'rana',
        organization: 'Rana Estúdio',
        kind: 'work',
        role: { 'pt-BR': 'fundadora · designer e desenvolvedora', en: 'founder · designer and developer' },
        period: { 'pt-BR': '2026 — atual', en: '2026 — present' },
        description: {
            'pt-BR': 'Identidade visual e sites feitos à mão para pequenas empresas, do primeiro rascunho ao domínio no ar.',
            en: 'Visual identity and handmade websites for small businesses, from first sketch to live domain.',
        },
    },
    {
        id: 'puc',
        organization: 'PUC Minas',
        kind: 'education',
        role: { 'pt-BR': 'graduação em Engenharia de Software', en: 'B.Sc. in Software Engineering' },
        period: { 'pt-BR': '2026 — atual', en: '2026 — present' },
        description: {
            'pt-BR': 'Desenvolvimento web, modelagem de sistemas e engenharia de requisitos.',
            en: 'Web development, systems modeling and requirements engineering.',
        },
    },
]

export const contactEmail = 'leticia@ranaestudio.com.br'

export const contactChannels: readonly ContactChannel[] = [
    { id: 'email', label: 'E-mail', href: `mailto:${contactEmail}`, handle: contactEmail },
    { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5531998043669', handle: '+55 31 99804-3669' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/let%C3%ADcia-soares-8b6540262/', handle: '/in/letícia-soares' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/Leticia-soares404', handle: '@Leticia-soares404' },
]
