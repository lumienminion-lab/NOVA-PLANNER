export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  time: string;
};

export const newsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Chicas del 5to año de secundaria se preparan para sus viajes de promoción, mientras que los profesores experimentan reuniones exhaustivas por el aniversario',
    summary: 'Las estudiantes de quinto año organizan los últimos detalles de su viaje de promoción mientras el cuerpo docente se reúne para coordinar las actividades del aniversario institucional.',
    image: 'https://images.pexels.com/photos/32001518/pexels-photo-32001518.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Estudiantes',
    time: 'Hace 2 horas',
  },
  {
    id: 'news-2',
    title: 'Profesores se reúnen para planificar las actividades del aniversario escolar',
    summary: 'El equipo docente lleva a cabo sesiones de trabajo para coordinar los eventos conmemorativos del aniversario de la institución.',
    image: 'https://images.pexels.com/photos/10498800/pexels-photo-10498800.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Docentes',
    time: 'Hace 5 horas',
  },
  {
    id: 'news-3',
    title: 'Estudiantes de quinto año ultiman detalles para su viaje de promoción',
    summary: 'Los alumnos de quinto año de secundaria se preparan con entusiasmo para su viaje de promoción, coordinando itinerarios y actividades.',
    image: 'https://images.pexels.com/photos/32001516/pexels-photo-32001516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Estudiantes',
    time: 'Ayer',
  },
];

export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  totalPages: number;
  currentPage: number;
};

export const books: Book[] = [
  { id: 'book-1', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', cover: 'https://images.pexels.com/photos/19969897/pexels-photo-19969897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 65, totalPages: 863, currentPage: 561 },
  { id: 'book-2', title: 'Cien años de soledad', author: 'Gabriel García Márquez', cover: 'https://images.pexels.com/photos/19208445/pexels-photo-19208445.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 42, totalPages: 471, currentPage: 198 },
  { id: 'book-3', title: 'La casa de los espíritus', author: 'Isabel Allende', cover: 'https://images.pexels.com/photos/33866461/pexels-photo-33866461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 88, totalPages: 454, currentPage: 399 },
  { id: 'book-4', title: 'El principito', author: 'Antoine de Saint-Exupéry', cover: 'https://images.pexels.com/photos/14458893/pexels-photo-14458893.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 100, totalPages: 96, currentPage: 96 },
  { id: 'book-5', title: 'Rayuela', author: 'Julio Cortázar', cover: 'https://images.pexels.com/photos/19905625/pexels-photo-19905625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 23, totalPages: 736, currentPage: 169 },
  { id: 'book-6', title: 'Crónica de una muerte anunciada', author: 'Gabriel García Márquez', cover: 'https://images.pexels.com/photos/31918147/pexels-photo-31918147.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', progress: 0, totalPages: 120, currentPage: 0 },
];

export type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
};

export const contacts: Contact[] = [
  { id: 'contact-1', name: 'Sofía Ramírez', avatar: 'SR', lastMessage: '¿Ya terminaste la tarea de matemáticas?', time: '10:32', unread: 2 },
  { id: 'contact-2', name: 'Carlos Mendoza', avatar: 'CM', lastMessage: 'Nos reunimos en la biblioteca a las 3', time: '09:15', unread: 0 },
  { id: 'contact-3', name: 'Valeria Torres', avatar: 'VT', lastMessage: 'Te envié el resumen de historia', time: 'Ayer', unread: 1 },
  { id: 'contact-4', name: 'Diego Herrera', avatar: 'DH', lastMessage: '¿Vamos a la presentación del viernes?', time: 'Ayer', unread: 0 },
  { id: 'contact-5', name: 'Andrea López', avatar: 'AL', lastMessage: 'Gracias por ayudarme con el proyecto', time: 'Lun', unread: 0 },
];
