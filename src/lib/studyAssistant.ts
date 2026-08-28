export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type SuggestedPrompt = {
  label: string;
  prompt: string;
};

export const suggestedPrompts: SuggestedPrompt[] = [
  { label: 'Organizar mi semana', prompt: 'Ayúdame a organizar mi semana escolar, tengo exámenes y tareas.' },
  { label: 'Preparar un examen', prompt: '¿Cómo me preparo para un examen de matemáticas que es en tres días?' },
  { label: 'Hacer un horario', prompt: 'Hazme un horario de estudio que combine con mis clases de la mañana.' },
  { label: 'Evitar distracciones', prompt: 'Me distraigo mucho al estudiar, ¿qué técnicas me recomiendas?' },
  { label: 'Resumir un tema', prompt: 'Ayúdame a resumir un tema largo de historia de forma fácil.' },
  { label: 'Proyecto en grupo', prompt: 'Tengo un proyecto en grupo, ¿cómo repartimos las tareas?' },
];

const greeting =
  '¡Hola! Soy tu asistente de planificación escolar. Puedo ayudarte a organizar tu semana, preparar exámenes, crear horarios de estudio, resumir temas y mucho más. ¿En qué te gustaría empezar?';

const fallback =
  'Cuenta conmigo para organizar tu vida escolar. Prueba a preguntarme cómo preparar un examen, cómo repartir tu tiempo esta semana o cómo evitar distracciones al estudiar.';

function pickRandom(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

function buildStudyPlan(days: number): string {
  const blocks = [
    'Repaso general del temario (45 min)',
    'Ejercicios prácticos (40 min)',
    'Resolver simulacros o preguntas de examen (35 min)',
    'Descanso activo (10 min)',
    'Repaso de errores y dudas (25 min)',
  ];
  const plan: string[] = [];
  for (let day = 1; day <= days; day += 1) {
    const dayLabel = day === days ? 'Víspera del examen' : `Día ${day}`;
    const focus = day <= 2 ? 'Lo esencial primero' : day <= days - 1 ? 'Afianzar y practicar' : 'Repaso final';
    plan.push(`• ${dayLabel} — ${focus}: ${blocks[(day - 1) % blocks.length]}`);
  }
  return plan.join('\n');
}

function detectIntent(message: string): string {
  const text = message.toLowerCase().trim();

  if (/(hola|buenas|hey|qué tal|que tal|buenos días|buenas tardes)/.test(text)) {
    return greeting;
  }

  if (/(examen|exámenes|evaluaci[oó]n|test|parcial)/.test(text)) {
    const daysMatch = text.match(/(\d+)\s*(d[ií]as|d[ií]a)/);
    const days = daysMatch ? Math.min(Math.max(parseInt(daysMatch[1], 10), 1), 7) : 3;
    return `Para preparar un examen en ${days} días, te sugiero este plan de estudio:\n\n${buildStudyPlan(days)}\n\nConsejo: reserva los últimos 10 minutos de cada sesión para anotar lo que aún no dominas. ¿Quieres que lo adaptemos a una materia concreta?`;
  }

  if (/(horario|agenda|organizar|organizaci[oó]n|semana|planificar|planifica)/.test(text)) {
    return 'Para organizar tu semana escolar te recomiendo este enfoque:\n\n• Lunes a miércoles: clases + bloques de 45 min de estudio por la tarde.\n• Jueves: repaso ligero y descanso activo.\n• Viernes: cerrar tareas pendientes antes del fin de semana.\n• Fin de semana: una sesión de repaso el sábado y descanso el domingo.\n\n¿Quieres que te haga un horario detallado con horas concretas?';
  }

  if (/(distrac|concentraci[oó]n|atenci[oó]n|m[eé]vil|tel[eé]fono|estudiar y no puedo|procrastin)/.test(text)) {
    return 'Para concentrarte mejor al estudiar:\n\n• Activa el modo no molestar y deja el móvil en otra habitación.\n• Usa la técnica Pomodoro: 25 min de estudio + 5 min de descanso.\n• Estudia en un lugar fijo, con buena luz y sin ruido.\n• Empieza siempre por lo más difícil, cuando tienes más energía.\n\n¿Quieres que preparemos juntos un plan de concentración para esta semana?';
  }

  if (/(resum|apuntes|tema|historia|biolog|qu[ií]mica|f[ií]sica|literatura|lengua|matem|geograf)/.test(text)) {
    return 'Para resumir un tema largo:\n\n1. Lee una vez completa sin parar a memorizar.\n2. Subraya solo las ideas clave (máximo 3 por párrafo).\n3. Escribe el resumen con tus palabras, sin copiar.\n4. Haz un esquema visual o mapa mental.\n5. Explícalo en voz alta como si enseñaras a alguien.\n\n¿De qué materia es el tema y cuánto tienes que resumir?';
  }

  if (/(proyecto|grupal|grupo|equipo|repartir|asignar|trabajo en grupo)/.test(text)) {
    return 'Para un proyecto en grupo:\n\n• Reúnanse 10 minutos para definir el objetivo y las partes.\n• Repartan según fortalezas de cada uno (investigación, redacción, diseño, exposición).\n• Fijen una fecha límite interna 2 días antes de la entrega.\n• Usen un documento compartido y un canal de chat solo para el proyecto.\n• Reserven una sesión final para unir y revisar todo.\n\n¿Quieres que te ayude a repartir tareas concretas?';
  }

  if (/(tarea|tareas|deberes|entrega|entregar)/.test(text)) {
    return 'Para no perderte con las tareas:\n\n• Anota cada tarea con su fecha de entrega el mismo día que te la encargan.\n• Ordena por fecha y por peso en la nota.\n• Empieza siempre por la más urgente o la que más pesa.\n• Divide las grandes en pasos pequeños (investigar, redactar, revisar).\n\n¿Quieres que organicemos tus tareas pendientes ahora mismo?';
  }

  if (/(gracias|genial|perfecto|excelente|ok|vale)/.test(text)) {
    return pickRandom([
      '¡De nada! Aquí estaré cuando quieras seguir organizando. ¿Hay algo más en lo que pueda ayudarte?',
      '¡Perfecto! Si necesitas ajustar el plan más adelante, solo dímelo. ¿Seguimos con otra tarea?',
      '¡Me alegra ayudar! ¿Quieres que lo convirtamos en tareas dentro de tu planificador?',
    ]);
  }

  return fallback;
}

export function generateAssistantReply(userMessage: string): string {
  const reply = detectIntent(userMessage);
  return reply;
}

export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

export const initialAssistantMessage = createMessage('assistant', greeting);
