import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { TOPICS } from "./src/data/topics.js";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "assignments_db.json");

// Middleware to parse JSON
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI features will be unavailable.");
}

// Data models
interface Assignment {
  id: string;
  topicId: number;
  groupName: string;
  students: string;
  assignedAt: string;
  classroom: string;
  guideMarkdown?: string;
  comments?: string;
  grade?: string;
}

// File-based database fallback operations
function loadAssignmentsFromFile(): Assignment[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, resetting:", error);
  }
  return [];
}

function saveAssignmentsToFile(assignments: Assignment[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(assignments, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

// MySQL Configuration and Connection Pool
const dbConfig = {
  host: 'medaidjv.jvmhost.net',
  database: 'medaidjv_noelia',
  user: 'medaidjv_noelia_post',
  password: 'elkoko2812',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10s connection timeout
};

let pool: mysql.Pool | null = null;
let useMysql = false;

async function initMysql() {
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    console.log("Successfully connected to MySQL at medaidjv.jvmhost.net");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(50) PRIMARY KEY,
        topicId INT NOT NULL,
        groupName VARCHAR(255) NOT NULL,
        students TEXT,
        assignedAt VARCHAR(50) NOT NULL,
        guideMarkdown LONGTEXT,
        comments TEXT,
        grade VARCHAR(100),
        classroom VARCHAR(50) NOT NULL DEFAULT 'DIGI'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try {
      await conn.query("ALTER TABLE assignments ADD COLUMN classroom VARCHAR(50) NOT NULL DEFAULT 'DIGI'");
      console.log("Successfully ran ALTER TABLE for classroom column check.");
    } catch (alterErr) {
      // Column probably already exists, which is expected on subsequent runs
    }
    console.log("MySQL table 'assignments' created or verified.");
    conn.release();
    useMysql = true;
  } catch (err) {
    console.error("Failed to connect or initialize MySQL, falling back to local file database:", err);
    useMysql = false;
  }
}

// Run database initialization
initMysql();

// Unified Database operations with fallback
async function getAllAssignments(): Promise<Assignment[]> {
  if (useMysql && pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM assignments ORDER BY assignedAt DESC");
      return rows as Assignment[];
    } catch (err) {
      console.error("MySQL getAllAssignments error, trying JSON fallback:", err);
    }
  }
  return loadAssignmentsFromFile();
}

async function getAssignmentById(id: string): Promise<Assignment | null> {
  if (useMysql && pool) {
    try {
      const [rows]: any = await pool.query("SELECT * FROM assignments WHERE id = ?", [id]);
      if (rows.length > 0) {
        return rows[0] as Assignment;
      }
      return null;
    } catch (err) {
      console.error("MySQL getAssignmentById error, trying JSON fallback:", err);
    }
  }
  const fileAssignments = loadAssignmentsFromFile();
  return fileAssignments.find(a => a.id === id) || null;
}

async function createAssignment(as: Assignment): Promise<void> {
  if (useMysql && pool) {
    try {
      await pool.query(
        "INSERT INTO assignments (id, topicId, groupName, students, assignedAt, classroom, guideMarkdown, comments, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [as.id, as.topicId, as.groupName, as.students, as.assignedAt, as.classroom || "DIGI", as.guideMarkdown || null, as.comments || null, as.grade || null]
      );
      return;
    } catch (err) {
      console.error("MySQL createAssignment error, writing to file fallback:", err);
    }
  }
  const assignments = loadAssignmentsFromFile();
  assignments.push({ ...as, classroom: as.classroom || "DIGI" });
  saveAssignmentsToFile(assignments);
}

async function updateAssignment(id: string, updates: Partial<Assignment>): Promise<void> {
  if (useMysql && pool) {
    try {
      // Filter out keys with undefined/null or not inside DB schema
      const allowedFields = ["topicId", "groupName", "students", "assignedAt", "classroom", "guideMarkdown", "comments", "grade"];
      const fields = Object.keys(updates).filter(k => allowedFields.includes(k));
      if (fields.length > 0) {
        const setClause = fields.map(field => `\`${field}\` = ?`).join(", ");
        const values = fields.map(field => {
          const val = (updates as any)[field];
          return val === undefined ? null : val;
        });
        values.push(id);
        await pool.query(`UPDATE assignments SET ${setClause} WHERE id = ?`, values);
        return;
      }
    } catch (err) {
      console.error("MySQL updateAssignment error, writing to file fallback:", err);
    }
  }
  const assignments = loadAssignmentsFromFile();
  const idx = assignments.findIndex(a => a.id === id);
  if (idx !== -1) {
    assignments[idx] = { ...assignments[idx], ...updates };
    saveAssignmentsToFile(assignments);
  }
}

async function deleteAssignment(id: string): Promise<void> {
  if (useMysql && pool) {
    try {
      await pool.query("DELETE FROM assignments WHERE id = ?", [id]);
      return;
    } catch (err) {
      console.error("MySQL deleteAssignment error, writing to file fallback:", err);
    }
  }
  let assignments = loadAssignmentsFromFile();
  assignments = assignments.filter(a => a.id !== id);
  saveAssignmentsToFile(assignments);
}

async function resetAssignments(classroom?: string): Promise<void> {
  if (useMysql && pool) {
    try {
      if (classroom) {
        await pool.query("DELETE FROM assignments WHERE UPPER(classroom) = ?", [classroom.toUpperCase()]);
      } else {
        await pool.query("DELETE FROM assignments");
      }
      return;
    } catch (err) {
      console.error("MySQL resetAssignments error, writing to file fallback:", err);
    }
  }
  if (classroom) {
    const assignments = loadAssignmentsFromFile();
    const remaining = assignments.filter(a => (a.classroom || 'DIGI').toUpperCase() !== classroom.toUpperCase());
    saveAssignmentsToFile(remaining);
  } else {
    saveAssignmentsToFile([]);
  }
}

// ==================== API ROUTES ====================

// Get all topics, marked with availability status
app.get("/api/topics", async (req, res) => {
  try {
    const classroom = (req.query.classroom as string || 'DIGI').toUpperCase();
    const allAssignments = await getAllAssignments();
    const assignments = allAssignments.filter(a => (a.classroom || 'DIGI').toUpperCase() === classroom);
    const assignedTopicIds = new Set(assignments.map((a) => a.topicId));

    const response = TOPICS.map((topic) => ({
      ...topic,
      isAssigned: assignedTopicIds.has(topic.id),
      assignedTo: assignments.find((a) => a.topicId === topic.id)?.groupName || null,
    }));

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const classroom = req.query.classroom as string;
    const assignments = await getAllAssignments();
    if (classroom) {
      const cls = classroom.toUpperCase();
      const filtered = assignments.filter(a => (a.classroom || 'DIGI').toUpperCase() === cls);
      return res.json(filtered);
    }
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Assign a topic to a group
app.post("/api/assignments/assign", async (req, res) => {
  const { groupName, students, topicId, classroom } = req.body;
  const targetClassroom = (classroom || 'DIGI').toUpperCase();

  if (!groupName || !groupName.trim()) {
    return res.status(400).json({ error: "El nombre del grupo es obligatorio." });
  }

  try {
    const allAssignments = await getAllAssignments();
    const classroomAssignments = allAssignments.filter(
      (a) => (a.classroom || 'DIGI').toUpperCase() === targetClassroom
    );

    // Prevent a group from receiving multiple assignments (unique group name check within this classroom)
    const cleanedGroupName = groupName.trim();
    const groupExists = classroomAssignments.some(
      (a) => a.groupName.toLowerCase().trim() === cleanedGroupName.toLowerCase()
    );

    if (groupExists) {
      return res.status(400).json({
        error: `El equipo "${cleanedGroupName}" ya está registrado en el grupo ${targetClassroom}. Cada equipo solo puede tener un tema activo.`
      });
    }

    // Find assigned topics within THIS classroom to filter out
    const assignedTopicIds = new Set(classroomAssignments.map((a) => a.topicId));

    let finalTopicId: number;

    if (topicId) {
      // If a specific topic is requested
      const tid = parseInt(topicId);
      if (isNaN(tid) || tid < 1 || tid > 49) {
        return res.status(400).json({ error: "ID de tema inválido." });
      }
      if (assignedTopicIds.has(tid)) {
        return res.status(400).json({ error: "Este tema ya está asignado a otro equipo en este grupo." });
      }
      finalTopicId = tid;
    } else {
      // Pick an unassigned topic randomly
      const unassignedTopics = TOPICS.filter((t) => !assignedTopicIds.has(t.id));
      if (unassignedTopics.length === 0) {
        return res.status(400).json({ error: `Todos los temas de investigación ya han sido asignados en el grupo ${targetClassroom}.` });
      }
      const randomIndex = Math.floor(Math.random() * unassignedTopics.length);
      finalTopicId = unassignedTopics[randomIndex].id;
    }

    // Create new assignment
    const newAssignment: Assignment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topicId: finalTopicId,
      groupName: cleanedGroupName,
      students: students ? students.trim() : "",
      assignedAt: new Date().toISOString(),
      classroom: targetClassroom,
    };

    await createAssignment(newAssignment);
    res.status(201).json(newAssignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update an assignment (Teacher Panel action)
app.put("/api/assignments/:id", async (req, res) => {
  const { id } = req.params;
  const { topicId, students, comments, grade, classroom } = req.body;

  try {
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ error: "Asignación no encontrada." });
    }

    const updates: Partial<Assignment> = {};

    if (students !== undefined) {
      updates.students = students.trim();
    }
    if (comments !== undefined) {
      updates.comments = comments.trim();
    }
    if (grade !== undefined) {
      updates.grade = grade.trim();
    }
    if (classroom !== undefined) {
      updates.classroom = classroom.trim().toUpperCase();
    }

    if (topicId !== undefined) {
      const newTopicId = parseInt(topicId);
      if (isNaN(newTopicId) || newTopicId < 1 || newTopicId > 49) {
        return res.status(400).json({ error: "ID de tema inválido." });
      }

      // Check if topic is already assigned to another group inside the same classroom
      const assignments = await getAllAssignments();
      const currentClassroom = (assignment.classroom || "DIGI").toUpperCase();
      const topicAssignedOther = assignments.some(
        (a) => a.topicId === newTopicId && a.id !== id && (a.classroom || "DIGI").toUpperCase() === currentClassroom
      );

      if (topicAssignedOther) {
        return res.status(400).json({ error: `El tema seleccionado ya está asignado a otro equipo en el grupo ${currentClassroom}.` });
      }

      updates.topicId = newTopicId;

      // Reset the generated AI guide if the topic has changed, so it regenerates correctly
      if (assignment.topicId !== newTopicId) {
        updates.guideMarkdown = "";
      }
    }

    await updateAssignment(id, updates);
    const updated = await getAssignmentById(id);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Release / Delete an assignment
app.delete("/api/assignments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ error: "Asignación no encontrada." });
    }

    await deleteAssignment(id);
    res.json({ success: true, message: "Asignación eliminada correctamente." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset all or specific classroom assignments
app.post("/api/assignments/reset", async (req, res) => {
  const { classroom } = req.body;
  try {
    await resetAssignments(classroom);
    res.json({ success: true, message: classroom ? `Las asignaciones del aula ${classroom} han sido restablecidas.` : "Todas las asignaciones han sido restablecidas." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to call Gemini API with retries and model fallbacks to handle high demand (503) or transient errors
async function generateContentWithFallback(aiClient: GoogleGenAI, prompt: string, temperature = 0.8) {
  // We prioritize gemini-3.1-flash-lite as it has extremely high availability and speed, especially during peak times when other models might face 503/high-demand.
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];
  const maxRetriesPerModel = 2; // Keep attempts low per model to quickly cycle through fallbacks and avoid HTTP request timeouts
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 1000; // start with 1s delay
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`Calling Gemini API using model "${model}" (attempt ${attempt}/${maxRetriesPerModel})...`);
        const response = await aiClient.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            temperature: temperature,
          },
        });
        
        if (response && response.text) {
          console.log(`Successfully generated content using model "${model}".`);
          return response;
        }
        
        throw new Error(`Empty response received from Gemini API using model ${model}`);
      } catch (error: any) {
        lastError = error;
        console.error(`Error on model "${model}" (attempt ${attempt}/${maxRetriesPerModel}):`, error?.message || error);
        
        // If we are at the last attempt of the last model, don't wait anymore, just throw
        if (model === modelsToTry[modelsToTry.length - 1] && attempt === maxRetriesPerModel) {
          break;
        }
        
        // Wait with exponential backoff before the next attempt or next model
        const waitTime = attempt < maxRetriesPerModel ? delay : 1000;
        console.log(`Waiting ${waitTime}ms before the next try...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        if (attempt < maxRetriesPerModel) {
          delay *= 2; // double the delay for the same model
        }
      }
    }
  }
  
  throw lastError || new Error("Failed to generate content with all available models and retries.");
}

// Generate or retrieve the personalized research guide for an assigned topic
app.post("/api/assignments/:id/guide", async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ error: "Asignación no encontrada." });
    }

    // If already generated, return it
    if (assignment.guideMarkdown && assignment.guideMarkdown.trim()) {
      return res.json({ guideMarkdown: assignment.guideMarkdown });
    }

    // Find the topic details
    const topic = TOPICS.find((t) => t.id === assignment.topicId);
    if (!topic) {
      return res.status(404).json({ error: "Tema no encontrado en el catálogo." });
    }

    if (!ai) {
      return res.status(503).json({
        error: "El servicio de Gemini no está configurado. Por favor, añade la API Key en Settings > Secrets.",
      });
    }

    const prompt = `
Actúa como un profesor excelente de instituto para la asignatura/unidad "Método científico y cómo ejercer una ciudadanía digital crítica".
Genera una guía de investigación e introducción rigurosa, motivadora y atractiva para los alumnos del grupo "${assignment.groupName}" que realizarán su proyecto sobre el tema:
"${topic.id}. ${topic.title}".

Preguntas iniciales o hilos sugeridos para este tema:
${topic.subtopics.map((s) => `- ${s}`).join("\n")}

La guía debe estar redactada en un tono cercano pero con alto rigor científico, adecuado para alumnos de secundaria/bachillerato. Utiliza formato Markdown limpio y estructurado con títulos descriptivos, listas, énfasis y bloques de cita destacados. 

La "Guía de Investigación" debe incluir las siguientes secciones EXACTAS:

# 📚 Guía de Investigación: ${topic.title}
*Preparado especialmente para el grupo: **${assignment.groupName}***

## 1. 🌟 Introducción al Tema
(Escribe una introducción interesante y con enfoque divulgador y motivador de 2-3 párrafos que despierte la curiosidad de los alumnos. Explica por qué este tema es relevante en el universo científico y qué fenómenos físicos, químicos, biológicos o sociales están involucrados. Destaca la importancia de estudiar este tema con mentalidad crítica). Evita expresiones grandilocuentes como: fascinante viaje, aventura del saber, increíble investigación, etc a la hora de describir la tarea.

## 2. 🔍 Enfoque desde el Método Científico
(Define qué hipótesis iniciales podrían plantear los alumnos sobre este tema. Sugiere un pequeño experimento sencillo, análisis de datos históricos, o modelado matemático que les ayude a entender los principios fundamentales. Ten en cuenta que los alumnos no disponen de laboratorio físico en el que poder hacer experimentos físicos, químicos o biológicos, así que si propones experimentos deben poder realizarse en un ordenador con conexión a internet y sin software específico. Explica cómo aplicar el rigor científico para resolver las preguntas clave y cómo consultar fuentes fiables y literatura científica).

## 3. 🛡️ Ciudadanía Digital Crítica y Búsqueda de Información
(Ayuda a los alumnos a discernir entre ciencia real y pseudociencia/fake news en este tema concreto. ¿Qué creencias falsas o sensacionalismo hay en internet sobre esto? Da consejos específicos sobre cómo buscar fuentes confiables, qué términos de búsqueda usar en Google Académico o bases científicas, y cómo contrastar la información para no ser engañados).

## 4. 📝 Criterios de Evaluación del Proyecto
(Define una rúbrica de evaluación clara y justa con 4 criterios principales:
1. **Profundidad y Rigor Científico** (calidad de las explicaciones físicas/químicas/biológicas).
2. **Pensamiento Crítico y Verificación de Fuentes** (cómo han detectado sesgos o información falsa en la red).
3. **Creatividad e Innovación** (uso de herramientas digitales, multimedia o inteligencia artificial de forma ética para presentar el producto final).
4. **Habilidades de Comunicación y Divulgación** (capacidad de transmitir y responder preguntas de sus compañeros de forma clara, amena y rigurosa).
 Si ya devuelves una estructura enumerada (como una lista markdown) no hace falta que reenumeres los criterios (para evitar la doble numeración: 1.1., 2.2., etc..))

## 5. ❓ Cuestionario de Investigación (25 Preguntas Adaptadas)
(Selecciona, adapta y redacta exactamente 25 preguntas específicas para este tema basándote en la plantilla general de preguntas que te muestro a continuación. Debes adaptar cada pregunta para que encaje perfectamente con el tema de "${topic.title}" y sea lo suficientemente profunda y rica científicamente. Asegúrate de que se incluyan exactamente 25 preguntas de forma consecutiva). Si ya devuelves una estructura enumerada (como una lista markdown) no hace falta que reenumeres las preguntas (para evitar la doble numeración: 1.1., 2.2., etc..), es decir, devuelve las 25 preguntas sin numerar ya que el número de pregunta ya lo asignará la lista markdown.

Plantilla general de referencia de la que debes inspirarte y adaptar las 25 preguntas:
- ¿Qué es exactamente este fenómeno, objeto o acontecimiento?
- ¿Cómo funciona?
- ¿Por qué ocurre?
- ¿Qué leyes físicas, químicas o biológicas lo explican?
- ¿Cuándo y quién lo descubrió?
- ¿Qué creencias erróneas existen sobre este tema?
- ¿Qué evidencias tenemos de que es real?
- ¿Cómo lo estudian los científicos?
- ¿Qué instrumentos o tecnologías permiten investigarlo?
- ¿Qué científicos o equipos han contribuido más a su conocimiento?
- ¿Qué problemas científicos siguen sin resolverse?
- ¿Qué magnitudes intervienen (masa, energía, temperatura, velocidad, presión, etc.)?
- ¿Qué escalas de tiempo y distancia están implicadas?
- ¿Cómo sería vivir en ese entorno o experimentar ese fenómeno?
- ¿A quién afecta directa o indirectamente?
- ¿Nos afecta actualmente?
- ¿Afecta a España o a Europa?
- ¿Qué impacto ha tenido en la historia humana?
- ¿Qué aplicaciones prácticas tiene?
- ¿Qué riesgos presenta?
- ¿Qué beneficios aporta?
- ¿Cómo podría cambiar nuestra vida en los próximos 20, 50 o 100 años?
- ¿Qué ocurriría si este fenómeno desapareciera?
- ¿Qué ocurriría si fuera mucho más intenso o frecuente?
- ¿Cómo se representa mediante modelos matemáticos?
- ¿Qué datos o cifras ayudan a comprender su magnitud?
- ¿Qué comparaciones ayudan a visualizarlo?
- ¿Qué experimentos sencillos permiten entenderlo?
- ¿Qué relación tiene con otras disciplinas científicas?
- ¿Qué papel juega la informática o la inteligencia artificial en su estudio?
- ¿Qué descubrimiento futuro podría revolucionar lo que sabemos sobre este tema?
- ¿Qué preguntas abiertas siguen investigándose hoy?
- ¿Cuál es el dato más increíble que habéis encontrado? ("Lo más sorprendente")
- ¿Qué idea teníais antes de investigar y cuál tenéis ahora?
- ¿Qué pregunta os gustaría poder hacer a un científico experto en este tema?

Escribe el resultado final completamente en español y sin preámbulos, comenzando directamente con el título principal de Markdown.
`;

    const response = await generateContentWithFallback(ai, prompt, 0.8);

    const guideMarkdown = response.text || "";

    // Save the generated guide back to the database
    await updateAssignment(id, { guideMarkdown });

    res.json({ guideMarkdown });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({
      error: `Error al generar la guía : ${error?.message || "Error desconocido"}`,
    });
  }
});

// ==================== VITE MIDDLEWARE & STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
