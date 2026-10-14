import type { Profile } from '../types/quiz'
import frontendImage from '../assets/profiles/frontend-creator.webp'
import backendImage from '../assets/profiles/backend-architect.webp'
import aiImage from '../assets/profiles/ai-explorer.webp'
import cyberImage from '../assets/profiles/cyber-guardian.webp'
import dataImage from '../assets/profiles/data-detective.webp'
import gameImage from '../assets/profiles/game-builder.webp'

export const profileDetails: Record<Profile, { title: string; icon: string; image: string; description: string; technologies: string[] }> = {
  FRONTEND_CREATOR: { title: 'Creador Frontend', icon: '🎨', image: frontendImage, description: 'Transformas ideas en experiencias visuales claras, atractivas y fáciles de usar.', technologies: ['HTML', 'CSS', 'JavaScript', 'React'] },
  BACKEND_ARCHITECT: { title: 'Arquitecto Backend', icon: '⚙️', image: backendImage, description: 'Disfrutas organizar la lógica y construir los motores que hacen funcionar cada aplicación.', technologies: ['Java', 'Spring Boot', 'APIs', 'SQL'] },
  AI_EXPLORER: { title: 'Explorador de IA', icon: '🤖', image: aiImage, description: 'Tu curiosidad te impulsa a experimentar, automatizar y crear soluciones inteligentes.', technologies: ['Python', 'Machine Learning', 'IA', 'APIs'] },
  CYBER_GUARDIAN: { title: 'Guardián Cibernético', icon: '🛡️', image: cyberImage, description: 'Observas con atención, anticipas riesgos y buscas proteger sistemas y personas.', technologies: ['Linux', 'Redes', 'Ciberseguridad', 'Ethical Hacking'] },
  DATA_DETECTIVE: { title: 'Detective de Datos', icon: '📊', image: dataImage, description: 'Encuentras historias y patrones ocultos para convertir información en decisiones.', technologies: ['SQL', 'Python', 'Power BI', 'Analítica de datos'] },
  GAME_BUILDER: { title: 'Constructor de Juegos', icon: '🎮', image: gameImage, description: 'Combinas creatividad, lógica e interacción para convertir ideas en experiencias divertidas.', technologies: ['JavaScript', 'Unity', 'Godot', 'Videojuegos'] },
}
