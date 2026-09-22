import type { ImportedCvData } from '@/lib/importSchema'

/** A fully filled, fictional CV — same shape as the AI-import data, so it goes through
 * the exact same "create + applyImport" path. Lets a new user see a complete, realistic
 * CV immediately (to try templates/colors/densities against real content instead of
 * empty placeholders) without typing anything in first. Nothing here refers to a real
 * person, company, or place. */
export const SAMPLE_CV_DATA: ImportedCvData = {
  personal: {
    firstName: 'Marta',
    lastName: 'Sánchez Ruiz',
    title: 'Desarrolladora Full Stack',
    email: 'marta.sanchez.dev@example.com',
    phone: '+34 611 222 333',
    location: 'Valencia, España',
    summary:
      'Desarrolladora full stack con más de 5 años de experiencia construyendo aplicaciones web escalables con React, Node.js y bases de datos SQL/NoSQL. Apasionada por el código limpio, la experiencia de usuario y el trabajo en equipo ágil. Busco un puesto donde seguir creciendo técnicamente y aportar valor desde el primer día.',
  },
  skills: [
    { name: 'React', level: 5 },
    { name: 'TypeScript', level: 5 },
    { name: 'Node.js', level: 4 },
    { name: 'PostgreSQL', level: 4 },
    { name: 'Docker', level: 3 },
    { name: 'AWS', level: 3 },
    { name: 'GraphQL', level: 3 },
    { name: 'Tailwind CSS', level: 4 },
  ],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'C1 · Avanzado' },
    { name: 'Francés', level: 'B1 · Intermedio' },
  ],
  education: [
    {
      institution: 'Universitat Politècnica de València',
      degree: 'Grado en Ingeniería Informática',
      field: 'Ingeniería del Software',
      location: 'Valencia, España',
      startDate: '2015-09',
      endDate: '2019-06',
      current: false,
      description:
        'Especialización en desarrollo de software y sistemas distribuidos. Proyecto final: plataforma de gestión de tareas con arquitectura de microservicios.',
    },
    {
      institution: 'CodeCamp Academy',
      degree: 'Bootcamp de Desarrollo Web Full Stack',
      field: '',
      location: 'Online',
      startDate: '2019-07',
      endDate: '2019-10',
      current: false,
      description: '',
    },
  ],
  experience: [
    {
      company: 'Nébula Tech',
      position: 'Desarrolladora Full Stack Senior',
      location: 'Valencia, España (híbrido)',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description:
        'Lidero el desarrollo del panel interno de analítica usado por más de 200 empleados.\nDiseñé la migración de la API monolítica a microservicios, reduciendo el tiempo de despliegue en un 40%.\nMentorizo a dos desarrolladoras junior en buenas prácticas de React y testing.',
    },
    {
      company: 'Bluewave Software',
      position: 'Desarrolladora Full Stack',
      location: 'Valencia, España',
      startDate: '2019-11',
      endDate: '2022-02',
      current: false,
      description:
        'Desarrollé y mantuve varios módulos de un SaaS de gestión de inventario para más de 50 clientes.\nImplementé un sistema de notificaciones en tiempo real con WebSockets.\nParticipé en el rediseño de la interfaz, mejorando la satisfacción de usuario según las encuestas internas.',
    },
    {
      company: 'Estudio Digital Coral',
      position: 'Desarrolladora Frontend (prácticas)',
      location: 'Valencia, España',
      startDate: '2019-02',
      endDate: '2019-06',
      current: false,
      description: 'Maquetación y desarrollo de landing pages para clientes con React y Sass.',
    },
  ],
  projects: [
    {
      name: 'Rastreador de gastos personales',
      description:
        'Aplicación web para registrar y visualizar gastos mensuales, con gráficos interactivos y exportación a CSV.',
      url: 'https://github.com/example/gastos-app',
    },
    {
      name: 'API pública de recetas',
      description:
        'API REST documentada con OpenAPI que sirve recetas de cocina filtradas por ingredientes disponibles.',
      url: 'https://github.com/example/recetas-api',
    },
  ],
  certifications: [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2023-05' },
    { name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2021-09' },
  ],
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/example-profile' },
    { label: 'GitHub', url: 'https://github.com/example' },
    { label: 'Portfolio', url: 'https://example.dev' },
  ],
}
