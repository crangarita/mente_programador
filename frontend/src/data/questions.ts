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

const contextualDescriptions: Record<number, Record<Profile, string>> = {
  1: {
    FRONTEND_CREATOR: 'Convertirías la idea en pantallas claras, atractivas y fáciles de usar.',
    BACKEND_ARCHITECT: 'Diseñarías las reglas, procesos y servicios que hacen funcionar la aplicación.',
    AI_EXPLORER: 'Empezarías creando una función capaz de aprender, predecir o conversar.',
    CYBER_GUARDIAN: 'Definirías desde el inicio cómo proteger datos, accesos y comunicaciones.',
    DATA_DETECTIVE: 'Planearías qué información recopilar y cómo convertirla en decisiones útiles.',
    GAME_BUILDER: 'Construirías primero la mecánica central que hace divertida la experiencia.',
  },
  2: {
    FRONTEND_CREATOR: 'Te motiva combinar color, composición y movimiento para comunicar una idea.',
    BACKEND_ARCHITECT: 'Disfrutas encontrar una secuencia ordenada que produzca una solución confiable.',
    AI_EXPLORER: 'Te interesa probar modelos, instrucciones y datos hasta obtener un comportamiento inteligente.',
    CYBER_GUARDIAN: 'Te atrae investigar sistemas, descubrir debilidades y proponer cómo corregirlas.',
    DATA_DETECTIVE: 'Prefieres comparar cifras, formular preguntas y descubrir lo que los datos revelan.',
    GAME_BUILDER: 'Te entusiasma unir reglas, interacción, narrativa y recompensas en un mundo jugable.',
  },
  3: {
    FRONTEND_CREATOR: 'Exploras distintas formas visuales de explicar el problema hasta hacerlo comprensible.',
    BACKEND_ARCHITECT: 'Separas el problema en tareas pequeñas, defines dependencias y resuelves una por una.',
    AI_EXPLORER: 'Buscas patrones repetibles que puedan resolverse mediante automatización o aprendizaje.',
    CYBER_GUARDIAN: 'Imaginas escenarios de fallo, evalúas riesgos y preparas defensas antes de actuar.',
    DATA_DETECTIVE: 'Reúnes evidencia, contrastas variables y evitas decidir hasta comprender el panorama.',
    GAME_BUILDER: 'Transformas la dificultad en niveles, reglas y pequeñas metas que puedas superar.',
  },
  4: {
    FRONTEND_CREATOR: 'Crearías una experiencia móvil fluida donde cada pantalla guíe naturalmente al usuario.',
    BACKEND_ARCHITECT: 'Construirías una plataforma estable capaz de conectar usuarios, datos y procesos.',
    AI_EXPLORER: 'Desarrollarías un asistente que comprenda solicitudes y ayude a resolver tareas.',
    CYBER_GUARDIAN: 'Diseñarías una solución que detecte amenazas y proteja información sensible.',
    DATA_DETECTIVE: 'Crearías un tablero que transforme grandes volúmenes de datos en señales claras.',
    GAME_BUILDER: 'Darías vida a personajes, reglas y desafíos dentro de una experiencia interactiva.',
  },
  5: {
    FRONTEND_CREATOR: 'Te importa que la tecnología también sea intuitiva, expresiva y visualmente memorable.',
    BACKEND_ARCHITECT: 'Tu curiosidad se dirige a los mecanismos, conexiones y reglas que nadie ve.',
    AI_EXPLORER: 'Aprendes probando herramientas nuevas y descubriendo usos que aún no son evidentes.',
    CYBER_GUARDIAN: 'Observas detalles, anticipas errores y detectas riesgos antes de que se conviertan en problemas.',
    DATA_DETECTIVE: 'Encuentras relaciones donde otros ven información aislada y las conviertes en respuestas.',
    GAME_BUILDER: 'Combinas creatividad y competencia para construir experiencias que invitan a participar.',
  },
}

const questionDefinitions: Question[] = [
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

export const questions: Question[] = questionDefinitions.map((question) => ({
  ...question,
  options: question.options.map((questionOption) => ({
    ...questionOption,
    description: contextualDescriptions[question.number][questionOption.profile],
  })),
}))
