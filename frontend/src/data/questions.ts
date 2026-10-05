import type { Profile, Question, QuestionOption, QuizOption } from '../types/quiz'

const details: Record<Profile, { description: string; tag: string; technology: string }> = {
  FRONTEND_CREATOR: { description: 'Interfaces, paletas de color, microanimaciones y experiencias claras para las personas.', tag: 'DEV.FRONTEND', technology: 'UX/UI · Web Apps' },
  BACKEND_ARCHITECT: { description: 'Bases de datos, servidores, APIs y algoritmos que mantienen todo funcionando.', tag: 'DEV.BACKEND', technology: 'APIs · Cloud Engines' },
  AI_EXPLORER: { description: 'Modelos predictivos, asistentes inteligentes, automatización y visión computacional.', tag: 'SYS.AI_EXPLORER', technology: 'Python · Neural Nets' },
  CYBER_GUARDIAN: { description: 'Protección de sistemas, criptografía, redes y búsqueda estratégica de vulnerabilidades.', tag: 'NET.SECURITY', technology: 'SecOps · Defense Lab' },
  DATA_DETECTIVE: { description: 'Patrones ocultos, visualización y decisiones respaldadas por información real.', tag: 'DAT.ANALYTICS', technology: 'Big Data · Insights' },
  GAME_BUILDER: { description: 'Mecánicas interactivas, mundos digitales, física y sistemas de recompensa.', tag: 'DEV.GAMING', technology: 'Unity · Game Engine' },
}

const option = (id: QuizOption, label: string, profile: Profile, icon: string): QuestionOption => ({
  id,
  label,
  profile,
  icon,
  ...details[profile],
})

export const questions: Question[] = [
  {
    number: 1,
    text: 'Si crearas una aplicación, ¿qué parte desarrollarías primero?',
    options: [
      option('A', 'Diseñar las pantallas', 'FRONTEND_CREATOR', '🎨'),
      option('B', 'Crear la lógica interna', 'BACKEND_ARCHITECT', '⚙️'),
      option('C', 'Hacer que aprenda con IA', 'AI_EXPLORER', '🤖'),
      option('D', 'Protegerla de ataques', 'CYBER_GUARDIAN', '🛡️'),
      option('E', 'Analizar los datos que produce', 'DATA_DETECTIVE', '📊'),
      option('F', 'Convertirla en un juego', 'GAME_BUILDER', '🎮'),
    ],
  },
  {
    number: 2,
    text: '¿Qué actividad te parece más interesante?',
    options: [
      option('A', 'Diseñar algo visual', 'FRONTEND_CREATOR', '🎨'),
      option('B', 'Resolver un problema lógico', 'BACKEND_ARCHITECT', '⚙️'),
      option('C', 'Experimentar con inteligencia artificial', 'AI_EXPLORER', '🤖'),
      option('D', 'Encontrar fallos de seguridad', 'CYBER_GUARDIAN', '🛡️'),
      option('E', 'Analizar información', 'DATA_DETECTIVE', '📊'),
      option('F', 'Crear un videojuego', 'GAME_BUILDER', '🎮'),
    ],
  },
  {
    number: 3,
    text: 'Cuando aparece un problema difícil, prefieres…',
    options: [
      option('A', 'Probar maneras distintas de presentarlo', 'FRONTEND_CREATOR', '🎨'),
      option('B', 'Dividirlo en pequeños pasos', 'BACKEND_ARCHITECT', '⚙️'),
      option('C', 'Buscar una solución automatizada', 'AI_EXPLORER', '🤖'),
      option('D', 'Buscar qué puede salir mal', 'CYBER_GUARDIAN', '🛡️'),
      option('E', 'Analizar toda la información', 'DATA_DETECTIVE', '📊'),
      option('F', 'Convertirlo en un reto', 'GAME_BUILDER', '🎮'),
    ],
  },
  {
    number: 4,
    text: '¿Qué proyecto te gustaría crear?',
    options: [
      option('A', 'Una aplicación móvil atractiva', 'FRONTEND_CREATOR', '🎨'),
      option('B', 'Una plataforma empresarial', 'BACKEND_ARCHITECT', '⚙️'),
      option('C', 'Un asistente inteligente', 'AI_EXPLORER', '🤖'),
      option('D', 'Un sistema de ciberseguridad', 'CYBER_GUARDIAN', '🛡️'),
      option('E', 'Un dashboard de datos', 'DATA_DETECTIVE', '📊'),
      option('F', 'Un videojuego', 'GAME_BUILDER', '🎮'),
    ],
  },
  {
    number: 5,
    text: '¿Qué frase te representa mejor?',
    options: [
      option('A', 'Creo cosas visualmente atractivas', 'FRONTEND_CREATOR', '🎨'),
      option('B', 'Entiendo cómo funcionan las cosas por dentro', 'BACKEND_ARCHITECT', '⚙️'),
      option('C', 'Experimento con nuevas tecnologías', 'AI_EXPLORER', '🤖'),
      option('D', 'Encuentro errores antes que los demás', 'CYBER_GUARDIAN', '🛡️'),
      option('E', 'Descubro patrones', 'DATA_DETECTIVE', '📊'),
      option('F', 'Compito y creo experiencias divertidas', 'GAME_BUILDER', '🎮'),
    ],
  },
]
