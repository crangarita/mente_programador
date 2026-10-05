import type { Profile } from '../types/quiz'

export const profileDetails: Record<Profile, { title: string; icon: string; description: string; technologies: string[] }> = {
  FRONTEND_CREATOR: { title: 'Creador Frontend', icon: '🎨', description: 'Transformas ideas en experiencias visuales claras, atractivas y fáciles de usar.', technologies: ['HTML', 'CSS', 'JavaScript', 'React'] },
  BACKEND_ARCHITECT: { title: 'Arquitecto Backend', icon: '⚙️', description: 'Disfrutas organizar la lógica y construir los motores que hacen funcionar cada aplicación.', technologies: ['Java', 'Spring Boot', 'APIs', 'SQL'] },
  AI_EXPLORER: { title: 'Explorador de IA', icon: '🤖', description: 'Tu curiosidad te impulsa a experimentar, automatizar y crear soluciones inteligentes.', technologies: ['Python', 'Machine Learning', 'IA', 'APIs'] },
  CYBER_GUARDIAN: { title: 'Guardián Cibernético', icon: '🛡️', description: 'Observas con atención, anticipas riesgos y buscas proteger sistemas y personas.', technologies: ['Linux', 'Redes', 'Ciberseguridad', 'Ethical Hacking'] },
  DATA_DETECTIVE: { title: 'Detective de Datos', icon: '📊', description: 'Encuentras historias y patrones ocultos para convertir información en decisiones.', technologies: ['SQL', 'Python', 'Power BI', 'Analítica de datos'] },
  GAME_BUILDER: { title: 'Constructor de Juegos', icon: '🎮', description: 'Combinas creatividad, lógica e interacción para convertir ideas en experiencias divertidas.', technologies: ['JavaScript', 'Unity', 'Godot', 'Videojuegos'] },
}
