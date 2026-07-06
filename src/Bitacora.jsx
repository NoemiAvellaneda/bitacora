import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "./supabase.js";
import {
  User, Briefcase, Heart, Home, Users, Dumbbell, BookOpen,
  Library, Plus, Trash2, Check, Circle, ChevronLeft, ChevronRight, PenLine,
  Brain, Coins, BookMarked, Scale, Sparkles, FlaskConical, Leaf, RefreshCw,
  Film, Ticket, Plane, Feather, Landmark, SlidersHorizontal, Music, Sprout, Globe, Network, Map, Lightbulb, Bike, Download, Upload,
  Wind, Droplet, Smile, Activity, Eye, Footprints,
} from "lucide-react";

/* ───────────────────────── paletas ───────────────────────── */
const C_MINT = {
  bg: "#C2E0E1",
  bgDeep: "#0C2C47",
  surface: "#FFFFFF",
  surfaceAlt: "#FFFFFF",
  border: "#BFD1CD",
  text: "#0C2C47",
  textSoft: "#3A4F66",
  textMuted: "#6A7A8A",
  onBg: "#0C2C47",
  onBgDim: "#2C4257",
  primary: "#0C2C47",
  primaryDark: "#071F35",
  primarySoft: "#DCE3EB",
  accent: "#BF512C",
  accentSoft: "#F2DDD2",
  spark: "#DA9B2B",
  sparkSoft: "#F6E9CE",
  onPrimary: "#FFFFFF",
  onSpark: "#0C2C47",
  tranquilo: "#2E5749",
  atencion: "#BC8A22",
  urgente: "#BF512C",
};
const C_CACTUS = {
  bg: "#F3E4D8",
  bgDeep: "#33503D",
  surface: "#FCF7F1",
  surfaceAlt: "#FCF7F1",
  border: "#E0CBB6",
  text: "#334A39",
  textSoft: "#5C6E59",
  textMuted: "#8B8475",
  onBg: "#334A39",
  onBgDim: "#52654F",
  primary: "#3E6B4F",
  primaryDark: "#2F5540",
  primarySoft: "#DCE7DC",
  accent: "#C0703D",
  accentSoft: "#F2DDCB",
  spark: "#D89A4E",
  sparkSoft: "#F6E7CF",
  onPrimary: "#FFFFFF",
  onSpark: "#334A39",
  tranquilo: "#3E6B4F",
  atencion: "#C58A3D",
  urgente: "#BB532B",
};
const C_BRUMA = {
  bg: "#EFEAD6",
  bgDeep: "#3E4A63",
  surface: "#FCFBF6",
  surfaceAlt: "#FCFBF6",
  border: "#E3DCC6",
  text: "#3B4660",
  textSoft: "#5C667E",
  textMuted: "#8B8C90",
  onBg: "#3B4660",
  onBgDim: "#525C73",
  primary: "#566285",
  primaryDark: "#454F6E",
  primarySoft: "#DDE1EA",
  accent: "#977C8F",
  accentSoft: "#E9DEE6",
  spark: "#CFBE63",
  sparkSoft: "#F1ECCC",
  onPrimary: "#FFFFFF",
  onSpark: "#3B4660",
  tranquilo: "#7E9A86",
  atencion: "#C2A24E",
  urgente: "#B5786C",
};
const C_CIELO = {
  bg: "#DCE8F1",
  bgDeep: "#2C3E55",
  surface: "#FCFDFF",
  surfaceAlt: "#FCFDFF",
  border: "#CBDAE6",
  text: "#2E4257",
  textSoft: "#52677C",
  textMuted: "#85929F",
  onBg: "#2E4257",
  onBgDim: "#46596E",
  primary: "#4E6E92",
  primaryDark: "#3C5A78",
  primarySoft: "#DBE6F0",
  accent: "#3E8290",
  accentSoft: "#D7E8E9",
  spark: "#D7B560",
  sparkSoft: "#F3EBCE",
  onPrimary: "#FFFFFF",
  onSpark: "#2E4257",
  tranquilo: "#458C7E",
  atencion: "#C2982F",
  urgente: "#C0674C",
};

const C_SALVIA = {
  bg: "#D4E5DC",
  bgDeep: "#2C4A3A",
  surface: "#F4FAF6",
  surfaceAlt: "#F4FAF6",
  border: "#B8CCC0",
  text: "#2A3D33",
  textSoft: "#4A6055",
  textMuted: "#7A9085",
  onBg: "#2A3D33",
  onBgDim: "#426050",
  primary: "#2C4A3A",
  primaryDark: "#1E3528",
  primarySoft: "#D4E5DC",
  accent: "#C07A5A",
  accentSoft: "#F0DDD3",
  spark: "#C8A24A",
  sparkSoft: "#F0E6C8",
  onPrimary: "#FFFFFF",
  onSpark: "#2A3D33",
  tranquilo: "#3E7A5E",
  atencion: "#BE9040",
  urgente: "#B8603A",
};

const AREA_MINT = {
  personal:  { color: "#0C2C47", soft: "#D7DEE6" },
  laboral:   { color: "#2E5749", soft: "#D5E0DB" },
  pareja:    { color: "#BF512C", soft: "#F2DDD2" },
  familia:   { color: "#C2901F", soft: "#F5E8CB" },
  amigos:    { color: "#A98E86", soft: "#ECE3DF" },
  ejercicio: { color: "#2F7E74", soft: "#D3E6E2" },
  lectura:   { color: "#6F8A6F", soft: "#E4EBE0" },
};
const AREA_CACTUS = {
  personal:  { color: "#3E6B4F", soft: "#DCE7DC" },
  laboral:   { color: "#6F7C4E", soft: "#E6E9D7" },
  pareja:    { color: "#C0703D", soft: "#F2DDCB" },
  familia:   { color: "#C58A3D", soft: "#F2E4C9" },
  amigos:    { color: "#A87C66", soft: "#ECE0D7" },
  ejercicio: { color: "#5E8268", soft: "#DEE9E0" },
  lectura:   { color: "#7C8B5E", soft: "#E7EAD9" },
};
const FALLBACK_MINT = { color: "#3A5A74", soft: "#DCE4EC" };
const FALLBACK_CACTUS = { color: "#5A7560", soft: "#E1E8E0" };
const AREA_BRUMA = {
  personal:  { color: "#566285", soft: "#DEE1EA" },
  laboral:   { color: "#7E9A86", soft: "#E2EAE2" },
  pareja:    { color: "#A8758A", soft: "#EEE0E6" },
  familia:   { color: "#BE9A48", soft: "#F0E8CD" },
  amigos:    { color: "#B0857A", soft: "#EEE2DC" },
  ejercicio: { color: "#5E9091", soft: "#DCEAEA" },
  lectura:   { color: "#8487B0", soft: "#E4E4EF" },
};
const FALLBACK_BRUMA = { color: "#7C84A0", soft: "#E3E5EE" };
const AREA_CIELO = {
  personal:  { color: "#3C5A78", soft: "#D6E1EC" },
  laboral:   { color: "#3E8290", soft: "#D7E8E9" },
  pareja:    { color: "#C07B66", soft: "#F0DFD8" },
  familia:   { color: "#C2982F", soft: "#F1E8C9" },
  amigos:    { color: "#7E8CC0", soft: "#E2E4F1" },
  ejercicio: { color: "#458C7E", soft: "#D6E9E4" },
  lectura:   { color: "#6E89A6", soft: "#DEE6EF" },
};
const FALLBACK_CIELO = { color: "#5E768E", soft: "#DEE6EE" };
const AREA_SALVIA = {
  personal:  { color: "#2C4A3A", soft: "#D4E5DC" },
  laboral:   { color: "#4A6A57", soft: "#D8E6DE" },
  pareja:    { color: "#C07A5A", soft: "#F0DDD3" },
  familia:   { color: "#C8A24A", soft: "#F0E6C8" },
  amigos:    { color: "#9A8878", soft: "#EDE5DE" },
  ejercicio: { color: "#3A7A63", soft: "#D3E9E1" },
  lectura:   { color: "#6A8A7A", soft: "#DEE9E3" },
};
const FALLBACK_SALVIA = { color: "#5A7A6A", soft: "#DEE9E3" };

const ICONS = {
  personal: User, laboral: Briefcase, pareja: Heart, familia: Home,
  amigos: Users, ejercicio: Dumbbell, lectura: BookOpen, default: Circle,
};

// colecciones especializadas
const COLLECTIONS = [
  { id: "libros", name: "Libros", icon: BookOpen, areaId: "lectura", statuses: ["Por leer", "Leyendo", "Leído"], tipos: ["Narrativa", "Ensayo", "Poesía", "Crónica"], ph: "Título del libro…", meta: "Autor o autora", note: "Una reflexión, o una cita que te haya gustado…" },
  { id: "peliculas", name: "Películas", icon: Film, areaId: "personal", statuses: ["Por ver", "Vista"], tipos: ["Ficción", "Documental"], ph: "Película…", meta: "Dirección (opcional)", note: "Qué te pareció…" },
  { id: "teatro", name: "Teatro", icon: Ticket, areaId: "personal", statuses: ["Por ver", "Vista"], ph: "Obra de teatro…", meta: "Lugar o compañía (opcional)", note: "Qué te pareció…" },
  { id: "conciertos", name: "Conciertos", icon: Music, areaId: "personal", statuses: ["Por ir", "Fui"], ph: "Artista o concierto…", meta: "Lugar o fecha (opcional)", note: "Cómo estuvo…" },
  { id: "viajes", name: "Viajes", icon: Plane, areaId: "personal", statuses: ["Idea", "Planeado", "Hecho"], ph: "¿A dónde?", note: "Notas del viaje (opcional)…" },
  { id: "cuaderno", name: "Cuaderno", icon: Feather, areaId: "lectura", statuses: [], ph: "Título (opcional)", note: "Escribe aquí. Sin apuro, sin que tenga que ser bueno." },
];
const COLL = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));

const HABITOS = [
  { id: "respiracion", label: "Respiración fisiológica ×5", icon: Wind },
  { id: "agua", label: "Un vaso de agua", icon: Droplet },
  { id: "gratitud", label: "Agradecer algo bueno", icon: Heart },
  { id: "mandibula", label: "Soltar la mandíbula", icon: Smile },
  { id: "estirar", label: "Estirar / elongar el cuerpo", icon: Activity },
  { id: "plantas", label: "Revisar mis plantas", icon: Sprout },
  { id: "ojos", label: "Pausa para los ojos: mirar lejos", icon: Eye },
  { id: "caminar", label: "Levantarse y caminar un poco", icon: Footprints },
];
const statusColor = (coll, status) => {
  if (!coll.statuses.length) return C.textMuted;
  const i = coll.statuses.indexOf(status);
  if (i === coll.statuses.length - 1) return C.tranquilo;
  if (i <= 0) return C.textMuted;
  return C.atencion;
};

// categorías del dato del día
const CAT = {
  filosofia: { label: "Filosofía", color: "#0C2C47", icon: Brain },
  economia:  { label: "Economía", color: "#C2901F", icon: Coins },
  libros:    { label: "Libros", color: "#6F8A6F", icon: BookMarked },
  ddhh:      { label: "Derechos humanos", color: "#BF512C", icon: Scale },
  genero:    { label: "Género", color: "#234A66", icon: Sparkles },
  ciencia:   { label: "Ciencia", color: "#2F7E74", icon: FlaskConical },
  biologia:  { label: "Biología", color: "#2E5749", icon: Leaf },
  literatura:{ label: "Literatura", color: "#345A78", icon: BookOpen },
  poesia:    { label: "Poesía", color: "#A98E86", icon: Feather },
  cine:      { label: "Cine", color: "#B5532F", icon: Film },
  historia:  { label: "Historia", color: "#6F7C50", icon: Landmark },
  plantas:   { label: "Plantas", color: "#3E7E5C", icon: Sprout },
  antropologia: { label: "Antropología", color: "#9A7B43", icon: Users },
  sociologia: { label: "Sociología", color: "#3A5A74", icon: Network },
  rrii:      { label: "Relaciones internacionales", color: "#2F6E72", icon: Globe },
  geografia: { label: "Geografía", color: "#2C6E66", icon: Map },
  critico:   { label: "Pensamiento crítico", color: "#BF512C", icon: Lightbulb },
};

// datos curados y verificados, uno por día
const DATOS = [
  { cat: "filosofia", t: "El velo de la ignorancia propone diseñar una sociedad justa sin saber qué lugar ocuparás tú en ella.", f: "John Rawls, Teoría de la justicia" },
  { cat: "filosofia", t: "Para Arendt, el mal más grave no nace de monstruos, sino de la incapacidad de pensar lo que se hace.", f: "Hannah Arendt" },
  { cat: "filosofia", t: "La paradoja de la tolerancia: una sociedad tolerante sin límites termina destruida por los intolerantes.", f: "Karl Popper" },
  { cat: "filosofia", t: "Sócrates no dejó nada escrito; todo lo que sabemos de él llegó por Platón y otros discípulos." },
  { cat: "filosofia", t: "El mito de la caverna sugiere que lo que tomamos por realidad pueden ser solo sombras proyectadas.", f: "Platón" },
  { cat: "filosofia", t: "Actúa solo según una norma que quisieras ver convertida en ley universal.", f: "Kant, imperativo categórico" },
  { cat: "filosofia", t: "Para los estoicos, no controlamos lo que pasa, solo cómo respondemos a ello.", f: "Epicteto" },
  { cat: "economia", t: "Simon Kuznets, que ayudó a crear el PIB, advirtió que jamás debía confundirse con el bienestar de un país." },
  { cat: "economia", t: "El coeficiente de Gini mide la desigualdad: 0 es igualdad total y 1, que una sola persona lo tenga todo." },
  { cat: "economia", t: "La 'mano invisible' aparece una sola vez en toda La riqueza de las naciones.", f: "Adam Smith" },
  { cat: "economia", t: "El costo de oportunidad es lo que renuncias al elegir: toda decisión tiene un precio invisible." },
  { cat: "economia", t: "La paradoja del valor: el agua, vital, vale poco; el diamante, prescindible, vale mucho.", f: "Adam Smith" },
  { cat: "economia", t: "El 'efecto Veblen': algunos bienes se desean más justamente porque son caros." },
  { cat: "economia", t: "Chile es uno de los países más desiguales de la OCDE según el coeficiente de Gini." },
  { cat: "libros", t: "Don Quijote salió en dos partes; entre ambas apareció una falsa que Cervantes respondió dentro de la suya." },
  { cat: "libros", t: "Rayuela puede leerse en orden lineal o saltando capítulos según un tablero de dirección.", f: "Julio Cortázar" },
  { cat: "libros", t: "Borges imaginó una biblioteca infinita con todos los libros posibles, incluso los aún no escritos.", f: "La biblioteca de Babel" },
  { cat: "libros", t: "La Biblioteca de Alejandría no ardió en un día: se fue perdiendo durante siglos por varios factores." },
  { cat: "libros", t: "El Ulises transcurre en un solo día, el 16 de junio, hoy celebrado como Bloomsday.", f: "James Joyce" },
  { cat: "libros", t: "Mary Shelley empezó Frankenstein con apenas 18 años, en un reto entre amigos para escribir historias de miedo." },
  { cat: "libros", t: "Con solo dos libros, Juan Rulfo marcó para siempre a García Márquez y al realismo mágico." },
  { cat: "ddhh", t: "La Declaración Universal de Derechos Humanos (1948) tiene 30 artículos y nació tras el horror de la guerra." },
  { cat: "ddhh", t: "Eleanor Roosevelt presidió la comisión que redactó la Declaración Universal de Derechos Humanos." },
  { cat: "ddhh", t: "El principio de no devolución prohíbe expulsar a alguien a un país donde su vida corra peligro." },
  { cat: "ddhh", t: "El primer artículo de la Declaración Universal: todos nacemos libres e iguales en dignidad y derechos." },
  { cat: "ddhh", t: "El derecho al descanso y al tiempo libre está reconocido en la misma Declaración Universal.", f: "artículo 24" },
  { cat: "ddhh", t: "Chile reconoce en su Constitución el derecho a vivir en un medio ambiente libre de contaminación." },
  { cat: "genero", t: "En 1791 Olympe de Gouges escribió la Declaración de los Derechos de la Mujer; murió en la guillotina." },
  { cat: "genero", t: "No se nace mujer: se llega a serlo.", f: "Simone de Beauvoir, El segundo sexo" },
  { cat: "genero", t: "En Chile, las mujeres votaron por primera vez en una elección presidencial en 1952." },
  { cat: "genero", t: "El 'techo de cristal' nombra la barrera invisible que frena el ascenso de las mujeres en el trabajo." },
  { cat: "genero", t: "Las mujeres realizan la mayor parte del trabajo de cuidado no remunerado del mundo.", f: "OIT" },
  { cat: "genero", t: "Ada Lovelace escribió el primer algoritmo pensado para una máquina, un siglo antes de los computadores." },
  { cat: "ciencia", t: "La luz del Sol que ves ahora tardó unos ocho minutos en llegar hasta ti." },
  { cat: "ciencia", t: "En el espacio no hay sonido: sin aire, las ondas no tienen por dónde viajar." },
  { cat: "ciencia", t: "Hay más estrellas en el universo observable que granos de arena en todas las playas de la Tierra." },
  { cat: "ciencia", t: "Un día en Venus dura más que su año: gira sobre sí mismo más lento de lo que orbita al Sol." },
  { cat: "ciencia", t: "Los átomos están casi vacíos: si el núcleo fuera una pelota, los electrones estarían a cuadras." },
  { cat: "ciencia", t: "El cerebro consume cerca de un quinto de tu energía aunque pesa apenas un 2% de tu cuerpo." },
  { cat: "biologia", t: "Los pulpos tienen tres corazones y sangre azul: transportan oxígeno con cobre, no con hierro." },
  { cat: "biologia", t: "Los tardígrados sobreviven a la radiación, la congelación y hasta el vacío del espacio." },
  { cat: "biologia", t: "Los flamencos nacen grises y se vuelven rosados por los pigmentos de lo que comen." },
  { cat: "biologia", t: "La lengua de una ballena azul puede pesar tanto como un elefante." },
  { cat: "biologia", t: "Las estrellas de mar no tienen cerebro ni sangre, y aun así se mueven y cazan." },
  { cat: "biologia", t: "Compartimos cerca de la mitad de nuestros genes con los plátanos: la vida reutiliza sus piezas." },
  { cat: "biologia", t: "Las abejas se comunican bailando: la forma del baile indica dónde está el alimento.", f: "Karl von Frisch" },
  { cat: "literatura", t: "Gabriela Mistral fue la primera persona de América Latina en ganar el Nobel de Literatura, en 1945." },
  { cat: "literatura", t: "Para terminar Cien años de soledad, la familia de García Márquez empeñó objetos de la casa." },
  { cat: "literatura", t: "El 'boom latinoamericano' de los años 60 llevó a Cortázar, Vargas Llosa y Fuentes a lectores de todo el mundo." },
  { cat: "literatura", t: "Roberto Bolaño dejó casi terminada 2666 al morir; se publicó al año siguiente y se volvió un clásico." },
  { cat: "literatura", t: "Isabel Allende debutó con La casa de los espíritus, hoy traducida a más de cuarenta idiomas." },
  { cat: "literatura", t: "La crónica latinoamericana mezcla periodismo y literatura: contar lo real con herramientas de novela." },
  { cat: "poesia", t: "Nicanor Parra propuso la 'antipoesía': bajar el poema del pedestal al lenguaje de todos los días." },
  { cat: "poesia", t: "Vicente Huidobro fundó el creacionismo: el poeta no copia el mundo, inventa uno nuevo." },
  { cat: "poesia", t: "Pablo Neruda recibió el Nobel en 1971; sus tres casas en Chile hoy son museos." },
  { cat: "poesia", t: "El haiku japonés clásico condensa una imagen entera en diecisiete sílabas." },
  { cat: "poesia", t: "Antes de ser célebre, Gabriela Mistral fue maestra rural en el Valle de Elqui." },
  { cat: "cine", t: "El cine empezó documentando la vida real: los hermanos Lumière filmaban escenas cotidianas en 1895." },
  { cat: "cine", t: "Nanook, el esquimal (1922) suele citarse como uno de los primeros largometrajes documentales." },
  { cat: "cine", t: "El chileno Patricio Guzmán lleva décadas filmando la memoria del país, de La batalla de Chile a Nostalgia de la luz." },
  { cat: "cine", t: "El 'efecto Kuleshov' mostró que el montaje cambia el sentido de un mismo rostro." },
  { cat: "cine", t: "Un plano secuencia es una toma sin cortes: rodar una escena entera así es una proeza técnica." },
  { cat: "historia", t: "La expedición de Magallanes cruzó por primera vez en 1520 el estrecho que hoy lleva su nombre." },
  { cat: "historia", t: "La imprenta de Gutenberg, hacia 1450, multiplicó el acceso a los libros en Europa." },
  { cat: "historia", t: "Hipatia de Alejandría fue una reconocida matemática y filósofa de la Antigüedad." },
  { cat: "historia", t: "Chile se extiende por más de 4.000 km: del desierto más árido del mundo a los glaciares del sur." },
  { cat: "historia", t: "La biblioteca personal es un invento antiguo: en Roma, tener una era símbolo de estatus y de ocio culto." },
  { cat: "plantas", t: "Bajo tierra, las plantas se comunican a través de redes de hongos que conectan sus raíces." },
  { cat: "plantas", t: "Las plantas no se alimentan de la tierra: construyen su cuerpo sobre todo con CO₂ del aire y luz." },
  { cat: "plantas", t: "Los helechos ya existían mucho antes que los dinosaurios." },
  { cat: "plantas", t: "La mimosa púdica repliega sus hojas apenas la tocas, como un reflejo." },
  { cat: "plantas", t: "Algunos pinos longevos del planeta superan los cuatro mil años de vida." },
  { cat: "antropologia", t: "La antropología estudia al ser humano en toda su diversidad: cuerpos, culturas, lenguas e historia." },
  { cat: "antropologia", t: "Marcel Mauss mostró que regalar nunca es gratis: el don crea lazos y obligaciones." },
  { cat: "antropologia", t: "Malinowski impulsó el trabajo de campo: convivir largo tiempo con quienes se estudia." },
  { cat: "antropologia", t: "El parentesco no siempre es biológico: muchas sociedades definen la familia por vínculos elegidos." },
  { cat: "antropologia", t: "Para muchas culturas el tiempo no es una línea recta, sino ciclos que se repiten." },
  { cat: "sociologia", t: "Durkheim mostró que hasta algo tan íntimo como el suicidio sigue patrones sociales." },
  { cat: "sociologia", t: "Bourdieu llamó 'capital cultural' al saber y los gustos que se heredan como ventaja." },
  { cat: "sociologia", t: "Para Weber, no solo la economía mueve la historia: también las ideas y las creencias." },
  { cat: "sociologia", t: "El 'efecto Mateo': quien ya tiene ventajas tiende a acumular todavía más." },
  { cat: "sociologia", t: "El 'hecho social' de Durkheim: normas que existen fuera del individuo y lo moldean." },
  { cat: "rrii", t: "La soberanía de los Estados modernos suele rastrearse a la Paz de Westfalia, en 1648." },
  { cat: "rrii", t: "El 'poder blando' es influir por atracción y cultura, no por la fuerza.", f: "Joseph Nye" },
  { cat: "rrii", t: "La ONU se fundó en 1945, tras la Segunda Guerra Mundial, para evitar otra igual." },
  { cat: "rrii", t: "El 'dilema de seguridad': lo que un país hace para protegerse puede asustar a sus vecinos." },
  { cat: "rrii", t: "Chile comparte con Argentina una de las fronteras terrestres más largas del mundo." },
  { cat: "rrii", t: "El derecho de veto en el Consejo de Seguridad de la ONU lo tienen solo cinco países." },
  { cat: "rrii", t: "Suiza recién se unió a la ONU en 2002, fiel a su larga tradición de neutralidad." },
  { cat: "rrii", t: "La Unión Europea nació de un pacto sobre el carbón y el acero, para hacer impensable otra guerra." },
  { cat: "rrii", t: "Un Estado puede existir de hecho sin ser reconocido por otros: el reconocimiento es un acto político." },
  { cat: "rrii", t: "La Antártida se rige por un tratado que la reserva para la ciencia y congela los reclamos de territorio." },
  { cat: "rrii", t: "El 'poder blando' es influir por atracción y cultura, no por la fuerza.", f: "Joseph Nye" },
  { cat: "geografia", t: "Rusia abarca once husos horarios: cuando amanece en un extremo, en el otro ya es de noche." },
  { cat: "geografia", t: "Suecia es el país con más islas del mundo: más de 260 mil." },
  { cat: "geografia", t: "La fosa de las Marianas, el punto más profundo del océano, supera los 10.900 metros." },
  { cat: "geografia", t: "La Antártida es el desierto más grande del planeta: casi no llueve ni nieva allí." },
  { cat: "geografia", t: "El desierto de Atacama, en Chile, es el lugar más árido del mundo fuera de los polos." },
  { cat: "geografia", t: "Estambul se extiende sobre dos continentes, Europa y Asia, separados por el Bósforo." },
  { cat: "geografia", t: "El Everest crece unos milímetros al año por el choque de las placas tectónicas." },
  { cat: "geografia", t: "La Ciudad del Vaticano es el país más pequeño del mundo: cabe en un barrio." },
  { cat: "geografia", t: "Bolivia y Paraguay son los únicos países de Sudamérica sin salida al mar." },
  { cat: "geografia", t: "Canadá tiene más lagos que cualquier otro país: cientos de miles." },
  { cat: "historia", t: "La Gran Muralla China no se ve a simple vista desde el espacio, pese al mito." },
  { cat: "historia", t: "El Imperio Romano de Occidente cayó en el 476, pero el de Oriente duró mil años más." },
  { cat: "historia", t: "La peste negra del siglo XIV se llevó cerca de un tercio de la población de Europa." },
  { cat: "historia", t: "La imprenta, la pólvora y la brújula llegaron a Europa desde China." },
  { cat: "historia", t: "Nueva Zelanda fue el primer país en reconocer el voto femenino, en 1893." },
  { cat: "historia", t: "El muro de Berlín cayó en 1989 y con él se cerró el símbolo de la Guerra Fría." },
  { cat: "antropologia", t: "El kintsugi japonés repara la cerámica rota con oro: la grieta pasa a ser parte de la belleza." },
  { cat: "antropologia", t: "Hay lenguas que no dicen 'izquierda' o 'derecha', sino los puntos cardinales para todo." },
  { cat: "antropologia", t: "El color del luto no es universal: en varias culturas asiáticas se asocia al blanco, no al negro." },
  { cat: "antropologia", t: "En los Andes, el 'ayni' es la reciprocidad hecha norma: hoy por ti, mañana por mí." },
  { cat: "antropologia", t: "La palabra 'tabú' viene del tongano y llegó a Europa con los viajes del capitán Cook." },
  { cat: "critico", t: "El sesgo de confirmación nos hace buscar lo que nos da la razón e ignorar el resto." },
  { cat: "critico", t: "Correlación no es causa: que dos cosas ocurran juntas no significa que una provoque la otra." },
  { cat: "critico", t: "La navaja de Occam sugiere preferir, entre varias, la explicación más simple." },
  { cat: "critico", t: "Una afirmación extraordinaria pide evidencia extraordinaria." },
  { cat: "critico", t: "El 'hombre de paja' es refutar una versión deformada del argumento ajeno, más fácil de tumbar." },
  { cat: "critico", t: "La falacia ad hominem ataca a quien habla en vez de a lo que dice." },
  { cat: "critico", t: "Efecto Dunning-Kruger: mientras menos sabemos de algo, más solemos sobrestimar lo que sabemos." },
  { cat: "filosofia", t: "Para Descartes, la única certeza de la que partir es que, si dudo, pienso; y si pienso, existo." },
  { cat: "filosofia", t: "Nietzsche llamó 'eterno retorno' a imaginar que vivirías tu vida idéntica, una y otra vez, para siempre." },
  { cat: "filosofia", t: "La navaja de Ockham aconseja preferir, entre varias explicaciones, la más simple." },
  { cat: "economia", t: "El dilema del prisionero muestra que dos personas racionales pueden terminar peor por no cooperar." },
  { cat: "economia", t: "El interés compuesto hace crecer el dinero sobre lo ya ganado; por eso el tiempo importa tanto al ahorrar." },
  { cat: "economia", t: "La inflación no encarece todo por igual: golpea más a quien no puede ajustar sus ingresos." },
  { cat: "literatura", t: "Gabriela Mistral fue la primera persona latinoamericana en ganar el Nobel de Literatura, en 1945." },
  { cat: "literatura", t: "El realismo mágico presenta lo extraordinario como algo cotidiano, sin asombro de los personajes." },
  { cat: "poesia", t: "Pablo Neruda publicó 'Veinte poemas de amor y una canción desesperada' a los 19 años." },
  { cat: "poesia", t: "El haiku japonés clásico tiene tres versos y suele evocar una estación del año." },
  { cat: "ciencia", t: "La luz del Sol tarda unos ocho minutos en llegar a la Tierra." },
  { cat: "ciencia", t: "El agua es rara: a diferencia de casi todo, su forma sólida —el hielo— flota sobre la líquida." },
  { cat: "biologia", t: "Los pulpos tienen tres corazones y sangre azulada por el cobre que transporta su oxígeno." },
  { cat: "biologia", t: "En tu cuerpo conviven billones de bacterias, casi tantas como tus propias células." },
  { cat: "historia", t: "El Muro de Berlín cayó en 1989, tras 28 años dividiendo la ciudad." },
  { cat: "historia", t: "La imprenta de Gutenberg, en el siglo XV, hizo que los libros dejaran de copiarse a mano uno por uno." },
  { cat: "geografia", t: "Chile mide más de 4.000 km de norte a sur, pero en promedio apenas unos 180 km de ancho." },
  { cat: "geografia", t: "El desierto de Atacama es el más árido del mundo; hay zonas donde casi nunca llueve." },
  { cat: "rrii", t: "El 'poder blando' es influir por atracción cultural o por valores, no por la fuerza.", f: "Joseph Nye" },
  { cat: "rrii", t: "La ONU se fundó en 1945, tras la Segunda Guerra Mundial, para tratar de evitar otro conflicto global." },
  { cat: "genero", t: "Marie Curie fue la primera persona en ganar dos premios Nobel: en física y en química." },
  { cat: "genero", t: "La 'doble jornada' nombra el trabajo remunerado más el doméstico que muchas mujeres asumen a la vez." },
  { cat: "antropologia", t: "El estudio del 'don' muestra que regalar crea vínculos y obligaciones de reciprocidad.", f: "Marcel Mauss" },
  { cat: "sociologia", t: "La 'profecía autocumplida' ocurre cuando una creencia, por sí sola, provoca que se haga realidad.", f: "Robert Merton" },
  { cat: "plantas", t: "Muchas plantas se comunican bajo tierra mediante redes de hongos que conectan sus raíces." },
  { cat: "plantas", t: "Regar de más mata más plantas de interior que la falta de agua." },
  { cat: "cine", t: "El orden de los planos puede cambiar el sentido de una escena: es el 'efecto Kuleshov'." },
  { cat: "critico", t: "El sesgo de confirmación nos lleva a buscar datos que nos dan la razón e ignorar los que no." },
  { cat: "critico", t: "Correlación no es causalidad: que dos cosas ocurran juntas no significa que una cause la otra." },
];
const dayOfYear = (d = new Date()) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);

const CONSIGNAS = [
  "Describe un objeto de tu infancia en cinco líneas.",
  "Anota una conversación que escuchaste hoy en la calle o el transporte.",
  "Escribe sobre un lugar de tu ciudad como si se lo contaras a alguien que nunca estuvo.",
  "Empieza con «Nadie sabe que…» y sigue.",
  "Describe el último sueño que recuerdes, aunque sea solo un fragmento.",
  "Haz el retrato de alguien sin decir su nombre ni cómo se ve.",
  "¿Qué olor te devuelve a otra época? Escríbelo.",
  "Cuenta un día cualquiera como si fuera el último de algo.",
  "Escribe una carta que no vas a enviar.",
  "Toma una noticia de hoy y cuéntala desde alguien que aparece al fondo.",
  "Anota tres cosas que viste hoy y que casi nadie habría mirado.",
  "Empieza con «Cuando dejé de…» y deja que avance.",
  "Escribe sobre el mar sin usar la palabra mar.",
  "Recuerda una comida y a quién tenías al lado.",
  "Describe a un desconocido que se te haya quedado en la memoria.",
  "Escribe el comienzo de una crónica sobre tu barrio.",
];

const FRASES = [
  "Lo que se nombra, se puede cuidar.",
  "Un día a la vez, pero todos los días.",
  "No tienes que hacerlo todo hoy. Solo algo.",
  "La constancia pesa más que la intensidad.",
  "Mirar con atención ya es una forma de cuidado.",
  "Las cosas pequeñas, sostenidas, son una vida.",
  "Avanzar despacio sigue siendo avanzar.",
  "Hoy basta con presentarte.",
  "Lo importante rara vez es urgente; por eso hay que buscarlo.",
  "Aprender algo nuevo le cambia el ánimo al día.",
  "Deja escrito lo que no quieres olvidar.",
  "Vuelve a lo que te importa, aunque sea un rato.",
  "Escribir dos líneas también es escribir.",
];

const DEFAULT_AREAS = [
  { id: "personal", name: "Personal", importance: 4, kind: "vida" },
  { id: "laboral", name: "Laboral", importance: 3, kind: "trabajo" },
  { id: "pareja", name: "Pareja", importance: 5, kind: "vida" },
  { id: "familia", name: "Familia", importance: 4, kind: "vida" },
  { id: "amigos", name: "Amigos", importance: 4, kind: "vida" },
  { id: "ejercicio", name: "Ejercicio", importance: 3, kind: "vida" },
  { id: "lectura", name: "Lectura", importance: 3, kind: "vida" },
];

const PLANTILLA_FIN = {
  ingresos: [{ concepto: "Sueldo" }, { concepto: "Otro ingreso" }],
  egresos: [
    { concepto: "Arriendo" },
    { concepto: "Teléfono" },
    { concepto: "Salud" },
    { concepto: "Deporte" },
    { concepto: "Efectivo" },
    { concepto: "Gastos compartidos" },
    { concepto: "Transferencia familiar" },
    { concepto: "Otros" },
  ],
  deudas: [
    { concepto: "Tarjeta nacional" },
    { concepto: "Tarjeta internacional" },
    { concepto: "Línea de crédito" },
    { concepto: "Dividendo" },
  ],
};

const STORE_KEY = "bitacora:estado:v1";
const ACTUALIZADO = "14 de junio de 2026";
const DAY_NAMES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

/* ───────────────────────── helpers ───────────────────────── */
const now = () => new Date();
const dayMs = 86400000;
const daysBetween = (iso) => {
  if (!iso) return null;
  const d = Math.floor((now() - new Date(iso)) / dayMs);
  return d < 0 ? 0 : d;
};
const AREA_POOL_MINT = [
  { color: "#0C2C47", soft: "#D7DEE6" }, // navy
  { color: "#2E5749", soft: "#D5E0DB" }, // verde
  { color: "#BF512C", soft: "#F2DDD2" }, // naranja
  { color: "#C2901F", soft: "#F5E8CB" }, // amarillo
  { color: "#A98E86", soft: "#ECE3DF" }, // mauve
  { color: "#2F7E74", soft: "#D3E6E2" }, // teal
  { color: "#6F8A6F", soft: "#E4EBE0" }, // salvia
  { color: "#3A5A74", soft: "#DCE4EC" }, // azul acero
  { color: "#6F7C50", soft: "#E6E9DB" }, // oliva
  { color: "#2C6E66", soft: "#D2E6E2" }, // teal profundo
  { color: "#C2693F", soft: "#F4DFD3" }, // terracota claro
  { color: "#8E7A86", soft: "#E8E0E4" }, // ciruela suave
];
const AREA_POOL_CACTUS = [
  { color: "#3E6B4F", soft: "#DCE7DC" },
  { color: "#6F7C4E", soft: "#E6E9D7" },
  { color: "#C0703D", soft: "#F2DDCB" },
  { color: "#C58A3D", soft: "#F2E4C9" },
  { color: "#A87C66", soft: "#ECE0D7" },
  { color: "#5E8268", soft: "#DEE9E0" },
  { color: "#7C8B5E", soft: "#E7EAD9" },
  { color: "#4F6E57", soft: "#DCE6DD" },
  { color: "#9A6B43", soft: "#EBDDCC" },
  { color: "#5E8C7E", soft: "#DCEAE5" },
  { color: "#B5603A", soft: "#F1DBCC" },
  { color: "#8E7A5E", soft: "#E8E1D3" },
];
const AREA_POOL_BRUMA = [
  { color: "#566285", soft: "#DEE1EA" },
  { color: "#7E9A86", soft: "#E2EAE2" },
  { color: "#A8758A", soft: "#EEE0E6" },
  { color: "#BE9A48", soft: "#F0E8CD" },
  { color: "#B0857A", soft: "#EEE2DC" },
  { color: "#5E9091", soft: "#DCEAEA" },
  { color: "#8487B0", soft: "#E4E4EF" },
  { color: "#977C8F", soft: "#E9DEE6" },
  { color: "#6E8AA0", soft: "#E0E7ED" },
  { color: "#8E9A6E", soft: "#E7EBDC" },
  { color: "#A88F6A", soft: "#EDE6D5" },
  { color: "#7E8896", soft: "#E4E6EA" },
];
const AREA_POOL_CIELO = [
  { color: "#3C5A78", soft: "#D6E1EC" },
  { color: "#3E8290", soft: "#D7E8E9" },
  { color: "#C07B66", soft: "#F0DFD8" },
  { color: "#C2982F", soft: "#F1E8C9" },
  { color: "#7E8CC0", soft: "#E2E4F1" },
  { color: "#458C7E", soft: "#D6E9E4" },
  { color: "#6E89A6", soft: "#DEE6EF" },
  { color: "#5079A0", soft: "#DBE6F0" },
  { color: "#8C7AA6", soft: "#E6E1EE" },
  { color: "#4E9A93", soft: "#D8ECEA" },
  { color: "#A87E6A", soft: "#EDE2D9" },
  { color: "#6C90B0", soft: "#DEE8F1" },
];

const AREA_POOL_SALVIA = [
  { color: "#2C4A3A", soft: "#D4E5DC" },
  { color: "#4A6A57", soft: "#D8E6DE" },
  { color: "#C07A5A", soft: "#F0DDD3" },
  { color: "#C8A24A", soft: "#F0E6C8" },
  { color: "#9A8878", soft: "#EDE5DE" },
  { color: "#3A7A63", soft: "#D3E9E1" },
  { color: "#6A8A7A", soft: "#DEE9E3" },
  { color: "#5A6A7A", soft: "#DDE4EC" },
  { color: "#7A8A5A", soft: "#E6EBD8" },
  { color: "#4A7A78", soft: "#D5E9E8" },
  { color: "#A87060", soft: "#EEE0DB" },
  { color: "#7A6A5A", soft: "#E8E2D9" },
];

// paletas disponibles + variables vivas (la raíz las reasigna según la elegida)
const PALETTES = {
  mint:   { name: "Mint & Navy", C: C_MINT,   AREA: AREA_MINT,   FALLBACK: FALLBACK_MINT,   POOL: AREA_POOL_MINT },
  cactus: { name: "Cactus",      C: C_CACTUS, AREA: AREA_CACTUS, FALLBACK: FALLBACK_CACTUS, POOL: AREA_POOL_CACTUS },
  bruma:  { name: "Bruma",       C: C_BRUMA,  AREA: AREA_BRUMA,  FALLBACK: FALLBACK_BRUMA,  POOL: AREA_POOL_BRUMA },
  cielo:  { name: "Cielo",       C: C_CIELO,  AREA: AREA_CIELO,  FALLBACK: FALLBACK_CIELO,  POOL: AREA_POOL_CIELO },
  salvia: { name: "Salvia",      C: C_SALVIA, AREA: AREA_SALVIA, FALLBACK: FALLBACK_SALVIA, POOL: AREA_POOL_SALVIA },
};
const PAL_ORDER = ["mint", "cactus", "bruma", "cielo", "salvia"];
let PAL_KEY = "mint";
let C = C_MINT, AREA = AREA_MINT, FALLBACK = FALLBACK_MINT, AREA_POOL = AREA_POOL_MINT, S, CSS;
function applyPalette(key) {
  PAL_KEY = PALETTES[key] ? key : "mint";
  const P = PALETTES[PAL_KEY];
  C = P.C; AREA = P.AREA; FALLBACK = P.FALLBACK; AREA_POOL = P.POOL;
  S = makeS(C); CSS = makeCSS(C);
}
const AREA_DYN = {};
const A = (id) => AREA[id] || AREA_DYN[id] || FALLBACK;
const tint = (id) => A(id).color;
const soft = (id) => A(id).soft;
const iconFor = (id) => ICONS[id] || ICONS.default;
const toleranceDays = (imp) => (6 - imp) * 3;
const rid = () => Math.random().toString(36).slice(2);

const dateKey = (d) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
function startOfWeek(offset = 0) {
  const d = now();
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}
const weekDays = (offset) => {
  const s = startOfWeek(offset);
  return Array.from({ length: 7 }, (_, i) => new Date(s.getTime() + i * dayMs));
};
const fmtCLP = (n) => "$" + Math.round(n || 0).toLocaleString("es-CL");
const monthKeyOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const CADENCIAS = [["Cada mes", 30], ["Cada 3 meses", 90], ["Cada 6 meses", 180], ["Cada año", 365]];
const cadLabel = (d) => ({ 30: "cada mes", 90: "cada 3 meses", 180: "cada 6 meses", 365: "cada año" }[d] || `cada ${d} días`);
const goalRef = (g) => g.lastPush || g.createdAt;
const goalDue = (g) => { if (g.done) return false; const d = daysBetween(goalRef(g)); return d !== null && d > g.cadence; };

function attentionHealth(lastIso, imp) {
  const d = daysBetween(lastIso);
  if (d === null) return 0;
  return Math.max(0, Math.min(1, 1 - d / (toleranceDays(imp) * 1.6)));
}
function statusOf(lastIso, imp) {
  const t = toleranceDays(imp);
  const d = daysBetween(lastIso);
  if (d === null) return { key: "none", label: "Sin registro", color: C.textMuted };
  if (d > t * 1.6) return { key: "bad", label: "Descuidada", color: C.urgente };
  if (d > t) return { key: "warn", label: "Pendiente", color: C.atencion };
  return { key: "ok", label: "Al día", color: C.tranquilo };
}

/* ───────────────────────── storage (Supabase, por usuario) ───────────────────────── */
async function loadState() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("app_state").select("data").eq("user_id", user.id).maybeSingle();
    if (error) { console.error(error); return null; }
    return data ? data.data : null;
  } catch (e) { console.error(e); return null; }
}
async function saveState(s) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("app_state").upsert({ user_id: user.id, data: s, updated_at: new Date().toISOString() });
    if (error) console.error(error);
  } catch (e) { console.error("No se pudo guardar", e); }
}

/* ───────────────────────── plantita ───────────────────────── */
const PLANT_STAGES = [0, 1, 3, 6, 10, 15];
const plantStage = (n) => { let s = 0; for (let i = 0; i < PLANT_STAGES.length; i++) if (n >= PLANT_STAGES[i]) s = i; return s; };
const STAGE_WORDS = ["semilla", "brote", "creciendo", "frondosa", "con botón", "en flor"];
const CITAS_PLANTA = [
  { t: "El mejor momento para plantar un árbol fue hace veinte años; el segundo es hoy.", f: "Proverbio" },
  { t: "Entre cada dos pinos hay una puerta hacia un mundo nuevo.", f: "John Muir" },
  { t: "Los árboles son poemas que la tierra escribe en el cielo.", f: "Khalil Gibran" },
  { t: "Si tienes un jardín y una biblioteca, lo tienes todo.", f: "Cicerón" },
  { t: "Demos las gracias a quienes nos hacen florecer el alma.", f: "Marcel Proust" },
  { t: "La naturaleza no se apura, y sin embargo todo se cumple.", f: "Lao Tse" },
  { t: "Adopta el paso de la naturaleza: su secreto es la paciencia.", f: "Ralph Waldo Emerson" },
  { t: "Planta un árbol bajo cuya sombra no esperas sentarte.", f: "Proverbio" },
  { t: "Fui al bosque porque quería vivir con intención.", f: "Henry D. Thoreau" },
  { t: "La gratitud es la memoria del corazón.", f: "Proverbio" },
  { t: "Quien siembra con paciencia, cosecha con alegría.", f: "Proverbio" },
];
function Planta({ stage }) {
  const leafA = C.tranquilo;
  const leafB = C.primaryDark;
  const pot = C.accent;
  const potDk = C.primaryDark;
  const band = C.sparkSoft;
  const bloom = C.spark;
  const bud = C.sparkSoft;
  const bloomCtr = C.primary;

  const leaf = (x, y, ang, h, key) => {
    const w = h * 0.44;
    return (
      <g key={key} transform={`translate(${x} ${y}) rotate(${ang})`}>
        <path d={`M0 0 C ${w} ${-h*0.38} ${w} ${-h*0.86} 0 ${-h} C ${-w} ${-h*0.86} ${-w} ${-h*0.38} 0 0 Z`} fill={leafA} />
        <line x1="0" y1="-2" x2="0" y2={-(h-3)} stroke={leafB} strokeWidth="0.6" strokeOpacity="0.28" />
      </g>
    );
  };

  const stemTops = [94, 88, 80, 68, 58, 58];
  const stemTop = stemTops[stage] ?? 94;
  const allLeaves = [];
  if (stage >= 1) allLeaves.push(leaf(60, 88, 0, 15, "c"));
  if (stage >= 2) { allLeaves.push(leaf(51, 82, -30, 18, "l1")); allLeaves.push(leaf(69, 82, 30, 18, "r1")); }
  if (stage >= 3) { allLeaves.push(leaf(43, 73, -50, 21, "l2")); allLeaves.push(leaf(77, 73, 50, 21, "r2")); }
  if (stage >= 4) { allLeaves.push(leaf(60, 60, 0, 28, "top")); allLeaves.push(leaf(37, 67, -62, 19, "l3")); allLeaves.push(leaf(83, 67, 62, 19, "r3")); }

  return (
    <svg viewBox="0 0 120 140" width="110" height="128" role="img" aria-label="Plantita" style={{ display: "block", flexShrink: 0 }}>
      {stage === 0 && <ellipse cx="60" cy="92" rx="3.5" ry="2.2" fill={leafA} opacity="0.65" />}
      {stage >= 1 && <line x1="60" y1="94" x2="60" y2={stemTop} stroke={leafA} strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.65" />}
      {allLeaves}
      {stage === 4 && <circle cx="60" cy={stemTop - 5} r="5.5" fill={bud} stroke={bloom} strokeWidth="1.2" />}
      {stage >= 5 && (
        <g transform={`translate(60 ${stemTop - 5})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-8.5" rx="5.2" ry="8.5" fill={bloom} transform={`rotate(${a})`} opacity="0.92" />
          ))}
          <circle cx="0" cy="0" r="5" fill={bloomCtr} />
          <circle cx="0" cy="0" r="2.2" fill={bloom} opacity="0.55" />
        </g>
      )}
      <ellipse cx="60" cy="133" rx="25" ry="4" fill={potDk} opacity="0.25" />
      <path d="M45 103 L75 103 L71 129 Q71 133 67 133 L53 133 Q49 133 49 129 Z" fill={pot} />
      <path d="M60 103 L75 103 L71 129 Q71 133 67 133 L60 133 Z" fill={potDk} opacity="0.12" />
      <path d="M46.5 111 L73.5 111 L72.2 120 L47.8 120 Z" fill={band} opacity="0.88" />
      {[0,1,2,3,4].map((i) => <circle key={i} cx={51+i*4.6} cy="115.5" r="1.4" fill={potDk} opacity="0.38" />)}
      <rect x="42" y="96" width="36" height="10" rx="3.5" fill={pot} />
      <rect x="42" y="96" width="36" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.2" />
      <rect x="42" y="103.5" width="36" height="2.5" fill={potDk} opacity="0.15" />
      <ellipse cx="60" cy="97" rx="15" ry="3.3" fill={potDk} opacity="0.72" />
    </svg>
  );
}

/* ───────────────────────── anillo ───────────────────────── */
function Gauge({ health, days, color, size = 64 }) {
  const r = size / 2 - 5, circ = 2 * Math.PI * r, off = circ * (1 - health);
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)" }} />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Spline Sans Mono', monospace" fontSize="17" fontWeight="500" fill={C.text}>
        {days === null ? "—" : days}
      </text>
      <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Spline Sans Mono', monospace" fontSize="8" fill={C.textSoft} letterSpacing="1">
        {days === null ? "" : days === 1 ? "DÍA" : "DÍAS"}
      </text>
    </svg>
  );
}

/* ───────────────────────── datos ciclo ───────────────────────── */
const DATOS_CICLO = [
  { id: 1,   cat: "Ciclo",              texto: "El ciclo menstrual se cuenta desde el primer día de sangrado (día 1) hasta el día antes del siguiente sangrado." },
  { id: 2,   cat: "Ciclo",              texto: "Un ciclo 'típico' dura en promedio 28 días, pero cualquier duración entre 21 y 35 días se considera normal en adultas." },
  { id: 3,   cat: "Ciclo",              texto: "La menstruación suele durar entre 2 y 7 días; fuera de ese rango conviene consultar." },
  { id: 4,   cat: "Ciclo",              texto: "La pérdida de sangre en una regla normal es de unos 30 a 50 ml en total: bastante menos de lo que parece." },
  { id: 5,   cat: "Ciclo",              texto: "Perder más de 80 ml por regla, o tener que cambiar protección cada 1-2 horas, se considera sangrado abundante (menorragia) y merece revisión." },
  { id: 6,   cat: "Ciclo",              texto: "Es normal que la duración de tu ciclo varíe algunos días de un mes a otro; la regularidad perfecta es la excepción, no la regla." },
  { id: 7,   cat: "Ciclo",              texto: "La sangre menstrual está compuesta por sangre, tejido del endometrio, mucosa y células: no es 'sangre sucia' ni toxinas." },
  { id: 8,   cat: "Ciclo",              texto: "El color de la sangre puede ir de rojo brillante a café oscuro según la velocidad del flujo; el café suele ser sangre más antigua, no algo malo." },
  { id: 9,   cat: "Ciclo",              texto: "Pequeños coágulos ocasionales son normales; coágulos grandes y frecuentes pueden indicar un sangrado excesivo." },
  { id: 10,  cat: "Ciclo",              texto: "La primera menstruación (menarquia) suele llegar entre los 10 y 15 años, con un promedio cercano a los 12." },
  { id: 11,  cat: "Ciclo",              texto: "En los primeros años tras la menarquia los ciclos suelen ser irregulares mientras el sistema hormonal madura." },
  { id: 12,  cat: "Ciclo",              texto: "La menopausia (12 meses seguidos sin regla) ocurre en promedio alrededor de los 51 años." },
  { id: 13,  cat: "Ciclo",              texto: "La perimenopausia, con ciclos y síntomas cambiantes, puede empezar años antes, a veces ya en los 40." },
  { id: 14,  cat: "Ciclo",              texto: "Una persona tiene aproximadamente 400 a 500 menstruaciones a lo largo de su vida fértil." },
  { id: 15,  cat: "Ciclo",              texto: "El endometrio es el recubrimiento del útero que se engrosa cada ciclo y se desprende como menstruación si no hay embarazo." },
  { id: 16,  cat: "Hormonas",           texto: "Cuatro hormonas dirigen el ciclo: estrógeno, progesterona, FSH y LH." },
  { id: 17,  cat: "Hormonas",           texto: "La FSH (hormona folículo-estimulante) impulsa el crecimiento de los folículos en el ovario al inicio del ciclo." },
  { id: 18,  cat: "Hormonas",           texto: "Un pico de LH (hormona luteinizante) desencadena la ovulación, unas 24 a 36 horas después de comenzar a subir." },
  { id: 19,  cat: "Hormonas",           texto: "El estrógeno domina la primera mitad del ciclo y ayuda a engrosar el endometrio." },
  { id: 20,  cat: "Hormonas",           texto: "La progesterona domina la segunda mitad y prepara al útero para un posible embarazo." },
  { id: 21,  cat: "Hormonas",           texto: "Si no hay embarazo, el estrógeno y la progesterona caen, y esa caída dispara la menstruación." },
  { id: 22,  cat: "Hormonas",           texto: "La caída hormonal premenstrual explica buena parte de los cambios de ánimo, energía y sueño de esos días." },
  { id: 23,  cat: "Hormonas",           texto: "Las hormonas del ciclo también influyen en la piel, la libido, el apetito y la temperatura corporal." },
  { id: 24,  cat: "Hormonas",           texto: "Los anticonceptivos hormonales funcionan, en general, suprimiendo la ovulación mediante hormonas sintéticas." },
  { id: 25,  cat: "Hormonas",           texto: "El sangrado que aparece con muchas píldoras anticonceptivas es un 'sangrado por deprivación', no una menstruación real." },
  { id: 26,  cat: "Fases",              texto: "El ciclo se divide en cuatro fases: menstrual, folicular, ovulatoria y lútea." },
  { id: 27,  cat: "Fases",              texto: "Fase menstrual: los días de sangrado; suele coincidir con la energía más baja del ciclo." },
  { id: 28,  cat: "Fases",              texto: "Fase folicular: tras la regla sube el estrógeno y muchas personas notan más energía y mejor ánimo." },
  { id: 29,  cat: "Fases",              texto: "Fase ovulatoria: en torno a la ovulación, con un pico de estrógeno y a veces mayor libido." },
  { id: 30,  cat: "Fases",              texto: "Fase lútea: tras ovular sube la progesterona; en sus últimos días aparecen los síntomas premenstruales." },
  { id: 31,  cat: "Fases",              texto: "La fase folicular puede variar bastante en duración entre personas y entre ciclos." },
  { id: 32,  cat: "Fases",              texto: "La fase lútea es más constante: suele durar entre 11 y 14 días." },
  { id: 33,  cat: "Fases",              texto: "Saber en qué fase estás ayuda a anticipar tu energía y a planificar según eso." },
  { id: 34,  cat: "Fertilidad",         texto: "La ovulación es la liberación de un óvulo por el ovario, normalmente una vez por ciclo." },
  { id: 35,  cat: "Fertilidad",         texto: "La ovulación NO siempre cae en el día 14; ocurre unos 12 a 14 días antes de la SIGUIENTE regla, así que se mueve según tu ciclo." },
  { id: 36,  cat: "Fertilidad",         texto: "El óvulo vive solo unas 12 a 24 horas tras la ovulación." },
  { id: 37,  cat: "Fertilidad",         texto: "Los espermatozoides pueden sobrevivir hasta 5 días dentro del cuerpo en condiciones favorables." },
  { id: 38,  cat: "Fertilidad",         texto: "La 'ventana fértil' abarca unos 6 días: los 5 previos a la ovulación más el día de la ovulación." },
  { id: 39,  cat: "Fertilidad",         texto: "Cerca de la ovulación, el moco cervical se vuelve transparente, elástico y resbaloso, parecido a clara de huevo." },
  { id: 40,  cat: "Fertilidad",         texto: "La temperatura basal del cuerpo sube levemente (unos 0,3 a 0,5 °C) después de ovular, por efecto de la progesterona." },
  { id: 41,  cat: "Fertilidad",         texto: "Algunas personas sienten un leve dolor en un costado al ovular; se conoce como 'Mittelschmerz'." },
  { id: 42,  cat: "Fertilidad",         texto: "Sí es posible quedar embarazada durante la regla, sobre todo con ciclos cortos: el semen puede seguir vivo cuando ovulas." },
  { id: 43,  cat: "Fertilidad",         texto: "Existen ciclos 'anovulatorios' en que hay sangrado pero no hubo ovulación; son más comunes en la adolescencia y la perimenopausia." },
  { id: 44,  cat: "Fertilidad",         texto: "Un tracker de ciclo es una guía de autoconocimiento, no un método anticonceptivo ni de fertilidad confiable por sí solo." },
  { id: 45,  cat: "Fertilidad",         texto: "La fertilidad femenina desciende de forma gradual con la edad, más marcadamente después de los 35." },
  { id: 46,  cat: "Síntomas",           texto: "El síndrome premenstrual (SPM) reúne síntomas físicos y emocionales en los días previos a la regla; es real y de base hormonal." },
  { id: 47,  cat: "Síntomas",           texto: "Síntomas comunes del SPM: hinchazón, sensibilidad en las mamas, irritabilidad, cansancio, antojos y cambios de ánimo." },
  { id: 48,  cat: "Síntomas",           texto: "El trastorno disfórico premenstrual (TDPM) es una forma severa del SPM, con síntomas emocionales intensos que afectan la vida diaria." },
  { id: 49,  cat: "Síntomas",           texto: "El TDPM afecta a una minoría (alrededor del 3 a 8% de quienes menstrúan) y merece atención médica, no minimizarse." },
  { id: 50,  cat: "Síntomas",           texto: "Los cólicos (dismenorrea) se deben a unas sustancias llamadas prostaglandinas que hacen contraerse al útero." },
  { id: 51,  cat: "Síntomas",           texto: "El calor local, el movimiento suave y ciertos analgésicos ayudan con los cólicos; un dolor que te incapacita no es 'normal' y conviene consultarlo." },
  { id: 52,  cat: "Síntomas",           texto: "Los dolores de cabeza o migrañas ligados a la caída de estrógeno son frecuentes justo antes o durante la regla." },
  { id: 53,  cat: "Síntomas",           texto: "Es normal notar cambios en la digestión durante la regla, incluidas deposiciones más blandas, por efecto de las prostaglandinas." },
  { id: 54,  cat: "Síntomas",           texto: "La libido puede subir o bajar según la fase; muchas personas notan un alza cerca de la ovulación." },
  { id: 55,  cat: "Síntomas",           texto: "El sueño puede alterarse en la fase lútea por la progesterona y los cambios de temperatura corporal." },
  { id: 56,  cat: "Síntomas",           texto: "Registrar tus síntomas por varios ciclos te ayuda, a ti y a tu médica, a distinguir lo habitual de lo que requiere estudio." },
  { id: 57,  cat: "Salud",              texto: "La endometriosis, tejido similar al endometrio creciendo fuera del útero, afecta a alrededor del 10% de las mujeres en edad fértil." },
  { id: 58,  cat: "Salud",              texto: "El dolor menstrual muy intenso puede ser señal de endometriosis y suele diagnosticarse con años de retraso: no lo normalices." },
  { id: 59,  cat: "Salud",              texto: "El síndrome de ovario poliquístico (SOP) afecta a cerca del 8 a 13% y puede causar ciclos irregulares, acné y aumento de vello." },
  { id: 60,  cat: "Salud",              texto: "Los miomas (fibromas) son tumores benignos del útero que pueden provocar sangrados abundantes." },
  { id: 61,  cat: "Salud",              texto: "La amenorrea es la ausencia de menstruación; puede deberse a embarazo, estrés, cambios de peso, ejercicio intenso o causas médicas." },
  { id: 62,  cat: "Salud",              texto: "Perder la regla por comer muy poco o entrenar en exceso (amenorrea hipotalámica) es una señal de alarma para la salud, no un logro." },
  { id: 63,  cat: "Salud",              texto: "Los sangrados abundantes recurrentes son una causa frecuente de anemia por falta de hierro en mujeres." },
  { id: 64,  cat: "Salud",              texto: "El sangrado entre reglas, después del sexo o tras la menopausia siempre debe consultarse." },
  { id: 65,  cat: "Salud",              texto: "Algunas infecciones y desequilibrios de la tiroides pueden alterar el ciclo." },
  { id: 66,  cat: "Salud",              texto: "El estrés crónico afecta al eje hormonal y puede atrasar o suprimir la ovulación." },
  { id: 67,  cat: "Salud",              texto: "El Papanicolau y los controles ginecológicos periódicos son clave en la salud de la mujer, más allá del ciclo." },
  { id: 68,  cat: "Salud",              texto: "El autoexamen y los controles de mama ayudan a detectar cambios a tiempo." },
  { id: 69,  cat: "Salud",              texto: "Una regla que cambia bruscamente de patrón sin causa clara merece una consulta médica." },
  { id: 70,  cat: "Salud",              texto: "Llevar registro de tus ciclos es información valiosa que puedes mostrar en la consulta para un mejor diagnóstico." },
  { id: 71,  cat: "Mitos",              texto: "Mito: no puedes quedar embarazada durante la regla. Realidad: es menos probable, pero posible." },
  { id: 72,  cat: "Mitos",              texto: "Mito: la ovulación siempre es el día 14. Realidad: depende del largo de tu ciclo y puede variar." },
  { id: 73,  cat: "Mitos",              texto: "Mito: los ciclos de mujeres que conviven se 'sincronizan'. La evidencia sólida no respalda esa idea." },
  { id: 74,  cat: "Mitos",              texto: "Mito: no deberías hacer ejercicio con la regla. Realidad: el movimiento suele aliviar los cólicos y mejorar el ánimo." },
  { id: 75,  cat: "Mitos",              texto: "Mito: no puedes nadar con la regla. Realidad: con copa, tampón o disco puedes hacerlo sin problema." },
  { id: 76,  cat: "Mitos",              texto: "Mito: usar tampón 'quita la virginidad'. Realidad: la virginidad no es un estado físico verificable y un tampón no la afecta." },
  { id: 77,  cat: "Mitos",              texto: "Mito: la sangre menstrual es sucia o tóxica. Realidad: es tejido y sangre normales del cuerpo." },
  { id: 78,  cat: "Mitos",              texto: "Mito: el SPM 'es puro invento' o exageración. Realidad: tiene base hormonal comprobada." },
  { id: 79,  cat: "Mitos",              texto: "Mito: tener la regla te 'debilita' y no deberías esforzarte. Realidad: puedes seguir tu vida normal según cómo te sientas." },
  { id: 80,  cat: "Mitos",              texto: "Mito: si tu ciclo no es de 28 días exactos, algo anda mal. Realidad: el rango normal es amplio." },
  { id: 81,  cat: "Mitos",              texto: "Mito: el dolor menstrual severo es normal y hay que aguantarlo. Realidad: un dolor que te incapacita debe estudiarse." },
  { id: 82,  cat: "Mitos",              texto: "Mito: la menstruación se puede 'aguantar' o retener a voluntad. Realidad: es un proceso involuntario." },
  { id: 83,  cat: "Autocuidado",        texto: "Dormir bien regula las hormonas y suele suavizar los síntomas del ciclo." },
  { id: 84,  cat: "Autocuidado",        texto: "La actividad física regular se asocia a cólicos más leves y mejor ánimo premenstrual." },
  { id: 85,  cat: "Autocuidado",        texto: "Mantener una buena hidratación puede reducir la sensación de hinchazón." },
  { id: 86,  cat: "Autocuidado",        texto: "Los alimentos ricos en hierro (legumbres, hojas verdes, carnes) ayudan a reponer lo que se pierde con el sangrado." },
  { id: 87,  cat: "Autocuidado",        texto: "La vitamina C mejora la absorción del hierro de origen vegetal." },
  { id: 88,  cat: "Autocuidado",        texto: "Reducir cafeína y alcohol en los días previos puede ayudar con la irritabilidad y el sueño de algunas personas." },
  { id: 89,  cat: "Autocuidado",        texto: "El calor local (guatero o bolsa caliente) es de los remedios más efectivos y simples para los cólicos." },
  { id: 90,  cat: "Autocuidado",        texto: "Técnicas de manejo del estrés, como la respiración o caminar, ayudan a regular el eje hormonal." },
  { id: 91,  cat: "Autocuidado",        texto: "Registrar tu ánimo y energía por fase te permite planificar las tareas exigentes para cuando sueles tener más impulso." },
  { id: 92,  cat: "Autocuidado",        texto: "No existe una 'dieta del ciclo' mágica: la constancia en sueño, movimiento y alimentación variada rinde más que las modas." },
  { id: 93,  cat: "Productos",          texto: "Existen muchas opciones: toallas, tampones, copa menstrual, disco menstrual y ropa interior absorbente." },
  { id: 94,  cat: "Productos",          texto: "La copa menstrual es reutilizable, puede durar años y se puede usar hasta unas 12 horas antes de vaciarla." },
  { id: 95,  cat: "Productos",          texto: "Los tampones no deben dejarse más de 8 horas por el riesgo (raro pero serio) de síndrome de shock tóxico." },
  { id: 96,  cat: "Productos",          texto: "Ante fiebre alta, vómitos y erupción usando tampón, retíralo y busca atención médica: pueden ser señales de shock tóxico." },
  { id: 97,  cat: "Productos",          texto: "La ropa interior menstrual es cómoda y reutilizable, buena como respaldo o para flujo leve a medio." },
  { id: 98,  cat: "Productos",          texto: "Elegir producto es personal: depende de tu flujo, comodidad, presupuesto y consideraciones ambientales." },
  { id: 99,  cat: "Productos",          texto: "Las opciones reutilizables (copa, ropa interior) reducen los residuos frente a las desechables." },
  { id: 100, cat: "Productos",          texto: "Cambiar la protección con regularidad y lavarse las manos previene irritaciones e infecciones." },
  { id: 101, cat: "Cultura y derechos", texto: "La 'pobreza menstrual' es la falta de acceso a productos, higiene o información para menstruar con dignidad; afecta a millones en el mundo." },
  { id: 102, cat: "Cultura y derechos", texto: "En muchos países se ha debatido eliminar el impuesto a los productos menstruales, conocido como 'impuesto rosa' o 'tampon tax'." },
  { id: 103, cat: "Cultura y derechos", texto: "La equidad menstrual busca que menstruar no sea una barrera para estudiar, trabajar o participar." },
  { id: 104, cat: "Cultura y derechos", texto: "Durante siglos, distintos tabúes culturales rodearon la menstruación con silencio y vergüenza." },
  { id: 105, cat: "Cultura y derechos", texto: "Hablar abiertamente del ciclo es relativamente reciente y sigue siendo un tema de salud pública y de género." },
  { id: 106, cat: "Cultura y derechos", texto: "La investigación médica históricamente excluyó a las mujeres de muchos estudios, dejando vacíos en la salud femenina." },
  { id: 107, cat: "Cultura y derechos", texto: "El dolor de las mujeres ha sido subestimado por la medicina, lo que retrasa diagnósticos como el de la endometriosis." },
  { id: 108, cat: "Cultura y derechos", texto: "La educación menstrual temprana, para todos los géneros, reduce el estigma y mejora la salud." },
  { id: 109, cat: "Cultura y derechos", texto: "El acceso a información confiable sobre el propio cuerpo es un componente de la autonomía y los derechos de las mujeres." },
  { id: 110, cat: "Cultura y derechos", texto: "Conocer tu ciclo es una forma de autoconocimiento y de recuperar el relato sobre tu propio cuerpo." },
];
const DATOS_CICLO_CATS = ["Todas", "Ciclo", "Hormonas", "Fases", "Fertilidad", "Síntomas", "Salud", "Mitos", "Autocuidado", "Productos", "Cultura y derechos"];

/* ───────────────────────── ciclo constantes registro ───────────────────────── */
const FLUJO_OPS = ["sin sangrado", "leve", "medio", "abundante"];
const SINTOMAS_OPS = ["cólicos", "dolor de cabeza", "hinchazón", "sensibilidad mamaria", "fatiga", "irritabilidad", "náuseas", "lumbalgia", "manchado"];
const ANIMO_LABELS = ["muy bajo", "bajo", "neutro", "bueno", "muy bueno"];
const ENERGIA_LABELS = ["agotada", "baja", "normal", "buena", "alta"];

const WHEEL_C = { menstrual: "#C25A7A", folicular: "#4BC4BC", ovulatoria: "#C8A24A", lutea: "#2C92B8", ring: "#B8CCC0" };
const arcPath = (cx, cy, ro, ri, startDeg, endDeg) => {
  const r = (d) => (d - 90) * Math.PI / 180;
  const x1 = cx + ro * Math.cos(r(startDeg)), y1 = cy + ro * Math.sin(r(startDeg));
  const x2 = cx + ro * Math.cos(r(endDeg)),   y2 = cy + ro * Math.sin(r(endDeg));
  const x3 = cx + ri * Math.cos(r(endDeg)),   y3 = cy + ri * Math.sin(r(endDeg));
  const x4 = cx + ri * Math.cos(r(startDeg)), y4 = cy + ri * Math.sin(r(startDeg));
  const lg = (endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${ro} ${ro} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 ${lg} 0 ${x4} ${y4} Z`;
};

/* ───────────────────────── ciclo helpers ───────────────────────── */
const cicloAddDays = (isoDate, n) => {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + n);
  return dateKey(d);
};
const cicloPeriodStarts = (diasRegla) => {
  if (!diasRegla || diasRegla.length === 0) return [];
  const sorted = [...diasRegla].sort();
  const starts = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((new Date(sorted[i] + "T12:00:00") - new Date(sorted[i - 1] + "T12:00:00")) / 86400000);
    if (diff > 1) starts.push(sorted[i]);
  }
  return starts;
};
const cicloAvgLen = (starts) => {
  if (!starts || starts.length < 2) return null;
  const recent = starts.slice(-Math.min(7, starts.length));
  const diffs = [];
  for (let i = 1; i < recent.length; i++)
    diffs.push(Math.round((new Date(recent[i] + "T12:00:00") - new Date(recent[i - 1] + "T12:00:00")) / 86400000));
  return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
};
const cicloLastPeriodLen = (diasRegla, starts) => {
  if (!starts || starts.length === 0 || !diasRegla || diasRegla.length === 0) return 5;
  const lastStart = starts[starts.length - 1];
  const sorted = [...diasRegla].filter((d) => d >= lastStart).sort();
  let len = 0;
  for (const d of sorted) {
    const diff = Math.round((new Date(d + "T12:00:00") - new Date(lastStart + "T12:00:00")) / 86400000);
    if (diff === len) len++; else break;
  }
  return Math.max(len, 1);
};
const cicloDayNum = (lastStart) => {
  if (!lastStart) return null;
  const diff = Math.round((new Date(dateKey(now()) + "T12:00:00") - new Date(lastStart + "T12:00:00")) / 86400000);
  return diff >= 0 ? diff + 1 : null;
};
const FASES_CICLO = [
  { id: "menstrual",  label: "Menstrual",  c: "#B8603A", desc: "Inicio del ciclo · energía más baja, introspección." },
  { id: "folicular",  label: "Folicular",  c: "#3E7A5E", desc: "Sube el estrógeno · más energía, claridad y curiosidad." },
  { id: "ovulatoria", label: "Ovulatoria", c: "#C8A24A", desc: "Pico de estrógeno · conexión, comunicación y fuerza." },
  { id: "lutea",      label: "Lútea",      c: "#566285", desc: "Sube la progesterona · calma, introspección y detalle." },
];
const cicloPhase = (cycleDay, avgLen, lastPeriodLen) => {
  if (!cycleDay || cycleDay < 1) return null;
  const pLen = lastPeriodLen || 5;
  const cLen = avgLen || 28;
  const ovDay = cLen - 14;
  if (cycleDay <= pLen) return "menstrual";
  if (cycleDay < ovDay - 1) return "folicular";
  if (cycleDay <= ovDay + 2) return "ovulatoria";
  return "lutea";
};

/* ───────────────────────── app ───────────────────────── */
function BitacoraApp() {
  const [ready, setReady] = useState(false);
  const [areas, setAreas] = useState(DEFAULT_AREAS);
  const [items, setItems] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [finance, setFinance] = useState({});
  const [savings, setSavings] = useState({ depositos: [], afp: [], apv: [] });
  const [goals, setGoals] = useState([]);
  const [logros, setLogros] = useState(0);
  const [habits, setHabits] = useState({});
  const [tab, setTab] = useState("semana");
  const [pal, setPal] = useState("mint");
  const [plantStart, setPlantStart] = useState(() => new Date().toISOString());
  const [ciclo, setCiclo] = useState({ diasRegla: [] });
  applyPalette(pal);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        const ar = (s.areas || DEFAULT_AREAS).map((a) => ({ ...a, kind: a.kind || (a.id === "laboral" ? "trabajo" : "vida") }));
        setAreas(ar);
        let it = s.items;
        if (!it) {
          const old = s.notes || s.entries || [];
          it = old.map((n) => ({ id: n.id || rid(), coll: "notas", title: n.text || "", meta: "", note: "", status: null, date: n.date || new Date().toISOString() }));
        }
        setItems(it);
        const today = dateKey(now());
        setTasks((s.tasks || []).map((t) =>
          (!t.done && t.day < today)
            ? { ...t, carriedFrom: t.carriedFrom || t.day, day: today }
            : t
        ));
        setFinance(s.finance || {});
        setSavings(s.savings || { depositos: [], afp: [], apv: [] });
        setGoals(s.goals || []);
        setLogros(s.logros || 0);
        setHabits(s.habits || {});
        setPal(s.pal || "mint");
        setPlantStart(s.plantStart || new Date().toISOString());
        setCiclo(s.ciclo || { diasRegla: [] });
      } else {
        await saveState({ areas: DEFAULT_AREAS, items: [], tasks: [], finance: {}, savings: { depositos: [], afp: [], apv: [] }, goals: [], logros: 0, pal: "mint", plantStart: new Date().toISOString() });
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => { if (ready) saveState({ areas, items, tasks, finance, savings, goals, logros, habits, pal, plantStart, ciclo }); }, [areas, items, tasks, finance, savings, goals, logros, habits, pal, plantStart, ciclo, ready]);

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length + goals.filter((g) => g.done).length, [tasks, goals]);
  useEffect(() => { if (ready) setLogros((prev) => Math.max(prev, doneCount)); }, [doneCount, ready]);

  const lastByArea = useMemo(() => {
    const m = {};
    const touch = (id, iso) => { if (id && iso && (!m[id] || iso > m[id])) m[id] = iso; };
    for (const it of items) touch(COLL[it.coll]?.areaId, it.date);
    for (const t of tasks) if (t.done && t.doneAt) touch(t.areaId, t.doneAt);
    return m;
  }, [items, tasks]);

  const weekActivity = useMemo(() => {
    const cut = now() - 7 * dayMs; const m = {};
    for (const t of tasks) if (t.done && t.doneAt && new Date(t.doneAt).getTime() >= cut) m[t.areaId] = (m[t.areaId] || 0) + 1;
    for (const it of items) { const aid = COLL[it.coll]?.areaId; if (aid && new Date(it.date).getTime() >= cut) m[aid] = (m[aid] || 0) + 1; }
    return m;
  }, [tasks, items]);

  const tasksDoneWeek = useMemo(() => {
    const cut = now() - 7 * dayMs;
    return tasks.filter((t) => t.done && t.doneAt && new Date(t.doneAt).getTime() >= cut).length;
  }, [tasks]);

  const itemsWeek = useMemo(() => {
    const cut = now() - 7 * dayMs;
    return items.filter((it) => new Date(it.date).getTime() >= cut).length;
  }, [items]);

  const attention = useMemo(() =>
    areas.map((a) => ({ area: a, st: statusOf(lastByArea[a.id], a.importance) }))
      .filter((x) => x.st.key !== "ok").sort((x, y) => y.area.importance - x.area.importance),
    [areas, lastByArea]);

  const addItem = useCallback((coll, title, status, meta, note) =>
    setItems((p) => [{ id: rid(), coll, title: (title || "").trim(), meta: (meta || "").trim(), note: note || "", status: status ?? null, date: new Date().toISOString() }, ...p]), []);
  const updateItem = useCallback((id, patch) => setItems((p) => p.map((it) => it.id === id ? { ...it, ...patch } : it)), []);
  const delItem = useCallback((id) => setItems((p) => p.filter((it) => it.id !== id)), []);
  const toggleHabit = useCallback((id) => setHabits((p) => {
    const k = dateKey(now());
    const cur = p[k] || [];
    return { ...p, [k]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
  }), []);
  const setFinanceMonth = useCallback((key, data) => setFinance((p) => ({ ...p, [key]: data })), []);
  const savAdd = useCallback((k, row) => setSavings((p) => ({ ...p, [k]: [...(p[k] || []), { id: rid(), ...row }] })), []);
  const savEdit = useCallback((k, id, patch) => setSavings((p) => ({ ...p, [k]: (p[k] || []).map((r) => r.id === id ? { ...r, ...patch } : r) })), []);
  const savDel = useCallback((k, id) => setSavings((p) => ({ ...p, [k]: (p[k] || []).filter((r) => r.id !== id) })), []);
  const addGoal = useCallback((title, areaId, cadence) => setGoals((p) => [{ id: rid(), title: title.trim(), areaId, cadence, lastPush: null, done: false, createdAt: new Date().toISOString() }, ...p]), []);
  const pushGoal = useCallback((id) => setGoals((p) => p.map((g) => g.id === id ? { ...g, lastPush: new Date().toISOString() } : g)), []);
  const doneGoal = useCallback((id) => setGoals((p) => p.map((g) => g.id === id ? { ...g, done: !g.done, lastPush: new Date().toISOString() } : g)), []);
  const delGoal = useCallback((id) => setGoals((p) => p.filter((g) => g.id !== id)), []);
  const addTask = useCallback((day, areaId, text) =>
    setTasks((p) => [...p, { id: rid(), day, areaId, text: text.trim(), done: false, doneAt: null }]), []);
  const toggleTask = useCallback((id) =>
    setTasks((p) => p.map((t) => t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null } : t)), []);
  const delTask = useCallback((id) => setTasks((p) => p.filter((t) => t.id !== id)), []);
  const updateTask = useCallback((id, patch) => setTasks((p) => p.map((t) => t.id === id ? { ...t, ...patch } : t)), []);
  const toggleCicloDay = useCallback((day) => setCiclo((p) => {
    const dias = p.diasRegla || [];
    return { ...p, diasRegla: dias.includes(day) ? dias.filter((d) => d !== day) : [...dias, day] };
  }), []);
  const updateCicloReg = useCallback((reg) => setCiclo((p) => {
    const regs = p.registros || [];
    const idx = regs.findIndex((r) => r.id === reg.id);
    return { ...p, registros: idx >= 0 ? regs.map((r) => r.id === reg.id ? { ...r, ...reg } : r) : [...regs, reg] };
  }), []);
  const delCicloReg = useCallback((id) => setCiclo((p) => ({ ...p, registros: (p.registros || []).filter((r) => r.id !== id) })), []);
  const setImportance = useCallback((id, v) => setAreas((p) => p.map((a) => a.id === id ? { ...a, importance: v } : a)), []);
  const setAreaKind = useCallback((id, kind) => setAreas((p) => p.map((a) => a.id === id ? { ...a, kind } : a)), []);
  const addArea = useCallback((name) => setAreas((p) => {
    const c = AREA_POOL[p.length % AREA_POOL.length];
    return [...p, { id: "x" + rid().slice(0, 5), name: name.trim(), importance: 3, kind: "vida", color: c.color, soft: c.soft }];
  }), []);
  const delArea = useCallback((id) => { setAreas((p) => p.filter((a) => a.id !== id)); setTasks((p) => p.filter((t) => t.areaId !== id)); }, []);

  const fileRef = useRef(null);
  const exportData = () => {
    const data = { areas, items, tasks, finance, savings, goals, logros, habits, pal, plantStart, ciclo, _v: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bitacora-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const importData = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const s = JSON.parse(reader.result);
        if (!s || !s.areas) throw new Error("formato");
        setAreas(s.areas);
        setItems(s.items || []);
        setTasks(s.tasks || []);
        setFinance(s.finance || {});
        setSavings(s.savings || { depositos: [], afp: [], apv: [] });
        setGoals(s.goals || []);
        setLogros(s.logros || 0);
        setHabits(s.habits || {});
        if (s.pal) setPal(s.pal);
        if (s.plantStart) setPlantStart(s.plantStart);
        if (s.ciclo) setCiclo(s.ciclo);
        alert("Respaldo importado correctamente. ✔");
      } catch (e) { alert("No se pudo leer el archivo. ¿Es un respaldo de la Bitácora?"); }
    };
    reader.readAsText(file);
  };

  areas.forEach((a) => { if (a.color) AREA_DYN[a.id] = { color: a.color, soft: a.soft }; });

  if (!ready) {
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Fonts /><div style={{ color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace", fontSize: 13 }}>cargando bitácora…</div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <Fonts /><style>{CSS}</style>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", position: "relative", zIndex: 1 }}>
        <LeftRail />
        <div style={S.wrap}>
        <header style={S.header}>
          <span style={S.logo}><Library size={22} color={C.onPrimary} strokeWidth={1.7} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={S.title}>Bitácora</h1>
            <Saludo />
          </div>
          <button onClick={() => setPal(PAL_ORDER[(PAL_ORDER.indexOf(pal) + 1) % PAL_ORDER.length])} className="navbtn"
            title={`Paleta: ${PALETTES[pal].name} · tocar para cambiar`}
            style={{ ...S.areasBtn, padding: "8px 12px", gap: 5 }}>
            <span style={{ width: 13, height: 13, borderRadius: 13, background: C.primary, border: `1px solid ${C.surface}`, boxShadow: `0 0 0 1px ${C.border}` }} />
            <span style={{ width: 13, height: 13, borderRadius: 13, background: C.accent, border: `1px solid ${C.surface}`, boxShadow: `0 0 0 1px ${C.border}`, marginLeft: -6 }} />
            <span style={{ width: 13, height: 13, borderRadius: 13, background: C.spark, border: `1px solid ${C.surface}`, boxShadow: `0 0 0 1px ${C.border}`, marginLeft: -6 }} />
          </button>
          <button onClick={() => setTab("areas")} className="navbtn"
            style={{ ...S.areasBtn, ...(tab === "areas" ? S.areasBtnOn : {}) }}>
            <SlidersHorizontal size={14} strokeWidth={1.9} /> Áreas
          </button>
        </header>

        <DailySpark />

        <nav style={S.nav}>
          {[["semana", "Semana"], ["registros", "Registros"], ["ciclo", "Ciclo"], ["finanzas", "Finanzas"], ["metas", "Metas"], ["tablero", "Tablero"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="navbtn" style={{ ...S.navBtn, ...(tab === k ? S.navBtnOn : {}) }}>{l}</button>
          ))}
        </nav>

        {tab === "semana" && <Semana areas={areas} tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDel={delTask} onUpdate={updateTask} notes={items.filter((it) => it.coll === "notas")} onAddNote={(t) => addItem("notas", t, null, "")} onDelNote={delItem} habitsToday={habits[dateKey(now())] || []} onToggleHabit={toggleHabit} />}
        {tab === "registros" && <Registros items={items} onAdd={addItem} onUpdate={updateItem} onDel={delItem} />}
        {tab === "tablero" && <Tablero areas={areas} lastByArea={lastByArea} weekActivity={weekActivity}
          attention={attention} finance={finance} savings={savings} goals={goals} tasks={tasks} items={items} logros={logros} plantStart={plantStart} />}
        {tab === "finanzas" && <Finanzas finance={finance} onSetMonth={setFinanceMonth} savings={savings} onSavAdd={savAdd} onSavEdit={savEdit} onSavDel={savDel} />}
        {tab === "metas" && <Metas goals={goals} areas={areas} onAdd={addGoal} onPush={pushGoal} onDone={doneGoal} onDel={delGoal} />}
        {tab === "ciclo" && <Ciclo ciclo={ciclo} onToggleDay={toggleCicloDay} onUpdateReg={updateCicloReg} onDelReg={delCicloReg} />}
        {tab === "areas" && <AreasCfg areas={areas} onImp={setImportance} onKind={setAreaKind} onAdd={addArea} onDel={delArea} />}

        <Paleta />
        <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, margin: "30px 0 16px" }}>
          <span style={{ display: "block", width: 72, height: 5, background: C.spark, borderRadius: 4 }} />
          <span style={{ display: "block", width: 46, height: 3, background: C.primary, borderRadius: 4 }} />
        </div>
        <footer style={S.footer}>
          Bitácora — creada por @noemiavellaneda.<br />
          Hecha con cariño para uso personal. · Última actualización: {ACTUALIZADO}.
        </footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={exportData} className="navbtn" title="Descargar una copia de seguridad de todos tus datos"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.onBgDim, fontSize: 12, cursor: "pointer", fontFamily: "'Spline Sans Mono', monospace" }}>
            <Download size={13} /> exportar respaldo
          </button>
          <button onClick={() => fileRef.current && fileRef.current.click()} className="navbtn" title="Cargar tus datos desde un archivo de respaldo"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.onBgDim, fontSize: 12, cursor: "pointer", fontFamily: "'Spline Sans Mono', monospace" }}>
            <Upload size={13} /> importar respaldo
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }}
            onChange={(e) => { importData(e.target.files[0]); e.target.value = ""; }} />
          <button onClick={() => supabase.auth.signOut()} className="navbtn" title="Cerrar tu sesión"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.onBgDim, fontSize: 12, cursor: "pointer", fontFamily: "'Spline Sans Mono', monospace" }}>
            <Upload size={13} style={{ transform: "rotate(90deg)" }} /> cerrar sesión
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ───────────────────────── CICLO ───────────────────────── */
function Ciclo({ ciclo, onToggleDay, onUpdateReg, onDelReg }) {
  const [calRef, setCalRef] = useState(() => { const d = now(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [datosCat, setDatosCat] = useState("Todas");
  const [datosOffset, setDatosOffset] = useState(0);
  const [editReg, setEditReg] = useState(null);

  const diasRegla = ciclo.diasRegla || [];
  const registros = ciclo.registros || [];
  const todayKey = dateKey(now());

  const starts = cicloPeriodStarts(diasRegla);
  const avgLen = cicloAvgLen(starts);
  const lastStart = starts.length > 0 ? starts[starts.length - 1] : null;
  const lastPeriodLen = cicloLastPeriodLen(diasRegla, starts);
  const cycleDay = cicloDayNum(lastStart);
  const phaseId = cicloPhase(cycleDay, avgLen, lastPeriodLen);
  const phase = phaseId ? FASES_CICLO.find((f) => f.id === phaseId) : null;
  const nextStart = lastStart && avgLen ? cicloAddDays(lastStart, avgLen) : null;
  const ovDay = avgLen ? avgLen - 14 : null;
  const fertileStart = lastStart && ovDay ? cicloAddDays(lastStart, ovDay - 5) : null;
  const fertileEnd = lastStart && ovDay ? cicloAddDays(lastStart, ovDay + 1) : null;

  const regHoy = registros.find((r) => r.fecha === todayKey) || null;
  const newReg = () => setEditReg({ id: rid(), fecha: todayKey, flujo: null, sintomas: [], animo: null, energia: null });
  const saveReg = () => { if (editReg) { onUpdateReg(editReg); setEditReg(null); } };

  const CX = 110, CY = 110, RO = 95, RI = 58, RM = (RO + RI) / 2;
  const cLen = avgLen || 28, pLen = lastPeriodLen || 5, ovD = cLen - 14;
  const menEnd = Math.max((pLen / cLen) * 360, 8);
  const folEnd = Math.max(((ovD - 2) / cLen) * 360, menEnd + 6);
  const ovEnd  = Math.max(((ovD + 2) / cLen) * 360, folEnd + 6);
  const wheelPhases = [
    { key: "menstrual",  start: 0,       end: menEnd,  color: WHEEL_C.menstrual,  label: "Menstrual" },
    { key: "folicular",  start: menEnd,  end: folEnd,  color: WHEEL_C.folicular,  label: "Folicular" },
    { key: "ovulatoria", start: folEnd,  end: ovEnd,   color: WHEEL_C.ovulatoria, label: "Ovulatoria" },
    { key: "lutea",      start: ovEnd,   end: 359.5,   color: WHEEL_C.lutea,      label: "Lútea" },
  ];
  const todayAngle = cycleDay ? ((Math.min(cycleDay - 1, cLen - 1)) / cLen) * 360 : null;
  const wRad = (d) => (d - 90) * Math.PI / 180;

  const calYear = calRef.getFullYear(), calMonth = calRef.getMonth();
  const CAL_DOW = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
  const rowsFor = (ref) => {
    const y = ref.getFullYear(), m = ref.getMonth();
    return Math.ceil(((new Date(y, m, 1).getDay() + 6) % 7 + new Date(y, m + 1, 0).getDate()) / 7);
  };
  const calRows = Math.max(...[new Date(calYear, calMonth - 1, 1), calRef, new Date(calYear, calMonth + 1, 1)].map(rowsFor));
  const renderMonth = (ref) => {
    const y = ref.getFullYear(), m = ref.getMonth();
    const isCurrentMonth = y === now().getFullYear() && m === now().getMonth();
    const fdow = (new Date(y, m, 1).getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < fdow; i++) cells.push(null);
    for (let dn = 1; dn <= new Date(y, m + 1, 0).getDate(); dn++) cells.push(new Date(y, m, dn));
    while (cells.length < calRows * 7) cells.push(null);
    return (
      <div key={`${y}-${m}`} style={{ ...S.calMonth, ...(isCurrentMonth ? S.calMonthCur : S.calMonthOther) }}>
        <div style={S.calMonthTitle}>{ref.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}</div>
        <div style={S.calGrid}>
          {CAL_DOW.map((d, i) => <span key={"h" + i} style={S.calDow}>{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={"b" + i} style={{ aspectRatio: "1 / 1" }} />;
            const k = dateKey(d);
            const isRegla = diasRegla.includes(k), isToday = k === todayKey, isFuture = k > todayKey;
            const hasReg = registros.some((r) => r.fecha === k);
            return (
              <button key={k} onClick={() => !isFuture && onToggleDay(k)} className="navbtn" disabled={isFuture}
                style={{ ...S.calCell, background: isRegla ? C.accent : isToday ? C.sparkSoft : "none",
                  color: isRegla ? C.onPrimary : isFuture ? C.textMuted : isToday ? C.text : C.textSoft,
                  border: isToday ? `1px solid ${C.spark}` : "1px solid transparent",
                  fontWeight: isToday ? 700 : 400, cursor: isFuture ? "default" : "pointer", opacity: isFuture ? 0.25 : 1 }}>
                {d.getDate()}
                {hasReg && <span style={{ position: "absolute", bottom: 1, right: 2, width: 4, height: 4, borderRadius: 4, background: isRegla ? "#fff8" : WHEEL_C.folicular }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const fmtDate = (iso) => iso ? new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long" }) : "—";
  const fmtReg = (r) => {
    const p = [];
    if (r.flujo) p.push(r.flujo);
    if (r.sintomas?.length) p.push(r.sintomas.join(", "));
    if (r.animo) p.push(`ánimo ${r.animo}/5`);
    if (r.energia) p.push(`energía ${r.energia}/5`);
    return p.join(" · ") || "sin detalles";
  };
  const datosFiltrados = datosCat === "Todas" ? DATOS_CICLO : DATOS_CICLO.filter((d) => d.cat === datosCat);
  const datoIdx = (dayOfYear() + datosOffset) % datosFiltrados.length;
  const datoHoy = datosFiltrados[datoIdx];

  return (
    <div className="fade">
      {/* ── Resumen ── */}
      <div style={{ ...S.finCard, marginBottom: 16 }}>
        {phase ? (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
              <div style={{ textAlign: "center", minWidth: 64 }}>
                <div style={{ fontSize: 44, fontWeight: 700, color: phase.c, fontFamily: "'Spline Sans Mono', monospace", lineHeight: 1 }}>{cycleDay}</div>
                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>día del ciclo</div>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ display: "inline-block", background: phase.c + "22", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: phase.c, fontFamily: "'Spline Sans Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{phase.label}</div>
                <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.4 }}>{phase.desc}</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 130 }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", textTransform: "uppercase", letterSpacing: 0.8 }}>próximo inicio est.</div>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 600, marginTop: 3 }}>{nextStart ? fmtDate(nextStart) : "—"}</div>
                {fertileStart && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 7, lineHeight: 1.4 }}>ventana fértil est.<br />{fmtDate(fertileStart)} – {fmtDate(fertileEnd)}</div>}
              </div>
            </div>
            <div style={{ ...S.entryMeta, marginTop: 10, lineHeight: 1.5 }}>
              {avgLen ? <>Promedio de los últimos {Math.min(starts.length - 1, 6)} ciclos: <strong>{avgLen} días</strong>. Estimaciones orientativas.</> : <>Registra al menos dos ciclos completos para ver el promedio y las estimaciones.</>}
            </div>
          </div>
        ) : (
          <div style={{ color: C.textSoft, fontSize: 14, lineHeight: 1.6 }}>
            Marca en el calendario los días en que tienes la regla para empezar a registrar tu ciclo. Con dos o más ciclos completos podrás ver la fase actual, el promedio y el próximo inicio estimado.
          </div>
        )}
      </div>

      {/* ── Rueda del ciclo ── */}
      <Section label="rueda del ciclo" accent={C.primary}>
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 10px" }}>
          <svg width={240} height={240} viewBox="0 0 220 220" style={{ overflow: "visible" }}>
            <circle cx={CX} cy={CY} r={RM} fill="none" stroke={WHEEL_C.ring} strokeWidth={RO - RI} opacity={0.22} />
            {wheelPhases.map((ph) => ph.end > ph.start + 1
              ? <path key={ph.key} d={arcPath(CX, CY, RO - 1, RI + 1, ph.start, ph.end)} fill={ph.color} opacity={phaseId === ph.key ? 1 : 0.42} />
              : null)}
            <line x1={CX} y1={CY - RO + 3} x2={CX} y2={CY - RI - 3} stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.85} />
            {todayAngle !== null && (
              <circle cx={CX + RM * Math.cos(wRad(todayAngle))} cy={CY + RM * Math.sin(wRad(todayAngle))}
                r={7} fill="white" stroke={phase?.c || WHEEL_C.ring} strokeWidth={2.5} />
            )}
            {cycleDay ? (
              <>
                <text x={CX} y={CY - 7} textAnchor="middle" dominantBaseline="middle"
                  fontSize={30} fontWeight={700} fontFamily="'Spline Sans Mono', monospace" fill={phase?.c || "#888"}>{cycleDay}</text>
                <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fontFamily="'Spline Sans Mono', monospace" fill="#888">{(phase?.label || "").toUpperCase()}</text>
              </>
            ) : (
              <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fontFamily="'Newsreader', serif" fill="#aaa">marca días de regla</text>
            )}
          </svg>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px 16px" }}>
          {wheelPhases.map((ph) => (
            <span key={ph.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11,
              color: phaseId === ph.key ? ph.color : C.textMuted, fontWeight: phaseId === ph.key ? 700 : 400 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: ph.color, opacity: phaseId === ph.key ? 1 : 0.42, display: "inline-block" }} />
              {ph.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Registro del día ── */}
      <Section label="registro del día" accent={C.tranquilo}>
        {editReg ? (
          <div style={S.finCard}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              {new Date(editReg.fecha + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 6 }}>Flujo</div>
              <div style={S.chips}>{FLUJO_OPS.map((f) => (
                <button key={f} onClick={() => setEditReg((r) => ({ ...r, flujo: r.flujo === f ? null : f }))} className="chip"
                  style={{ ...S.chip, ...(editReg.flujo === f ? { borderColor: C.accent, background: C.accentSoft, color: C.text } : {}) }}>{f}</button>
              ))}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 6 }}>Síntomas</div>
              <div style={S.chips}>{SINTOMAS_OPS.map((s) => (
                <button key={s} onClick={() => setEditReg((r) => ({ ...r, sintomas: r.sintomas.includes(s) ? r.sintomas.filter((x) => x !== s) : [...r.sintomas, s] }))} className="chip"
                  style={{ ...S.chip, ...(editReg.sintomas.includes(s) ? { borderColor: C.primary, background: C.primarySoft, color: C.text } : {}) }}>{s}</button>
              ))}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 6 }}>Ánimo</div>
              <div style={{ display: "flex", gap: 5 }}>
                {ANIMO_LABELS.map((l, i) => { const v = i + 1, sel = editReg.animo === v; return (
                  <button key={i} onClick={() => setEditReg((r) => ({ ...r, animo: r.animo === v ? null : v }))} className="navbtn"
                    style={{ flex: 1, padding: "5px 2px", textAlign: "center", fontSize: 10, lineHeight: 1.3, borderRadius: 8,
                      background: sel ? C.spark : C.surface, border: `1px solid ${sel ? C.spark : C.border}`,
                      color: sel ? C.onSpark : C.textSoft, cursor: "pointer", fontFamily: "'Spline Sans Mono', monospace" }}>
                    {v}<br />{l}</button>
                );})}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 6 }}>Energía</div>
              <div style={{ display: "flex", gap: 5 }}>
                {ENERGIA_LABELS.map((l, i) => { const v = i + 1, sel = editReg.energia === v; return (
                  <button key={i} onClick={() => setEditReg((r) => ({ ...r, energia: r.energia === v ? null : v }))} className="navbtn"
                    style={{ flex: 1, padding: "5px 2px", textAlign: "center", fontSize: 10, lineHeight: 1.3, borderRadius: 8,
                      background: sel ? C.tranquilo : C.surface, border: `1px solid ${sel ? C.tranquilo : C.border}`,
                      color: sel ? "#fff" : C.textSoft, cursor: "pointer", fontFamily: "'Spline Sans Mono', monospace" }}>
                    {v}<br />{l}</button>
                );})}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveReg} className="navbtn" style={{ ...S.navBtn, ...S.navBtnOn }}>Guardar</button>
              <button onClick={() => setEditReg(null)} className="navbtn" style={S.navBtn}>Cancelar</button>
            </div>
          </div>
        ) : regHoy ? (
          <div style={S.finCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>hoy</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{fmtReg(regHoy)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setEditReg({ ...regHoy, sintomas: regHoy.sintomas || [] })} className="del" style={{ ...S.del, padding: 4 }}><PenLine size={13} /></button>
                <button onClick={() => onDelReg(regHoy.id)} className="del" style={{ ...S.del, padding: 4 }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={newReg} className="navbtn"
            style={{ width: "100%", padding: "10px 14px", textAlign: "left", background: C.surface, border: `1px dashed ${C.border}`,
              borderRadius: 10, color: C.textSoft, fontSize: 13, fontFamily: "'Newsreader', serif", cursor: "pointer" }}>
            + Agregar registro de hoy (flujo, síntomas, ánimo, energía)
          </button>
        )}
        {registros.filter((r) => r.fecha !== todayKey).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 14).map((r) => (
          <div key={r.id} style={{ ...S.finCard, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", marginBottom: 3 }}>
                  {new Date(r.fecha + "T12:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <div style={{ fontSize: 12, color: C.textSoft }}>{fmtReg(r)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setEditReg({ ...r, sintomas: r.sintomas || [] })} className="del" style={{ ...S.del, padding: 4 }}><PenLine size={12} /></button>
                <button onClick={() => onDelReg(r.id)} className="del" style={{ ...S.del, padding: 4 }}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── Calendario 3 meses ── */}
      <div style={S.calWrap}>
        <div style={S.calHead}>
          <button className="iconbtn" style={S.iconBtn} onClick={() => setCalRef(new Date(calYear, calMonth - 1, 1))} aria-label="Meses anteriores"><ChevronLeft size={16} /></button>
          <span style={S.calTitle}>{calYear}</span>
          <button className="iconbtn" style={S.iconBtn} onClick={() => setCalRef(new Date(calYear, calMonth + 1, 1))} aria-label="Meses siguientes"><ChevronRight size={16} /></button>
        </div>
        <div style={S.calMonthsRow}>
          {renderMonth(new Date(calYear, calMonth - 1, 1))}
          {renderMonth(calRef)}
          {renderMonth(new Date(calYear, calMonth + 1, 1))}
        </div>
        <div style={S.calLegend}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 3, background: C.accent, display: "inline-block" }} /> regla
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 3, border: `1.5px solid ${C.spark}`, display: "inline-block" }} /> hoy
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: WHEEL_C.folicular, display: "inline-block" }} /> con registro
          </span>
          <span style={{ color: C.textMuted }}>toca un día para marcarlo</span>
        </div>
      </div>

      <div style={{ ...S.hint, marginTop: 14 }}>
        Módulo de autoconocimiento. No es un dispositivo médico ni método anticonceptivo. Consulta a tu médica o matrona ante síntomas que te preocupen.
      </div>

      {/* ── Dato de salud del día ── */}
      <div style={{ marginTop: 32 }}>
      <Section label="dato de salud del día" accent={C.spark}>
        <div style={{ ...S.chips, marginBottom: 10 }}>
          {DATOS_CICLO_CATS.map((cat) => (
            <button key={cat} onClick={() => { setDatosCat(cat); setDatosOffset(0); }} className="chip"
              style={{ ...S.chip, ...(datosCat === cat ? { borderColor: C.spark, background: C.sparkSoft, color: C.text } : {}) }}>{cat}</button>
          ))}
        </div>
        <div style={S.finCard}>
          <div style={{ fontSize: 10, fontFamily: "'Spline Sans Mono', monospace", color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            {datoHoy.cat} · {datoIdx + 1} / {datosFiltrados.length}
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.65, fontFamily: "'Newsreader', serif" }}>{datoHoy.texto}</div>
        </div>
        <button onClick={() => setDatosOffset((o) => o + 1)} className="navbtn"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, color: C.textSoft, fontSize: 12, fontFamily: "'Spline Sans Mono', monospace", background: "none", border: "none", cursor: "pointer" }}>
          <RefreshCw size={11} /> otro dato
        </button>
        <div style={{ ...S.hint, marginTop: 4 }}>Contenido educativo — no es consejo médico ni reemplaza a un profesional de salud.</div>
      </Section>
      </div>
    </div>
  );
}

/* ───────────────────────── SEMANA ───────────────────────── */
function Semana({ areas, tasks, onAdd, onToggle, onDel, onUpdate, notes, onAddNote, onDelNote, habitsToday, onToggleHabit }) {
  const [offset, setOffset] = useState(0);
  const [activeArea, setActiveArea] = useState(areas[0]?.id || "");
  const [drafts, setDrafts] = useState({});
  const [focus, setFocus] = useState("todo");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [calRef, setCalRef] = useState(() => { const d = now(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [noteText, setNoteText] = useState("");
  const addNote = () => { const t = noteText.trim(); if (!t) return; onAddNote(t); setNoteText(""); };
  const days = weekDays(offset);
  const hidden = useMemo(() => {
    if (focus === "vida") return new Set(areas.filter((a) => a.kind === "trabajo").map((a) => a.id));
    if (focus === "trabajo" && areas.some((a) => a.kind === "trabajo")) return new Set(areas.filter((a) => a.kind !== "trabajo").map((a) => a.id));
    return new Set();
  }, [focus, areas]);
  const visibleAreas = areas.filter((a) => !hidden.has(a.id));
  const effArea = (hidden.has(activeArea) || !activeArea) ? (visibleAreas[0]?.id || "") : activeArea;
  const todayKey = dateKey(now());

  const byDay = useMemo(() => { const m = {}; for (const t of tasks) (m[t.day] = m[t.day] || []).push(t); return m; }, [tasks]);
  const s = days[0], e = days[6];
  const range = `${s.getDate()} ${s.toLocaleDateString("es-CL", { month: "short" })} – ${e.getDate()} ${e.toLocaleDateString("es-CL", { month: "short" })}`;
  const commit = (key) => { const txt = (drafts[key] || "").trim(); if (!txt || !effArea) return; onAdd(key, effArea, txt); setDrafts((p) => ({ ...p, [key]: "" })); };

  const jumpToWeekOf = (d) => {
    const monThis = startOfWeek(0).getTime();
    const dd = new Date(d); const dow = (dd.getDay() + 6) % 7;
    dd.setDate(dd.getDate() - dow); dd.setHours(0, 0, 0, 0);
    setOffset(Math.round((dd.getTime() - monThis) / (7 * dayMs)));
  };
  const calYear = calRef.getFullYear(), calMonth = calRef.getMonth();
  const CAL_DOW = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
  const rowsFor = (ref) => {
    const y = ref.getFullYear(), m = ref.getMonth();
    const fdow = (new Date(y, m, 1).getDay() + 6) % 7;
    const dim = new Date(y, m + 1, 0).getDate();
    return Math.ceil((fdow + dim) / 7);
  };
  const calMonthsToShow = [new Date(calYear, calMonth - 1, 1), calRef, new Date(calYear, calMonth + 1, 1)];
  const calRows = Math.max(...calMonthsToShow.map(rowsFor));
  const renderMonth = (ref) => {
    const y = ref.getFullYear(), m = ref.getMonth();
    const tNow = now();
    const isCurrentMonth = y === tNow.getFullYear() && m === tNow.getMonth();
    const fdow = (new Date(y, m, 1).getDay() + 6) % 7;
    const dim = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < fdow; i++) cells.push(null);
    for (let dn = 1; dn <= dim; dn++) cells.push(new Date(y, m, dn));
    while (cells.length < calRows * 7) cells.push(null);
    return (
      <div key={`${y}-${m}`} style={{ ...S.calMonth, ...(isCurrentMonth ? S.calMonthCur : S.calMonthOther) }}>
        <div style={S.calMonthTitle}>{ref.toLocaleDateString("es-CL", { month: "long" })}</div>
        <div style={S.calGrid}>
          {CAL_DOW.map((d, i) => <span key={"h" + i} style={S.calDow}>{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={"b" + i} style={{ aspectRatio: "1 / 1" }} />;
            const key = dateKey(d);
            const list = byDay[key] || [];
            const total = list.length, done = list.filter((t) => t.done).length, has = total > 0;
            const isToday = key === todayKey;
            const inWeek = days.some((wd) => dateKey(wd) === key);
            return (
              <button key={key} onClick={() => jumpToWeekOf(d)} className="navbtn"
                title={has ? `${done}/${total} hechas` : "sin actividad"}
                style={{ ...S.calCell, ...(inWeek ? S.calCellWeek : {}), ...(isToday ? S.calCellToday : {}) }}>
                {d.getDate()}
                {has && <span style={{ ...S.calDot, background: done === total ? C.primary : C.spark }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fade">
      <div style={S.weekNav}>
        <button className="iconbtn" style={S.iconBtn} onClick={() => setOffset(offset - 1)} aria-label="Semana anterior"><ChevronLeft size={18} /></button>
        <div style={{ textAlign: "center" }}>
          <div style={S.weekRange}>{range}</div>
          {offset !== 0 && <button className="link" style={S.linkBtn} onClick={() => setOffset(0)}>volver a esta semana</button>}
        </div>
        <button className="iconbtn" style={S.iconBtn} onClick={() => setOffset(offset + 1)} aria-label="Semana siguiente"><ChevronRight size={18} /></button>
      </div>

      <div style={S.focusRow}>
        <span style={S.smallLabel}>foco:</span>
        <div style={S.segment}>
          {(areas.some((a) => a.kind === "trabajo")
            ? [["vida", "Vida personal"], ["trabajo", "Laboral"], ["todo", "Todo"]]
            : [["vida", "Vida personal"], ["todo", "Todo"]]
          ).map(([k, l]) => (
            <button key={k} onClick={() => setFocus(k)} className="navbtn" style={{ ...S.segBtn, ...(focus === k ? S.segBtnOn : {}) }}>{l}</button>
          ))}
        </div>
        {focus === "vida" && <span style={S.focusNote}>lo laboral está en pausa</span>}
        {focus === "trabajo" && <span style={S.focusNote}>viendo solo lo laboral</span>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={S.smallLabel}>al anotar una tarea, será de:</div>
        <div style={S.chips}>
          {visibleAreas.map((a) => (
            <button key={a.id} onClick={() => setActiveArea(a.id)} className="chip"
              style={{ ...S.chip, display: "flex", alignItems: "center", gap: 6, ...(effArea === a.id ? { borderColor: tint(a.id), color: C.text, background: soft(a.id) } : {}) }}>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: tint(a.id) }} />{a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="weekgrid">
        {days.map((d, i) => {
          const key = dateKey(d), isToday = key === todayKey;
          const list = (byDay[key] || []).filter((t) => !hidden.has(t.areaId)).slice().sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
          return (
            <React.Fragment key={key}>
            <div className={i === 5 ? "daycol sat" : i === 6 ? "daycol sun" : "daycol"} style={{ ...S.dayCol, ...(isToday ? { borderColor: C.spark, background: C.sparkSoft } : {}) }}>
              <div style={S.dayHead}>
                <span style={{ ...S.dayName, ...(isToday ? { color: C.text } : {}) }}>{DAY_NAMES[i]}</span>
                <span style={S.dayDate}>{d.getDate()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6 }}>
                {list.length === 0 && <div style={S.dayEmpty}>—</div>}
                {list.map((t) => (
                  <div key={t.id} className="task" style={S.task}>
                    <button onClick={() => onToggle(t.id)} className="check" aria-label="Completar"
                      style={{ ...S.check, borderColor: tint(t.areaId), background: t.done ? tint(t.areaId) : "transparent" }}>
                      {t.done && <Check size={11} color={C.onPrimary} strokeWidth={3} />}
                    </button>
                    {editTaskId === t.id ? (
                      <input autoFocus value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { if (editTaskText.trim()) onUpdate(t.id, { text: editTaskText.trim() }); setEditTaskId(null); }
                          if (e.key === "Escape") setEditTaskId(null);
                        }}
                        onBlur={() => { if (editTaskText.trim()) onUpdate(t.id, { text: editTaskText.trim() }); setEditTaskId(null); }}
                        style={{ ...S.dayInput, flex: 1, margin: 0 }} />
                    ) : (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, lineHeight: 1.35, color: t.done ? C.textMuted : C.text, textDecoration: t.done ? "line-through" : "none", wordBreak: "break-word" }}>{t.text}</div>
                        {t.carriedFrom && !t.done && (
                          <div style={{ fontSize: 10, color: C.atencion, fontFamily: "'Spline Sans Mono', monospace", marginTop: 1 }}>
                            ↑ desde el {new Date(t.carriedFrom + "T12:00:00").toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}
                          </div>
                        )}
                      </div>
                    )}
                    {!t.done && editTaskId !== t.id && (
                      <button onClick={() => { setEditTaskId(t.id); setEditTaskText(t.text); }} className="del" style={{ ...S.del, padding: 2 }} aria-label="Editar tarea"><PenLine size={12} /></button>
                    )}
                    <button onClick={() => onDel(t.id)} className="del" style={{ ...S.del, padding: 2 }} aria-label="Borrar"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
              <input value={drafts[key] || ""} onChange={(ev) => setDrafts((p) => ({ ...p, [key]: ev.target.value }))}
                onKeyDown={(ev) => { if (ev.key === "Enter") commit(key); }}
                placeholder="+ tarea" style={{ ...S.dayInput, borderColor: effArea ? tint(effArea) + "66" : C.border }} />
            </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={S.hint}>Marca el círculo al completar: cuenta como energía de esa área y alimenta el Tablero.</div>

      <div style={S.calWrap}>
        <div style={S.calHead}>
          <button className="iconbtn" style={S.iconBtn} onClick={() => setCalRef(new Date(calYear, calMonth - 1, 1))} aria-label="Meses anteriores"><ChevronLeft size={16} /></button>
          <span style={S.calTitle}>{calYear}</span>
          <button className="iconbtn" style={S.iconBtn} onClick={() => setCalRef(new Date(calYear, calMonth + 1, 1))} aria-label="Meses siguientes"><ChevronRight size={16} /></button>
        </div>
        <div style={S.calMonthsRow}>
          {renderMonth(new Date(calYear, calMonth - 1, 1))}
          {renderMonth(calRef)}
          {renderMonth(new Date(calYear, calMonth + 1, 1))}
        </div>
        <div style={S.calLegend}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: C.spark }} /> con tareas</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: C.primary }} /> todo hecho</span>
          <span style={{ color: C.textMuted }}>toca un día para ir a esa semana</span>
        </div>
      </div>

      <div style={S.notesWrap}>
        <div style={S.notesHead}><PenLine size={15} /> <span>Notas</span></div>
        <div style={{ display: "flex", gap: 8, marginBottom: notes.length ? 12 : 0 }}>
          <input value={noteText} onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
            placeholder="Una idea, una cita, algo que no quieres perder…" style={S.notesInput} />
          <button className="navbtn" onClick={addNote} style={S.notesAdd}><Plus size={15} /> Agregar</button>
        </div>
        {notes.length === 0
          ? <div style={S.notesEmpty}>Anota acá lo que se te ocurra al mirar tu semana.</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {notes.map((n) => (
                <div key={n.id} className="task" style={S.noteRow}>
                  <span style={{ flex: 1, lineHeight: 1.45 }}>{n.title}</span>
                  <button onClick={() => onDelNote(n.id)} className="del" style={{ ...S.del, padding: 3 }} aria-label="Borrar nota"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>}
      </div>

      <div style={S.habitsCard}>
        <div style={S.habitsHead}>
          <Heart size={15} /> <span>Cuidados de hoy</span>
          <span style={S.habitsCount}>{habitsToday.length}/{HABITOS.length}</span>
        </div>
        <div style={S.habitsRow}>
          {HABITOS.map((h) => {
            const on = habitsToday.includes(h.id);
            const Ic = h.icon;
            return (
              <button key={h.id} onClick={() => onToggleHabit(h.id)} className="chip"
                style={{ ...S.habitChip, ...(on ? S.habitChipOn : {}) }}>
                {on ? <Check size={14} strokeWidth={3} /> : <Ic size={14} />} {h.label}
              </button>
            );
          })}
        </div>
        <div style={S.habitsHint}>Pequeños gestos para tu cuerpo y tu ánimo. Se reinician cada día.</div>
      </div>
    </div>
  );
}

/* ───────────────────────── REGISTROS (colecciones) ───────────────────────── */
function Registros({ items, onAdd, onUpdate, onDel }) {
  const [collId, setCollId] = useState("libros");
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [body, setBody] = useState("");
  const [filter, setFilter] = useState("__all__");
  const [cIdx, setCIdx] = useState(dayOfYear() % CONSIGNAS.length);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMeta, setEditMeta] = useState("");
  const [editBody, setEditBody] = useState("");
  const coll = COLL[collId];
  const Ic = coll.icon;
  const esCuaderno = collId === "cuaderno";

  useEffect(() => { setFilter("__all__"); setTitle(""); setMeta(""); setBody(""); setEditingId(null); }, [collId]);

  const list = useMemo(() => items
    .filter((it) => it.coll === collId)
    .filter((it) => filter === "__all__" || it.status === filter)
    .sort((a, b) => b.date.localeCompare(a.date)), [items, collId, filter]);

  const submit = () => {
    if (esCuaderno) {
      if (!body.trim()) return;
      onAdd("cuaderno", title, null, CONSIGNAS[cIdx], body);
      setTitle(""); setBody("");
    } else {
      if (!title.trim()) return;
      onAdd(collId, title, coll.statuses[0] || null, meta);
      setTitle(""); setMeta("");
    }
  };
  const otraConsigna = () => { let n = cIdx; while (n === cIdx && CONSIGNAS.length > 1) n = Math.floor(Math.random() * CONSIGNAS.length); setCIdx(n); };
  const cycleStatus = (it) => {
    if (!coll.statuses.length) return;
    const i = coll.statuses.indexOf(it.status);
    const next = coll.statuses[(i + 1) % coll.statuses.length];
    const patch = { status: next };
    if (collId === "libros" && next === "Leído" && !it.finished) patch.finished = new Date().toISOString().slice(0, 10);
    onUpdate(it.id, patch);
  };
  const cycleTipo = (it) => {
    if (!coll.tipos) return;
    const cur = it.tipo || coll.tipos[0];
    const i = coll.tipos.indexOf(cur);
    onUpdate(it.id, { tipo: coll.tipos[(i + 1) % coll.tipos.length] });
  };

  return (
    <div className="fade">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        {COLLECTIONS.map((c) => {
          const CI = c.icon;
          return (
            <button key={c.id} onClick={() => setCollId(c.id)} className="chip"
              style={{ ...S.chip, display: "flex", alignItems: "center", gap: 6, ...(collId === c.id ? { borderColor: C.spark, color: C.text, background: C.sparkSoft } : {}) }}>
              <CI size={14} strokeWidth={1.9} /> {c.name}
            </button>
          );
        })}
      </div>

      <Section label={coll.name} accent={C.accent}>
        {esCuaderno && (
          <div style={{ ...S.finCard, background: C.primarySoft, borderColor: C.primary + "44", marginBottom: 14 }}>
            <div style={{ ...S.smallLabel, marginBottom: 6 }}>una consigna, por si quieres</div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 15.5, color: C.text, lineHeight: 1.4 }}>{CONSIGNAS[cIdx]}</div>
            <button onClick={otraConsigna} className="link" style={{ ...S.linkBtn, marginTop: 8 }}>otra consigna</button>
          </div>
        )}
        {esCuaderno ? (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (opcional)" style={S.input} />
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Escribe aquí. Sin apuro, sin que tenga que ser bueno."
              style={{ ...S.noteField, minHeight: 130, marginTop: 8 }} />
            <button onClick={submit} disabled={!body.trim()} className="primary" style={{ ...S.primary, opacity: body.trim() ? 1 : 0.45 }}>
              <Plus size={15} strokeWidth={2.2} /> Guardar
            </button>
          </>
        ) : (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={coll.ph} style={S.input}
              onKeyDown={(e) => { if (e.key === "Enter" && !coll.meta) submit(); }} />
            {coll.meta && (
              <input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder={coll.meta} style={{ ...S.input, marginTop: 8 }}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
            )}
            <button onClick={submit} disabled={!title.trim()} className="primary"
              style={{ ...S.primary, opacity: title.trim() ? 1 : 0.45 }}>
              <Plus size={15} strokeWidth={2.2} /> Agregar
            </button>
            {coll.statuses.length > 0 && (
              <div style={{ ...S.chips, marginTop: 16 }}>
                {["__all__", ...coll.statuses].map((st) => (
                  <button key={st} onClick={() => setFilter(st)} className="chip"
                    style={{ ...S.chip, fontSize: 12, padding: "5px 10px", ...(filter === st ? { borderColor: C.spark, color: C.text, background: C.sparkSoft } : {}) }}>
                    {st === "__all__" ? "Todos" : st}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      <Section label={`${list.length} ${list.length === 1 ? "registro" : "registros"}`} accent={C.accent}>
        {list.length === 0 ? <div style={S.empty}>{esCuaderno ? "Tu cuaderno está en blanco. Escribe lo primero que se te ocurra —da igual qué." : "Nada por aquí todavía. Agrega el primero arriba."}</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.map((it) => {
              const dt = new Date(it.date);
              if (editingId === it.id) {
                return (
                  <div key={it.id} style={{ ...S.entry, borderLeft: `3px solid ${C.spark}`, flexDirection: "column", alignItems: "stretch" }}>
                    <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Editando…</div>
                    {esCuaderno ? (
                      <>
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Título (opcional)" style={S.input} />
                        <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={4}
                          style={{ ...S.noteField, minHeight: 100, marginTop: 8 }} />
                      </>
                    ) : (
                      <>
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder={coll.ph} style={S.input} />
                        {coll.meta && <input value={editMeta} onChange={(e) => setEditMeta(e.target.value)} placeholder={coll.meta} style={{ ...S.input, marginTop: 8 }} />}
                      </>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                      <button onClick={() => {
                        if (esCuaderno) onUpdate(it.id, { title: editTitle, note: editBody });
                        else onUpdate(it.id, { title: editTitle, meta: editMeta });
                        setEditingId(null);
                      }} className="primary" style={{ ...S.primary, padding: "7px 16px", fontSize: 13 }}>
                        <Check size={14} /> Guardar
                      </button>
                      <button onClick={() => setEditingId(null)} className="link" style={S.linkBtn}>cancelar</button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={it.id} className="entry" style={{ ...S.entry, borderLeft: `3px solid ${C.accent}` }}>
                  <Ic size={15} color={C.accent} strokeWidth={1.9} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: C.text, fontSize: 14.5, lineHeight: 1.35, fontFamily: "'Newsreader', serif", fontWeight: 500 }}>
                      {it.title || (esCuaderno ? `Entrada del ${dt.toLocaleDateString("es-CL", { day: "numeric", month: "long" })}` : "")}
                    </div>
                    {it.meta && <div style={{ color: C.textSoft, fontSize: 12.5, marginTop: 2, fontStyle: esCuaderno ? "italic" : "normal" }}>{esCuaderno ? `✎ ${it.meta}` : it.meta}</div>}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                      {coll.statuses.length > 0 && (
                        <button onClick={() => cycleStatus(it)} className="navbtn"
                          style={{ ...S.statusPill, cursor: "pointer", color: statusColor(coll, it.status), borderColor: statusColor(coll, it.status) + "77", background: "#FFFFFFAA" }}>
                          {it.status}
                        </button>
                      )}
                      {coll.tipos && (() => {
                        const tipo = it.tipo || coll.tipos[0];
                        const i = coll.tipos.indexOf(tipo);
                        const tColor = [C.primary, C.accent, "#7B6FA0", "#6E7E5A"][i % 4];
                        return (
                          <button onClick={() => cycleTipo(it)} className="navbtn"
                            style={{ ...S.statusPill, cursor: "pointer", color: tColor, borderColor: tColor + "77", background: "#FFFFFFAA" }}>
                            {tipo}
                          </button>
                        );
                      })()}
                      <span style={S.entryMeta}>{dt.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}</span>
                      {collId === "libros" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={S.entryMeta}>· terminado el</span>
                          <input type="date" value={it.finished || ""} onChange={(e) => onUpdate(it.id, { finished: e.target.value })} style={S.dateInput} />
                        </span>
                      )}
                      {(collId === "peliculas" || collId === "teatro") && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={S.entryMeta}>· vista el</span>
                          <input type="date" value={it.viewedDate || ""} onChange={(e) => onUpdate(it.id, { viewedDate: e.target.value })} style={S.dateInput} />
                        </span>
                      )}
                    </div>
                    {coll.note !== undefined && (
                      <NoteField value={it.note} placeholder={coll.note} onSave={(v) => onUpdate(it.id, { note: v })} />
                    )}
                  </div>
                  <button onClick={() => { setEditingId(it.id); setEditTitle(it.title || ""); setEditMeta(it.meta || ""); setEditBody(it.note || ""); }}
                    className="del" style={{ ...S.del, marginRight: 2 }} aria-label="Editar"><PenLine size={14} /></button>
                  <button onClick={() => onDel(it.id)} className="del" style={S.del} aria-label="Borrar"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
function NoteField({ value, placeholder, onSave }) {
  const [v, setV] = useState(value || "");
  useEffect(() => { setV(value || ""); }, [value]);
  return (
    <textarea value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v !== (value || "")) onSave(v); }}
      rows={v ? 2 : 1} placeholder={placeholder} style={S.noteField} />
  );
}

function Saludo() {
  const [frase] = useState(() => FRASES[Math.floor(Math.random() * FRASES.length)]);
  const h = new Date().getHours();
  const saludo = h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
  return (
    <div style={{ ...S.subtitle, fontStyle: "normal" }}>
      <span style={{ color: C.onBg }}>{saludo}.</span> <span style={{ fontStyle: "italic" }}>{frase}</span>
    </div>
  );
}

const MONSTERA = "M0 0 C 6 -4 10 -10 11 -16 L 7 -18 C 12 -20 16 -24 17 -30 L 11 -31 C 15 -34 16 -38 12 -42 C 8 -45 4 -46 0 -46 C -4 -46 -8 -45 -12 -42 C -16 -38 -15 -34 -11 -31 L -17 -30 C -16 -24 -12 -20 -7 -18 L -11 -16 C -10 -10 -6 -4 0 0 Z";
function Decor() {
  const leaf = (x, y, deg, s) => <path key={`${x}-${y}`} d={MONSTERA} transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`} fill={C.text} opacity="0.5" />;
  const vine = (
    <svg viewBox="0 0 220 220" width="210" height="210" fill="none">
      <path d="M28 208 C 68 158, 70 108, 118 70 C 148 47, 172 40, 196 28" stroke={C.text} strokeWidth="2" strokeLinecap="round" />
      {leaf(60, 162, -118, 0.72)}
      {leaf(84, 130, 52, 0.7)}
      {leaf(106, 102, -118, 0.74)}
      {leaf(132, 74, 52, 0.7)}
      {leaf(162, 50, -108, 0.66)}
    </svg>
  );
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -34, right: -26, opacity: 0.08, transform: "rotate(6deg)" }}>{vine}</div>
      <div style={{ position: "absolute", bottom: -44, right: -30, opacity: 0.08, transform: "rotate(150deg)" }}>{vine}</div>
    </div>
  );
}

function LeftRail() {
  return (
    <div className="leftrail" aria-hidden="true" style={{ flexShrink: 0, width: 18, display: "flex", alignItems: "stretch" }}>
      <div style={{ display: "flex", gap: 3, flex: 1 }}>
        <div style={{ width: 8, background: C.spark, borderRadius: 3 }} />
        <div style={{ width: 5, background: C.primary, borderRadius: 3 }} />
      </div>
    </div>
  );
}

const PALETA = [
  ["Navy", "#0C2C47"], ["Verde", "#2E5749"], ["Mint", "#C2E0E1"], ["Mauve", "#D6C9C5"],
  ["Amarillo", "#DA9B2B"], ["Naranja", "#BF512C"], ["Blanco", "#FFFFFF"],
];
function Paleta() {
  return (
    <div style={S.paleta}>
      <span style={S.paletaLabel}>la paleta</span>
      <div style={{ display: "flex", gap: 6 }}>
        {PALETA.map(([n, hex]) => (
          <span key={n} title={`${n} · ${hex}`} style={{ width: 19, height: 19, borderRadius: 5, background: hex, border: `1px solid ${C.border}` }} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── TABLERO ───────────────────────── */
function Tablero({ areas, lastByArea, weekActivity: weekActivityAll, attention: attentionAll, finance, savings, goals, tasks, items, logros, plantStart }) {
  const [focus, setFocus] = useState("vida");
  const [mOffset, setMOffset] = useState(0);
  const work = focus === "trabajo";
  const inFocus = (areaId) => { const a = areas.find((x) => x.id === areaId); const k = a?.kind || "vida"; return work ? k === "trabajo" : k !== "trabajo"; };
  const areasF = areas.filter((a) => work ? a.kind === "trabajo" : a.kind !== "trabajo");
  const weekActivity = Object.fromEntries(Object.entries(weekActivityAll).filter(([id]) => inFocus(id)));
  const attention = attentionAll.filter((x) => inFocus(x.area.id));
  const esperando = (goals || []).filter(goalDue).filter((g) => inFocus(g.areaId)).sort((a, b) => (daysBetween(goalRef(b)) || 0) - (daysBetween(goalRef(a)) || 0));
  const cut = now() - 7 * dayMs;
  const tasksDone = (tasks || []).filter((t) => t.done && t.doneAt && new Date(t.doneAt).getTime() >= cut && inFocus(t.areaId)).length;
  const itemsW = (items || []).filter((it) => new Date(it.date).getTime() >= cut && inFocus(COLL[it.coll]?.areaId)).length;
  const maxAct = Math.max(1, ...Object.values(weekActivity));
  const sorted = [...areasF].sort((a, b) => (weekActivity[b.id] || 0) - (weekActivity[a.id] || 0));
  const sumF = (arr, f) => (arr || []).reduce((a, r) => a + (Number(r[f]) || 0), 0);
  const curKey = monthKeyOf(new Date());
  const cm = (finance || {})[curKey] || {};
  const finSaldo = sumF(cm.ingresos, "monto") - sumF(cm.egresos, "monto") - sumF(cm.deudas, "pago");
  const finHay = !!(finance || {})[curKey];
  const sv = savings || {};
  const patrimonio = sumF(sv.depositos, "monto") + sumF(sv.afp, "monto") + sumF(sv.apv, "monto");
  const hasWork = areas.some((a) => a.kind === "trabajo");
  const areaRank = areasF.map((a) => {
    const last = lastByArea[a.id];
    const d = daysBetween(last);
    const ratio = d === null ? Infinity : d / toleranceDays(a.importance);
    return { a, last, d, ratio, st: statusOf(last, a.importance) };
  }).sort((x, y) => y.ratio - x.ratio);

  const selMonthDate = addMonths(new Date(new Date().getFullYear(), new Date().getMonth(), 1), mOffset);
  const selMonthKey = monthKeyOf(selMonthDate);
  const selMonthLabel = selMonthDate.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  const taskCountsByArea = {};
  for (const t of tasks || []) {
    if (t.day && t.day.startsWith(selMonthKey) && inFocus(t.areaId)) {
      if (!taskCountsByArea[t.areaId]) taskCountsByArea[t.areaId] = { total: 0, done: 0 };
      taskCountsByArea[t.areaId].total++;
      if (t.done) taskCountsByArea[t.areaId].done++;
    }
  }
  const sortedByTasks = areasF
    .map((a) => ({ a, total: taskCountsByArea[a.id]?.total || 0, done: taskCountsByArea[a.id]?.done || 0 }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);
  const maxTasks = Math.max(1, ...sortedByTasks.map((x) => x.total));

  return (
    <div className="fade">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 23, fontWeight: 500, color: C.text, margin: 0, letterSpacing: "-.01em" }}>Tu tablero</h2>
        <div style={{ ...S.subtitle, fontStyle: "italic", marginTop: 3 }}>El reflejo de lo que registras y cumples.</div>
        <div style={{ width: 38, height: 2, background: C.accent, borderRadius: 2, margin: "13px auto 0" }} />
      </div>
      {hasWork && (
        <div style={{ ...S.segment, marginBottom: 18 }}>
          {[["vida", "Vida personal"], ["trabajo", "Trabajo"]].map(([k, l]) => (
            <button key={k} onClick={() => setFocus(k)} className="navbtn" style={{ ...S.segBtn, ...(focus === k ? S.segBtnOn : {}) }}>{l}</button>
          ))}
        </div>
      )}
      <div style={S.summaryRow}>
        <Stat big={String(tasksDone)} unit={tasksDone === 1 ? "tarea hecha" : "tareas hechas"} label="esta semana" bg={C.primarySoft} />
        <Stat big={String(itemsW)} unit={itemsW === 1 ? "registro" : "registros"} label="esta semana" bg={C.sparkSoft} />
        <Stat big={String(attention.length)} unit={attention.length === 1 ? "área pide atención" : "áreas piden atención"}
          label="ahora mismo" accent={attention.length ? C.urgente : C.tranquilo} bg={attention.length ? C.accentSoft : "#D7E6DF"} />
      </div>

      <Section label="Cómo van tus áreas" accent={C.accent}>
        {areaRank.length === 0 ? <div style={S.empty}>No hay áreas en esta vista.</div> : (
          <div style={S.finCard}>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {areaRank.map(({ a, d, ratio, st }) => {
                const fill = ratio === Infinity ? 1 : Math.max(0.05, Math.min(ratio / 1.6, 1));
                const lbl = d === null ? "sin registro" : d === 0 ? "hoy" : `${d} ${d === 1 ? "día" : "días"}`;
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 88, flexShrink: 0, fontSize: 13, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                    <div style={{ flex: 1, height: 9, background: "#E9EEED", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ width: `${fill * 100}%`, height: "100%", background: st.color, borderRadius: 6, transition: "width .5s ease" }} />
                    </div>
                    <span style={{ width: 62, flexShrink: 0, textAlign: "right", fontSize: 11.5, fontFamily: "'Spline Sans Mono', monospace", color: st.color }}>{lbl}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ ...S.entryMeta, marginTop: 14, lineHeight: 1.5 }}>De lo más descuidado a lo más al día, según la importancia que le diste a cada una. La barra se llena mientras más tiempo pasa sin que la atiendas.</div>
          </div>
        )}
      </Section>

      <Section label="Tus áreas" accent={C.accent}>
        <div style={S.grid}>
          {areaRank.map(({ a, last, d, st }) => {
            const Icon = iconFor(a.id);
            return (
              <div key={a.id} className="panel" style={{ ...S.panel, background: soft(a.id), borderLeft: `4px solid ${tint(a.id)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ ...S.areaIcon, background: "#FFFFFF99" }}><Icon size={15} color={tint(a.id)} strokeWidth={1.9} /></span>
                    <span style={S.panelName}>{a.name}</span>
                  </div>
                  <Importance value={a.importance} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Gauge health={attentionHealth(last, a.importance)} days={d} color={st.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...S.statusPill, color: st.color, borderColor: st.color + "77", background: "#FFFFFFAA" }}>{st.label}</div>
                    <div style={S.panelMeta}>
                      <span style={{ color: C.textSoft }}>{d === null ? "sin actividad aún" : d === 0 ? "última vez: hoy" : `última vez: hace ${d} ${d === 1 ? "día" : "días"}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {esperando.length > 0 && (
        <Section label="Te está esperando" accent={C.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {esperando.map((g) => {
              const a = areas.find((x) => x.id === g.areaId);
              const d = daysBetween(goalRef(g));
              return (
                <div key={g.id} style={{ ...S.suggest, background: soft(g.areaId) + "88", borderColor: tint(g.areaId) + "44" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 7, background: tint(g.areaId), flexShrink: 0 }} />
                  <span style={{ color: C.text }}>
                    <b style={{ color: tint(g.areaId), fontWeight: 600 }}>{g.title}</b>
                    {a && <span style={{ color: C.textSoft }}> · {a.name}</span>}
                    {d !== null && <span style={{ color: C.textSoft }}> · sin avanzar hace {d} {d === 1 ? "día" : "días"}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {focus === "vida" && (finHay || patrimonio > 0) && (
        <Section label="Finanzas" accent={C.accent}>
          <div style={S.summaryRow}>
            {finHay && <Stat big={fmtCLP(finSaldo)} unit="" label="saldo de este mes" accent={finSaldo >= 0 ? C.primary : C.urgente} bg={C.primarySoft} />}
            {patrimonio > 0 && <Stat big={fmtCLP(patrimonio)} unit="" label="patrimonio ahorrado" accent={C.primary} bg={C.sparkSoft} />}
          </div>
        </Section>
      )}

      <Section label="Dónde pusiste tu energía" accent={C.accent}>
        {Object.keys(weekActivity).length === 0 ? <div style={S.empty}>Sin actividad esta semana. Completa tareas en <b style={S.b}>Semana</b> o suma <b style={S.b}>Registros</b>.</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.filter((a) => weekActivity[a.id]).map((a) => {
              const v = weekActivity[a.id] || 0;
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={S.barLabel}>{a.name}</span>
                  <div style={S.barTrack}><div style={{ height: "100%", width: `${(v / maxAct) * 100}%`, background: tint(a.id), borderRadius: 4, transition: "width .6s ease" }} /></div>
                  <span style={S.barVal}>{v}</span>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section label="Tareas por área y mes" accent={C.accent}>
        <div style={S.weekNav}>
          <button className="iconbtn" style={S.iconBtn} onClick={() => setMOffset((o) => o - 1)} aria-label="Mes anterior"><ChevronLeft size={16} /></button>
          <span style={{ ...S.weekRange, textTransform: "capitalize" }}>{selMonthLabel}</span>
          <button className="iconbtn" style={{ ...S.iconBtn, opacity: mOffset >= 0 ? 0.3 : 1 }} onClick={() => setMOffset((o) => Math.min(0, o + 1))} disabled={mOffset >= 0} aria-label="Mes siguiente"><ChevronRight size={16} /></button>
        </div>
        {sortedByTasks.length === 0
          ? <div style={S.empty}>Sin tareas en este período para esta vista.</div>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {sortedByTasks.map(({ a, total, done }) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={S.barLabel}>{a.name}</span>
                  <div style={S.barTrack}>
                    <div style={{ height: "100%", width: `${(total / maxTasks) * 100}%`, background: tint(a.id), borderRadius: 4, transition: "width .6s ease" }} />
                  </div>
                  <span style={{ ...S.barVal, minWidth: 38, textAlign: "right" }}>{done}/{total}</span>
                </div>
              ))}
            </div>
          )
        }
        <div style={{ ...S.entryMeta, marginTop: 12, lineHeight: 1.5 }}>Completadas / ingresadas. Usa el foco arriba para alternar entre vida personal y trabajo.</div>
      </Section>

      <Section label="Tu plantita" accent={C.accent}>
        {(() => {
          const ps = new Date(plantStart || new Date());
          const n = now();
          const months = (n.getFullYear() - ps.getFullYear()) * 12 + (n.getMonth() - ps.getMonth());
          const stg = Math.min(5, Math.max(0, months));
          const cita = CITAS_PLANTA[dayOfYear() % CITAS_PLANTA.length];
          return (
            <div style={{ ...S.finCard, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
              <Planta stage={stg} />
              <div style={{ textAlign: "center", maxWidth: 250 }}>
                <div style={{ fontFamily: "'Newsreader', serif", fontSize: 16, fontStyle: "italic", color: C.text, lineHeight: 1.45 }}>«{cita.t}»</div>
                <div style={{ ...S.entryMeta, marginTop: 6 }}>— {cita.f}</div>
                <div style={{ ...S.entryMeta, marginTop: 10 }}>{STAGE_WORDS[stg]} · {months === 0 ? "primer mes" : `${months} ${months === 1 ? "mes" : "meses"} juntas`}</div>
              </div>
            </div>
          );
        })()}
      </Section>

    </div>
  );
}

/* ───────────────────────── FINANZAS ───────────────────────── */
function Finanzas({ finance, onSetMonth, savings, onSavAdd, onSavEdit, onSavDel }) {
  const [view, setView] = useState("mes");
  const [offset, setOffset] = useState(0);
  const base = addMonths(new Date(new Date().getFullYear(), new Date().getMonth(), 1), offset);
  const key = monthKeyOf(base);
  const prevKey = monthKeyOf(addMonths(base, -1));
  const m = finance[key] || { ingresos: [], egresos: [], deudas: [] };
  const sum = (arr, f) => (arr || []).reduce((a, r) => a + (Number(r[f]) || 0), 0);
  const totIng = sum(m.ingresos, "monto");
  const totEgr = sum(m.egresos, "monto");
  const totPago = sum(m.deudas, "pago");
  const totDeuda = sum(m.deudas, "saldo");
  const saldo = totIng - totEgr - totPago;

  const update = (patch) => onSetMonth(key, { ingresos: m.ingresos || [], egresos: m.egresos || [], deudas: m.deudas || [], ...patch });
  const addRow = (k, row) => update({ [k]: [...(m[k] || []), { id: rid(), ...row }] });
  const editRow = (k, id, patch) => update({ [k]: (m[k] || []).map((r) => r.id === id ? { ...r, ...patch } : r) });
  const delRow = (k, id) => update({ [k]: (m[k] || []).filter((r) => r.id !== id) });
  const copyPrev = () => {
    const pm = finance[prevKey]; if (!pm) return;
    const clone = (arr) => (arr || []).map((r) => ({ ...r, id: rid() }));
    update({ ingresos: clone(pm.ingresos), egresos: clone(pm.egresos), deudas: clone(pm.deudas) });
  };
  const loadTemplate = () => {
    const mk = (arr) => arr.map((r) => ({ id: rid(), concepto: r.concepto, dia: r.dia || "", monto: 0, saldo: 0, pago: 0 }));
    update({ ingresos: mk(PLANTILLA_FIN.ingresos), egresos: mk(PLANTILLA_FIN.egresos), deudas: mk(PLANTILLA_FIN.deudas) });
  };
  const label = base.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  const empty = !(m.ingresos || []).length && !(m.egresos || []).length && !(m.deudas || []).length;

  return (
    <div className="fade">
      <div style={{ ...S.segment, marginBottom: 20 }}>
        {[["mes", "Mes"], ["evolucion", "Evolución"], ["ahorros", "Ahorros"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} className="navbtn" style={{ ...S.segBtn, ...(view === k ? S.segBtnOn : {}) }}>{l}</button>
        ))}
      </div>

      {view === "mes" && (
        <>
          <div style={S.weekNav}>
            <button className="iconbtn" style={S.iconBtn} onClick={() => setOffset(offset - 1)} aria-label="Mes anterior"><ChevronLeft size={18} /></button>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...S.weekRange, textTransform: "capitalize" }}>{label}</div>
              {offset !== 0 && <button className="link" style={S.linkBtn} onClick={() => setOffset(0)}>volver a este mes</button>}
            </div>
            <button className="iconbtn" style={S.iconBtn} onClick={() => setOffset(offset + 1)} aria-label="Mes siguiente"><ChevronRight size={18} /></button>
          </div>

          <div style={{ ...S.balCard, marginBottom: 22 }}>
            <div style={S.finBigLabel}>saldo del mes</div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, lineHeight: 1, color: saldo >= 0 ? C.primary : C.urgente }}>{fmtCLP(saldo)}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap", fontSize: 13, color: C.textSoft }}>
              <span>Ingresos <b style={{ color: C.text }}>{fmtCLP(totIng)}</b></span>
              <span>Egresos <b style={{ color: C.text }}>−{fmtCLP(totEgr)}</b></span>
              <span>Pagos deuda <b style={{ color: C.text }}>−{fmtCLP(totPago)}</b></span>
            </div>
          </div>

          {empty && (
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <button onClick={loadTemplate} className="primary" style={{ ...S.primary, marginTop: 0, width: "auto", padding: "0 16px", background: C.primary }}>
                Cargar mis conceptos
              </button>
              {finance[prevKey] && (
                <button onClick={copyPrev} className="primary" style={{ ...S.primary, marginTop: 0, width: "auto", padding: "0 16px", background: C.bgDeep }}>
                  Copiar {addMonths(base, -1).toLocaleDateString("es-CL", { month: "long" })}
                </button>
              )}
            </div>
          )}

          <FinSection title="Ingresos" total={totIng} color={C.primary}
            rows={m.ingresos || []} cols={[["concepto", "Concepto", "text"], ["monto", "Monto", "num"]]}
            onAdd={(r) => addRow("ingresos", r)} onEdit={(id, p) => editRow("ingresos", id, p)} onDel={(id) => delRow("ingresos", id)} />

          <FinSection title="Egresos" total={totEgr} color={C.accent}
            rows={m.egresos || []} cols={[["concepto", "Concepto", "text"], ["dia", "día", "text", "narrow"], ["monto", "Monto", "num"]]}
            onAdd={(r) => addRow("egresos", r)} onEdit={(id, p) => editRow("egresos", id, p)} onDel={(id) => delRow("egresos", id)} />

          <FinSection title="Deudas" total={totDeuda} totalLabel="Deuda pendiente" extraTotal={{ label: "Pago de este mes", value: totPago }} color={C.urgente}
            rows={m.deudas || []} cols={[["concepto", "Concepto", "text"], ["dia", "día", "text", "narrow"], ["saldo", "Pendiente", "num"], ["pago", "Pago/mes", "num"]]}
            onAdd={(r) => addRow("deudas", r)} onEdit={(id, p) => editRow("deudas", id, p)} onDel={(id) => delRow("deudas", id)} />
        </>
      )}

      {view === "evolucion" && <Evolucion finance={finance} />}
      {view === "ahorros" && <Ahorros savings={savings} onAdd={onSavAdd} onEdit={onSavEdit} onDel={onSavDel} />}
    </div>
  );
}

function Evolucion({ finance }) {
  const sum = (arr, f) => (arr || []).reduce((a, r) => a + (Number(r[f]) || 0), 0);
  const data = Object.keys(finance).sort().map((k) => {
    const mm = finance[k] || {};
    const ing = sum(mm.ingresos, "monto");
    const gas = sum(mm.egresos, "monto") + sum(mm.deudas, "pago");
    return { k, ing, gas, saldo: ing - gas };
  }).filter((d) => d.ing || d.gas);
  const mLabel = (k) => { const [y, mo] = k.split("-"); return new Date(y, mo - 1, 1).toLocaleDateString("es-CL", { month: "short" }); };
  if (!data.length) return <div className="fade"><div style={S.empty}>Aún no hay meses con datos. Llena al menos un mes en «Mes» y acá verás la evolución.</div></div>;
  const max = Math.max(1, ...data.map((d) => Math.max(d.ing, d.gas)));

  // gastos por ítem a lo largo de los meses (egresos + pagos de deudas, agrupados por concepto)
  const months = data.map((d) => d.k);
  const itemMap = {};
  months.forEach((k) => {
    const mm = finance[k] || {};
    (mm.egresos || []).forEach((e) => {
      const c = (e.concepto || "Sin nombre").trim() || "Sin nombre";
      (itemMap[c] = itemMap[c] || {})[k] = (itemMap[c][k] || 0) + (Number(e.monto) || 0);
    });
    (mm.deudas || []).forEach((e) => {
      const c = (e.concepto || "Deuda").trim() || "Deuda";
      (itemMap[c] = itemMap[c] || {})[k] = (itemMap[c][k] || 0) + (Number(e.pago) || 0);
    });
  });
  let itemList = Object.keys(itemMap).map((c) => ({
    name: c,
    vals: months.map((k) => itemMap[c][k] || 0),
    total: months.reduce((a, k) => a + (itemMap[c][k] || 0), 0),
  })).filter((it) => it.total > 0).sort((a, b) => b.total - a.total);
  const TOP = 7;
  if (itemList.length > TOP) {
    const rest = itemList.slice(TOP);
    const otros = { name: "Otros", vals: months.map((_, i) => rest.reduce((a, it) => a + it.vals[i], 0)), total: rest.reduce((a, it) => a + it.total, 0) };
    itemList = [...itemList.slice(0, TOP), otros];
  }
  const lineColors = ["#2F7E74", "#C2901F", "#BF512C", "#345A78", "#6F8A6F", "#9A7B43", "#3A5A74", "#A98E86"];
  const itemMax = Math.max(1, ...itemList.flatMap((it) => it.vals));
  const CW = Math.max(280, months.length * 64), CH = 180, padL = 10, padR = 10, padT = 12, padB = 26;
  const plotW = CW - padL - padR, plotH = CH - padT - padB;
  const xAt = (i) => padL + (months.length === 1 ? plotW / 2 : (i / (months.length - 1)) * plotW);
  const yAt = (v) => padT + plotH - (v / itemMax) * plotH;

  return (
    <div className="fade">
      <Section label="Ingresos vs. gastos" accent={C.accent}>
        <div style={S.finCard}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 150 }}>
            {data.map((d) => (
              <div key={d.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120, width: "100%", justifyContent: "center" }}>
                  <div title={`Ingresos ${fmtCLP(d.ing)}`} style={{ width: 12, height: `${Math.max(2, (d.ing / max) * 100)}%`, background: C.primary, borderRadius: "3px 3px 0 0", transition: "height .5s ease" }} />
                  <div title={`Gastos ${fmtCLP(d.gas)}`} style={{ width: 12, height: `${Math.max(2, (d.gas / max) * 100)}%`, background: C.accent, borderRadius: "3px 3px 0 0", transition: "height .5s ease" }} />
                </div>
                <span style={{ fontSize: 10.5, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", textTransform: "capitalize" }}>{mLabel(d.k)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: C.textSoft }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: C.primary }} /> Ingresos</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: C.accent }} /> Gastos</span>
          </div>
        </div>
      </Section>
      <Section label="Saldo por mes" accent={C.accent}>
        <div style={S.finCard}>
          {data.map((d) => (
            <div key={d.k} style={S.finRow}>
              <span style={{ flex: 1, fontSize: 13.5, color: C.text, textTransform: "capitalize" }}>{mLabel(d.k)}</span>
              <span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 13.5, fontWeight: 600, color: d.saldo >= 0 ? C.primary : C.urgente }}>{fmtCLP(d.saldo)}</span>
            </div>
          ))}
        </div>
      </Section>
      {itemList.length > 0 && (
        <Section label="Gastos por ítem" accent={C.accent}>
          <div style={S.finCard}>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" style={{ maxWidth: CW, display: "block" }} preserveAspectRatio="xMidYMid meet">
                {[0, 0.5, 1].map((f, gi) => (
                  <line key={gi} x1={padL} y1={padT + plotH * f} x2={CW - padR} y2={padT + plotH * f} stroke={C.border} strokeWidth="1" />
                ))}
                {itemList.map((it, idx) => {
                  const col = lineColors[idx % lineColors.length];
                  const pts = it.vals.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                  return (
                    <g key={it.name}>
                      {months.length > 1 && <polyline points={pts} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
                      {it.vals.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.6" fill={col} />)}
                    </g>
                  );
                })}
                {months.map((k, i) => (
                  <text key={k} x={xAt(i)} y={CH - 8} fontSize="10" fill={C.textMuted} textAnchor="middle" style={{ fontFamily: "'Spline Sans Mono', monospace" }}>{mLabel(k)}</text>
                ))}
              </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12, fontSize: 12, color: C.textSoft }}>
              {itemList.map((it, idx) => (
                <span key={it.name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 14, height: 3, borderRadius: 2, background: lineColors[idx % lineColors.length] }} /> {it.name}
                </span>
              ))}
            </div>
            {months.length === 1 && <div style={S.hint}>Con un solo mes se ven puntos; al tener dos o más meses aparecerán las líneas de tendencia.</div>}
          </div>
        </Section>
      )}
    </div>
  );
}

function Ahorros({ savings, onAdd, onEdit, onDel }) {
  const sum = (arr) => (arr || []).reduce((a, r) => a + (Number(r.monto) || 0), 0);
  const totDep = sum(savings.depositos), totAfp = sum(savings.afp), totApv = sum(savings.apv);
  const patrimonio = totDep + totAfp + totApv;
  return (
    <div className="fade">
      <div style={{ ...S.balCard, marginBottom: 22 }}>
        <div style={S.finBigLabel}>patrimonio ahorrado</div>
        <div style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, lineHeight: 1, color: C.primary }}>{fmtCLP(patrimonio)}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap", fontSize: 13, color: C.textSoft }}>
          <span>Depósitos <b style={{ color: C.text }}>{fmtCLP(totDep)}</b></span>
          <span>AFP <b style={{ color: C.text }}>{fmtCLP(totAfp)}</b></span>
          <span>APV <b style={{ color: C.text }}>{fmtCLP(totApv)}</b></span>
        </div>
      </div>
      <FinSection title="Depósitos a plazo" total={totDep} color={C.primary}
        rows={savings.depositos || []} cols={[["concepto", "Banco / detalle", "text"], ["venc", "vence", "text", "narrow"], ["monto", "Monto", "num"]]}
        onAdd={(r) => onAdd("depositos", r)} onEdit={(id, p) => onEdit("depositos", id, p)} onDel={(id) => onDel("depositos", id)} />
      <FinSection title="AFP · pensión" total={totAfp} color={C.primary}
        rows={savings.afp || []} cols={[["concepto", "Fondo", "text"], ["monto", "Monto", "num"]]}
        onAdd={(r) => onAdd("afp", r)} onEdit={(id, p) => onEdit("afp", id, p)} onDel={(id) => onDel("afp", id)} />
      <FinSection title="APV · aporte voluntario" total={totApv} color={C.primary}
        rows={savings.apv || []} cols={[["concepto", "Fondo", "text"], ["monto", "Monto", "num"]]}
        onAdd={(r) => onAdd("apv", r)} onEdit={(id, p) => onEdit("apv", id, p)} onDel={(id) => onDel("apv", id)} />
    </div>
  );
}


function FinSection({ title, total, totalLabel, extraTotal, color, rows, cols, onAdd, onEdit, onDel }) {
  const [draft, setDraft] = useState({});
  const submit = () => {
    const concepto = String(draft[cols[0][0]] || "").trim();
    if (!concepto) return;
    const row = {};
    cols.forEach(([f, , t]) => { row[f] = t === "num" ? (parseInt(String(draft[f] || "").replace(/\D/g, "")) || 0) : (draft[f] || ""); });
    onAdd(row); setDraft({});
  };
  return (
    <Section label={title} accent={C.accent}>
      <div style={S.finCard}>
        {rows.length === 0 && <div style={{ color: C.textMuted, fontSize: 13, paddingBottom: 8 }}>Sin registros este mes.</div>}
        {rows.map((r) => (
          <div key={r.id} style={S.finRow}>
            {cols.map(([f, ph, t, w], i) => {
              const st = i === 0 ? { flex: 2 } : w === "narrow" ? { width: 46, flex: "none", textAlign: "center", fontFamily: "'Spline Sans Mono', monospace" } : { flex: 1, textAlign: "right", fontFamily: "'Spline Sans Mono', monospace" };
              return <EditField key={f} value={r[f]} type={t} placeholder={ph} onSave={(val) => onEdit(r.id, { [f]: val })} style={{ ...S.finField, ...st }} />;
            })}
            <button onClick={() => onDel(r.id)} className="del" style={S.del} aria-label="Borrar"><Trash2 size={14} /></button>
          </div>
        ))}
        <div style={{ ...S.finRow, borderBottom: "none", marginTop: 2 }}>
          {cols.map(([f, ph, t, w], i) => {
            const st = i === 0 ? { flex: 2 } : w === "narrow" ? { width: 46, flex: "none", textAlign: "center" } : { flex: 1, textAlign: "right" };
            return <input key={f} value={draft[f] || ""} placeholder={ph} inputMode={t === "num" ? "numeric" : "text"}
              onChange={(e) => setDraft((d) => ({ ...d, [f]: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              style={{ ...S.finField, ...st }} />;
          })}
          <button onClick={submit} className="iconbtn" style={{ ...S.iconBtn, width: 30, height: 30, flexShrink: 0 }} aria-label="Agregar"><Plus size={15} /></button>
        </div>
        <div style={S.finTotal}>
          <span>{totalLabel || "Total"}</span>
          <span style={{ fontFamily: "'Spline Sans Mono', monospace", color, fontWeight: 600 }}>{fmtCLP(total)}</span>
        </div>
        {extraTotal && (
          <div style={{ ...S.finTotal, borderTop: "none", paddingTop: 2 }}>
            <span>{extraTotal.label}</span>
            <span style={{ fontFamily: "'Spline Sans Mono', monospace", color: C.text, fontWeight: 600 }}>{fmtCLP(extraTotal.value)}</span>
          </div>
        )}
      </div>
    </Section>
  );
}

function EditField({ value, type, placeholder, onSave, style }) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => { setV(value ?? ""); }, [value]);
  return (
    <input value={v} placeholder={placeholder} inputMode={type === "num" ? "numeric" : "text"}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { const out = type === "num" ? (parseInt(String(v).replace(/\D/g, "")) || 0) : v; if (out !== value) onSave(out); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      style={style} />
  );
}

/* ───────────────────────── METAS DE LARGO PLAZO ───────────────────────── */
function Metas({ goals, areas, onAdd, onPush, onDone, onDel }) {
  const [title, setTitle] = useState("");
  const [areaId, setAreaId] = useState(areas[0]?.id || "");
  const [cad, setCad] = useState(90);
  const submit = () => { if (!title.trim() || !areaId) return; onAdd(title, areaId, cad); setTitle(""); };

  const activas = goals.filter((g) => !g.done);
  const esperando = activas.filter(goalDue).sort((a, b) => (daysBetween(goalRef(b)) || 0) - (daysBetween(goalRef(a)) || 0));
  const enMarcha = activas.filter((g) => !goalDue(g));
  const logradas = goals.filter((g) => g.done);

  const pushLabel = (g) => {
    const d = daysBetween(g.lastPush);
    if (d === null) return "sin empujón aún";
    return d === 0 ? "empujón hoy" : `último empujón hace ${d} ${d === 1 ? "día" : "días"}`;
  };

  const Goal = ({ g, esp }) => {
    const a = areas.find((x) => x.id === g.areaId);
    return (
      <div style={{ ...S.entry, borderLeft: `3px solid ${tint(g.areaId)}`, background: esp ? soft(g.areaId) + "66" : C.surface, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: g.done ? C.textMuted : C.text, fontSize: 14.5, fontFamily: "'Newsreader', serif", fontWeight: 500, textDecoration: g.done ? "line-through" : "none" }}>{g.title}</div>
          <div style={S.entryMeta}>{a?.name || "—"} · recordar {cadLabel(g.cadence)}{!g.done && ` · ${pushLabel(g)}`}</div>
          {!g.done && (
            <div style={{ display: "flex", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
              <button onClick={() => onPush(g.id)} className="navbtn" style={S.pushBtn}>Le di un empujón</button>
              <button onClick={() => onDone(g.id)} className="navbtn" style={S.doneBtn}>Lograda</button>
            </div>
          )}
          {g.done && (
            <button onClick={() => onDone(g.id)} className="navbtn" style={{ ...S.doneBtn, marginTop: 8 }}>Reactivar</button>
          )}
        </div>
        <button onClick={() => onDel(g.id)} className="del" style={S.del} aria-label="Borrar"><Trash2 size={14} /></button>
      </div>
    );
  };

  return (
    <div className="fade">
      <Section label="Metas de largo plazo" accent={C.accent}>
        <div style={S.intro}>Lo que quieres hacer y el día a día te posterga. Acá viven, y la Bitácora te las trae de vuelta cada cierto tiempo —sin fecha que se venza, sin culpa.</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Retomar el francés, planear viaje a…" style={S.input}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        <div style={{ ...S.chips, marginTop: 12 }}>
          {areas.map((a) => (
            <button key={a.id} onClick={() => setAreaId(a.id)} className="chip"
              style={{ ...S.chip, display: "flex", alignItems: "center", gap: 6, ...(areaId === a.id ? { borderColor: tint(a.id), color: C.text, background: soft(a.id) } : {}) }}>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: tint(a.id) }} />{a.name}
            </button>
          ))}
        </div>
        <div style={{ ...S.smallLabel, marginTop: 14, color: C.textMuted }}>recordármela:</div>
        <div style={S.chips}>
          {CADENCIAS.map(([l, d]) => (
            <button key={d} onClick={() => setCad(d)} className="chip"
              style={{ ...S.chip, ...(cad === d ? { borderColor: C.spark, color: C.text, background: C.sparkSoft } : {}) }}>{l}</button>
          ))}
        </div>
        <button onClick={submit} disabled={!title.trim()} className="primary"
          style={{ ...S.primary, opacity: title.trim() ? 1 : 0.45 }}><Plus size={15} strokeWidth={2.2} /> Agregar meta</button>
      </Section>

      {esperando.length > 0 && (
        <Section label="Te están esperando" accent={C.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{esperando.map((g) => <Goal key={g.id} g={g} esp />)}</div>
        </Section>
      )}

      <Section label="En marcha" accent={C.accent}>
        {enMarcha.length === 0 ? <div style={S.empty}>No tienes metas activas todavía. Agrega una arriba —algo que el trabajo te haya estado postergando.</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{enMarcha.map((g) => <Goal key={g.id} g={g} />)}</div>
        )}
      </Section>

      {logradas.length > 0 && (
        <Section label="Logradas" accent={C.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{logradas.map((g) => <Goal key={g.id} g={g} />)}</div>
        </Section>
      )}
    </div>
  );
}

/* ───────────────────────── ÁREAS ───────────────────────── */
function AreasCfg({ areas, onImp, onKind, onAdd, onDel }) {
  const [nueva, setNueva] = useState("");
  return (
    <div className="fade">
      <Section label="Tus áreas" accent={C.accent}>
        <div style={S.intro}>La importancia define el semáforo. El tipo (vida o trabajo) decide qué se silencia en el foco "Vida personal" y alimenta el balance del Tablero.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {areas.map((a) => {
            const Icon = iconFor(a.id);
            return (
              <div key={a.id} style={{ ...S.cfgRow, background: soft(a.id) + "77", borderLeft: `3px solid ${tint(a.id)}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: 124, flexShrink: 0 }}>
                  <Icon size={15} color={tint(a.id)} strokeWidth={1.9} /><span style={S.panelName}>{a.name}</span>
                </div>
                <div style={S.kindSeg}>
                  {[["vida", "vida"], ["trabajo", "trabajo"]].map(([k, l]) => (
                    <button key={k} onClick={() => onKind(a.id, k)} className="navbtn"
                      style={{ ...S.kindSegBtn, ...((a.kind || "vida") === k ? S.kindSegBtnOn : {}) }}>{l}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 5, flex: 1, minWidth: 90 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => onImp(a.id, n)} className="dot"
                      style={{ ...S.dot, ...(n <= a.importance ? { background: C.spark, borderColor: C.spark } : { background: "#FFFFFF99" }) }} aria-label={`importancia ${n}`} />
                  ))}
                </div>
                <button onClick={() => onDel(a.id)} className="del" style={S.del} aria-label="Eliminar área"><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <input value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Nueva área…" style={S.input}
            onKeyDown={(e) => { if (e.key === "Enter" && nueva.trim()) { onAdd(nueva); setNueva(""); } }} />
          <button onClick={() => { if (nueva.trim()) { onAdd(nueva); setNueva(""); } }} className="primary"
            style={{ ...S.primary, marginTop: 0, width: "auto", padding: "0 16px" }}><Plus size={15} strokeWidth={2.2} /> Agregar</button>
        </div>
      </Section>
    </div>
  );
}

/* ───────────────────────── dato del día ───────────────────────── */
function DailySpark() {
  const todayIdx = dayOfYear() % DATOS.length;
  const [idx, setIdx] = useState(todayIdx);
  const d = DATOS[idx], c = CAT[d.cat], Ic = c.icon;
  const otro = () => { let n = idx; while (n === idx && DATOS.length > 1) n = Math.floor(Math.random() * DATOS.length); setIdx(n); };
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${C.border}`, borderLeft: `4px solid ${c.color}`, borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic size={15} color={c.color} strokeWidth={1.9} />
        </span>
        <span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: c.color }}>{c.label}</span>
        <span style={{ marginLeft: "auto", fontFamily: "'Spline Sans Mono', monospace", fontSize: 10.5, color: C.textMuted, letterSpacing: ".06em" }}>dato del día</span>
      </div>
      <p style={{ fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.5, color: C.text, margin: 0, fontWeight: 400 }}>{d.t}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 10 }}>
        <span style={{ fontSize: 12.5, color: C.textSoft, fontStyle: "italic", fontFamily: "'Newsreader', serif" }}>{d.f || ""}</span>
        <button onClick={otro} className="navbtn" style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: c.color, fontSize: 12, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, padding: 0 }}>
          <RefreshCw size={12} /> otro
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── piezas ───────────────────────── */
function Section({ label, accent, children }) {
  return <section style={{ marginBottom: 26 }}><div style={{ ...S.sectionLabel, color: C.onBg }}>{label}</div>{children}</section>;
}
function Stat({ big, unit, label, accent, bg }) {
  return (
    <div style={{ ...S.stat, background: bg || C.surface }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ ...S.statBig, color: accent || C.text }}>{big}</span><span style={S.statUnit}>{unit}</span>
      </div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}
function Importance({ value }) {
  return (
    <div style={{ display: "flex", gap: 3 }} title={`importancia ${value}/5`}>
      {[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ width: 5, height: 5, borderRadius: 5, background: n <= value ? C.spark : "#FFFFFFAA" }} />)}
    </div>
  );
}
function Fonts() {
  return <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap');`}</style>;
}

/* ───────────────────────── estilos ───────────────────────── */
const makeS = (C) => ({
  root: { background: C.bg, minHeight: "100vh", width: "100%", color: C.text, fontFamily: "'Hanken Grotesk', system-ui, sans-serif", WebkitFontSmoothing: "antialiased" },
  wrap: { maxWidth: 980, margin: "0 auto", padding: "28px 18px 48px", position: "relative", zIndex: 1 },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 22 },
  logo: { width: 42, height: 42, borderRadius: 12, background: `linear-gradient(140deg, ${C.tranquilo}, ${C.bgDeep})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontFamily: "'Newsreader', serif", fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: "-.01em", lineHeight: 1, color: C.onBg },
  subtitle: { color: C.onBgDim, fontSize: 13.5, marginTop: 3, fontStyle: "italic", fontFamily: "'Newsreader', serif" },
  nav: { display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", justifyContent: "center" },
  navBtn: { background: "none", border: "none", color: C.textSoft, fontSize: 14, fontWeight: 500, padding: "9px 14px", cursor: "pointer", borderBottom: "2px solid transparent", marginBottom: -1, fontFamily: "inherit" },
  navBtnOn: { color: C.text, borderBottom: `2px solid ${C.spark}` },

  weekNav: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  weekRange: { fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: C.onBg },
  linkBtn: { background: "none", border: "none", color: C.onBgDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit", padding: "2px 0", textDecoration: "underline" },
  iconBtn: { background: C.surface, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  weekGrid: { display: "grid", gridTemplateColumns: "repeat(7, minmax(118px, 1fr))", gap: 8, overflowX: "auto", paddingBottom: 2 },
  dayCol: { background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, minHeight: 120, display: "flex", flexDirection: "column" },
  dayHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` },
  dayName: { fontFamily: "'Newsreader', serif", fontSize: 14, fontWeight: 600, color: C.text, textTransform: "capitalize" },
  dayDate: { fontFamily: "'Spline Sans Mono', monospace", fontSize: 12, color: C.textMuted },
  dayEmpty: { color: C.textMuted, fontSize: 13, padding: "2px 0" },
  task: { display: "flex", alignItems: "flex-start", gap: 7, padding: "3px 2px" },
  check: { width: 16, height: 16, borderRadius: 16, border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 1, padding: 0 },
  taskText: { fontSize: 13, lineHeight: 1.35, color: C.text, flex: 1, minWidth: 0, wordBreak: "break-word" },
  dayInput: { width: "100%", marginTop: "auto", background: "#FFFFFFAA", border: "1px solid", borderRadius: 7, color: C.text, padding: "7px 9px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  hint: { marginTop: 14, color: C.onBgDim, fontSize: 12.5, fontStyle: "italic", fontFamily: "'Newsreader', serif" },

  calWrap: { margin: "24px auto 0", maxWidth: 720 },
  calMonthsRow: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 },
  calMonth: { flex: "1 1 200px", maxWidth: 232, minWidth: 162, boxSizing: "border-box", border: `1px solid ${C.border}`, borderRadius: 12, padding: 11 },
  calMonthCur: { background: "#FFFFFF", borderColor: C.spark },
  calMonthOther: { background: C.primarySoft },
  calMonthTitle: { textAlign: "center", fontFamily: "'Newsreader', serif", fontSize: 13, color: C.text, textTransform: "capitalize", fontWeight: 600, marginBottom: 6 },
  calHead: { display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginBottom: 12 },
  calTitle: { fontFamily: "'Newsreader', serif", fontSize: 13.5, color: C.text, textTransform: "capitalize", fontWeight: 600 },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, minWidth: 0 },
  calDow: { textAlign: "center", fontSize: 9.5, color: C.textMuted, fontFamily: "'Spline Sans Mono', monospace", paddingBottom: 2 },
  calCell: { position: "relative", aspectRatio: "1 / 1", minWidth: 0, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid transparent", borderRadius: 7, color: C.textSoft, fontSize: 11, fontFamily: "'Spline Sans Mono', monospace", cursor: "pointer" },
  calCellWeek: { background: C.surfaceAlt, borderColor: C.border },
  calCellToday: { borderColor: C.spark, color: C.text, fontWeight: 700 },
  calDot: { position: "absolute", bottom: 2.5, left: "50%", transform: "translateX(-50%)", width: 4.5, height: 4.5, borderRadius: 5 },
  calLegend: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px 12px", marginTop: 9, fontSize: 10, color: C.textSoft, fontFamily: "'Spline Sans Mono', monospace" },

  habitsCard: { margin: "22px auto 0", maxWidth: 720, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" },
  habitsHead: { display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 12, color: C.text, fontFamily: "'Newsreader', serif", fontSize: 15, fontWeight: 600 },
  habitsCount: { fontFamily: "'Spline Sans Mono', monospace", fontSize: 12.5, color: C.textSoft, fontWeight: 400 },
  habitsRow: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  habitChip: { display: "inline-flex", alignItems: "center", gap: 6, background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 9, padding: "8px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },
  habitChipOn: { background: C.sparkSoft, borderColor: C.spark, color: C.text },
  habitsHint: { marginTop: 12, textAlign: "center", color: C.onBgDim, fontSize: 12, fontStyle: "italic", fontFamily: "'Newsreader', serif" },

  notesWrap: { margin: "22px auto 0", maxWidth: 720, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" },
  notesHead: { display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: C.text, fontFamily: "'Newsreader', serif", fontSize: 15, fontWeight: 600 },
  notesInput: { flex: 1, minWidth: 0, background: "#FFFFFFAA", border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, padding: "10px 14px", fontSize: 14, fontFamily: "'Newsreader', serif", outline: "none", boxSizing: "border-box" },
  notesAdd: { display: "inline-flex", alignItems: "center", gap: 5, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, padding: "0 14px", fontSize: 13, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap" },
  notesEmpty: { color: C.onBgDim, fontSize: 13, fontStyle: "italic", fontFamily: "'Newsreader', serif" },
  noteRow: { display: "flex", alignItems: "flex-start", gap: 8, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 11px", fontSize: 14, color: C.text, fontFamily: "'Newsreader', serif" },

  summaryRow: { display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap" },
  stat: { flex: 1, minWidth: 140, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" },
  statBig: { fontFamily: "'Newsreader', serif", fontSize: 34, fontWeight: 600, lineHeight: 1 },
  statUnit: { color: C.textSoft, fontSize: 13 },
  statLabel: { color: C.textSoft, fontSize: 11.5, marginTop: 6, textTransform: "lowercase" },

  sectionLabel: { fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" },
  dateInput: { border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 7px", fontSize: 12, fontFamily: "'Spline Sans Mono', monospace", color: C.text, background: C.surfaceAlt, cursor: "pointer" },
  areasBtn: { display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  areasBtnOn: { borderColor: C.spark, color: C.text, background: C.sparkSoft },
  intro: { color: C.onBgDim, fontSize: 13, marginBottom: 16, lineHeight: 1.5 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 },
  panel: { border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, transition: "box-shadow .2s, transform .2s" },
  areaIcon: { width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  panelName: { fontFamily: "'Newsreader', serif", fontSize: 17, fontWeight: 500, color: C.text },
  panelMeta: { fontSize: 13, marginTop: 6 },
  statusPill: { display: "inline-block", fontSize: 11, fontFamily: "'Spline Sans Mono', monospace", border: "1px solid", borderRadius: 5, padding: "2px 7px" },

  suggest: { display: "flex", gap: 10, alignItems: "baseline", border: "1px solid", borderRadius: 8, padding: "11px 13px", fontSize: 14, lineHeight: 1.45 },
  b: { color: C.accent, fontWeight: 600 },
  empty: { color: C.textSoft, fontSize: 13.5, background: C.surface, border: `1px dashed ${C.border}`, borderRadius: 8, padding: "16px 18px", lineHeight: 1.5 },

  barLabel: { width: 84, fontSize: 13, color: C.onBg, flexShrink: 0, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  barTrack: { flex: 1, height: 9, background: C.surfaceAlt, borderRadius: 4, overflow: "hidden" },
  barVal: { width: 28, fontSize: 12, color: C.onBg, fontFamily: "'Spline Sans Mono', monospace", flexShrink: 0, textAlign: "right" },

  chips: { display: "flex", flexWrap: "wrap", gap: 7 },
  chip: { background: C.surface, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 7, padding: "7px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" },
  kindBtn: { display: "flex", alignItems: "center", gap: 6, background: C.surface, border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 7, padding: "8px 13px", fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 },
  kindBtnOn: { background: C.accentSoft, borderColor: C.accent, color: C.urgente },
  textarea: { width: "100%", marginTop: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, padding: "12px 14px", fontSize: 14.5, fontFamily: "inherit", resize: "vertical", lineHeight: 1.5, boxSizing: "border-box", outline: "none" },
  input: { flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  smallLabel: { fontSize: 11.5, color: C.onBgDim, marginBottom: 7, fontFamily: "'Spline Sans Mono', monospace", textTransform: "lowercase" },
  primary: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 16, width: "100%", background: C.primaryDark, color: C.onPrimary, border: "none", borderRadius: 9, padding: "12px", fontSize: 14.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" },

  entry: { display: "flex", gap: 10, alignItems: "flex-start", border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px" },
  kindTag: { display: "flex", alignItems: "center", marginTop: 2, flexShrink: 0 },
  entryMeta: { fontSize: 11.5, color: C.textSoft, marginTop: 4, fontFamily: "'Spline Sans Mono', monospace" },
  noteField: { width: "100%", marginTop: 8, background: "#FFFFFFAA", border: `1px solid ${C.border}`, borderRadius: 7, color: C.textSoft, padding: "7px 10px", fontSize: 13, fontFamily: "'Newsreader', serif", fontStyle: "italic", resize: "vertical", lineHeight: 1.45, boxSizing: "border-box", outline: "none" },
  finCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" },
  finRow: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.border}` },
  finField: { background: "transparent", border: "none", borderBottom: `1px solid transparent`, color: C.text, padding: "5px 4px", fontSize: 13.5, fontFamily: "inherit", outline: "none", minWidth: 0, boxSizing: "border-box" },
  finTotal: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 8, fontSize: 13, color: C.textSoft, fontWeight: 500 },
  finBigLabel: { fontSize: 11.5, color: C.textMuted, marginBottom: 6, fontFamily: "'Spline Sans Mono', monospace", textTransform: "lowercase", letterSpacing: ".04em" },
  learnRow: { display: "flex", gap: 10, alignItems: "flex-start", border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px" },
  del: { background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 5, borderRadius: 6, flexShrink: 0, display: "flex", transition: "color .15s" },
  pushBtn: { background: C.sparkSoft, border: `1px solid ${C.spark}`, color: C.onSpark, borderRadius: 999, padding: "5px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  doneBtn: { background: "none", border: `1px solid ${C.border}`, color: C.textSoft, borderRadius: 999, padding: "5px 13px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  dot: { width: 26, height: 26, borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all .15s", padding: 0 },
  cfgRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, flexWrap: "wrap" },
  focusRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  segment: { display: "inline-flex", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 2 },
  segBtn: { background: "none", border: "none", color: C.textSoft, fontSize: 13, fontWeight: 500, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", borderRadius: 6 },
  segBtnOn: { background: C.spark, color: C.onSpark },
  focusNote: { fontSize: 12, color: C.onBgDim, fontStyle: "italic", fontFamily: "'Newsreader', serif" },
  kindSeg: { display: "inline-flex", background: "#FFFFFF99", border: `1px solid ${C.border}`, borderRadius: 7, padding: 2, flexShrink: 0 },
  kindSegBtn: { background: "none", border: "none", color: C.textMuted, fontSize: 11.5, fontWeight: 500, padding: "3px 9px", cursor: "pointer", fontFamily: "inherit", borderRadius: 5 },
  kindSegBtnOn: { background: C.primary, color: C.onPrimary },
  balCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" },
  balBar: { display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: C.surfaceAlt },
  balLegend: { display: "flex", gap: 18, marginTop: 12, fontSize: 13, color: C.textSoft },
  balMsg: { marginTop: 10, fontSize: 13.5, color: C.text, fontFamily: "'Newsreader', serif", fontStyle: "italic", lineHeight: 1.45 },
  footer: { color: C.onBgDim, fontSize: 11.5, textAlign: "center", marginTop: 12, fontFamily: "'Spline Sans Mono', monospace" },
  paleta: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 30 },
  paletaLabel: { fontSize: 10.5, color: C.onBgDim, fontFamily: "'Spline Sans Mono', monospace", letterSpacing: ".14em", textTransform: "uppercase" },
});

const makeCSS = (C) => `
  * { box-sizing: border-box; }
  .fade { animation: fade .35s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .panel:hover { box-shadow: 0 8px 22px -8px rgba(49,60,68,.22); transform: translateY(-1px); }
  .chip:hover { color: ${C.text}; } .navbtn:hover { opacity: .85; }
  .del:hover { color: ${C.urgente}; }
  .dot:hover, .iconbtn:hover { border-color: ${C.primary}; }
  .primary:hover { filter: brightness(1.08); }
  .task .del { opacity: 0; transition: opacity .15s; }
  .task:hover .del { opacity: 1; }
  textarea:focus, input:focus { border-color: ${C.primary} !important; }
  button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid ${C.primary}; outline-offset: 2px; }
  ::placeholder { color: ${C.textMuted}; }
  .weekgrid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px; padding-bottom: 2px; }
  .weekgrid .daycol { grid-column: span 2; min-width: 0; box-sizing: border-box; }
  .weekgrid .daycol.sat { grid-column: 4 / span 2; }
  .weekgrid .daycol.sun { grid-column: 6 / span 2; }
  @media (max-width: 640px) { .weekgrid { grid-template-columns: 1fr; } .weekgrid .daycol, .weekgrid .daycol.sat, .weekgrid .daycol.sun { grid-column: auto; } }
  @media (max-width: 720px) { .leftrail { display: none !important; } }
  @media (prefers-reduced-motion: reduce) { .fade { animation: none; } .panel { transition: none; } * { transition-duration: .01ms !important; } }
`;

applyPalette("mint");

/* ───────────────────────── Login + portero de sesión ───────────────────────── */
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState("in"); // "in" = entrar, "up" = crear cuenta
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !pass) { setMsg("Escribe tu correo y contraseña."); return; }
    setMsg(""); setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        setMsg("¡Cuenta creada! Si no entra sola, escribe tu correo y contraseña y entra.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      }
    } catch (e) {
      const m = (e && e.message) || "";
      if (/invalid login/i.test(m)) setMsg("Correo o contraseña incorrectos.");
      else if (/already registered/i.test(m)) setMsg("Ese correo ya tiene cuenta. Cambia a 'Entrar'.");
      else if (/at least 6/i.test(m)) setMsg("La contraseña debe tener al menos 6 caracteres.");
      else setMsg(m || "Algo salió mal. Intenta de nuevo.");
    } finally { setBusy(false); }
  };

  return (
    <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Fonts /><style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 360, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "30px 26px", boxShadow: "0 12px 40px -16px rgba(20,30,40,.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
          <div style={S.logo}><Library size={22} color={C.onPrimary} strokeWidth={1.8} /></div>
          <div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 22, color: C.text, fontWeight: 600 }}>Bitácora</div>
            <div style={{ fontSize: 12.5, color: C.textSoft }}>{mode === "up" ? "Crea tu cuenta" : "Inicia sesión"}</div>
          </div>
        </div>
        <label style={{ fontSize: 12, color: C.textSoft }}>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
          style={{ width: "100%", margin: "5px 0 14px", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.surface }} />
        <label style={{ fontSize: 12, color: C.textSoft }}>Contraseña</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          style={{ width: "100%", margin: "5px 0 18px", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.surface }} />
        <button onClick={submit} disabled={busy} className="primary"
          style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: C.primary, color: C.onPrimary, fontSize: 14.5, fontWeight: 600, cursor: busy ? "default" : "pointer", fontFamily: "inherit", opacity: busy ? 0.7 : 1 }}>
          {busy ? "Un momento…" : (mode === "up" ? "Crear cuenta" : "Entrar")}
        </button>
        {msg && <div style={{ marginTop: 12, fontSize: 12.5, color: C.textSoft, lineHeight: 1.4 }}>{msg}</div>}
        <div style={{ marginTop: 16, fontSize: 12.5, color: C.textSoft, textAlign: "center" }}>
          {mode === "up" ? "¿Ya tienes cuenta? " : "¿Primera vez? "}
          <button onClick={() => { setMode(mode === "up" ? "in" : "up"); setMsg(""); }}
            style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, textDecoration: "underline", padding: 0 }}>
            {mode === "up" ? "Entrar" : "Crear una cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [session, setSession] = useState(undefined); // undefined = cargando
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Fonts /><div style={{ color: C.textSoft, fontFamily: "'Hanken Grotesk', sans-serif" }}>Cargando…</div>
      </div>
    );
  }
  if (!session) return <Login />;
  return <BitacoraApp key={session.user.id} />;
}

export default Root;
