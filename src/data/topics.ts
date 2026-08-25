export interface Topic {
  id: number;
  title: string;
  subtopics: string[];
}

export const TOPICS: Topic[] = [
  {
    id: 1,
    title: "Misiones Apollo y Soldadura en frío en el espacio",
    subtopics: [
      "¿Qué ordenador llevaba el Apolo 11 y cómo se compara con un móvil actual?",
      "¿Qué habría ocurrido si el motor del módulo lunar no hubiera arrancado?",
      "¿Qué es un micrometeorito y por qué puede ser más peligroso que un meteorito grande?",
      "¿Por qué los astronautas dijeron que la Luna olía a pólvora quemada?",
      "¿Qué ocurrió en el Apolo 10 con el módulo lunar 'volviéndose loco'?",
      "¿Qué pasó realmente durante la crisis del Apolo 13?"
    ]
  },
  {
    id: 2,
    title: "Lunas de Saturno: Chorros de agua en Encelado y los mares de Titán",
    subtopics: [
      "¿Cuál de las lunas de Saturno te parece más sorprendente y por qué?",
      "¿Cómo descubrió la misión Cassini que las lunas de Saturno eran mucho más interesantes de lo esperado?",
      "¿Por qué Titán tiene ríos, lagos y lluvia... pero de metano?",
      "¿Por qué Jápeto tiene un hemisferio negro y otro blanco?",
      "¿Cómo se vería Saturno si pudieses volar por sus nubes?",
      "¿Qué organismos terrestres podrían sobrevivir en condiciones parecidas a las de Encélado?",
      "¿Se puede volar en Titán?",
      "¿Qué relación existe entre las fumarolas hidrotermales de la Tierra y el océano de Encélado?"
    ]
  },
  {
    id: 3,
    title: "Demonios de arena y otro fenómenos extremos en Marte",
    subtopics: [
      "¿Por qué Marte alberga los volcanes más grandes del Sistema Solar?",
      "¿Cómo pudo formarse un volcán tan enorme como Olympus Mons?",
      "¿Por qué los volcanes marcianos crecieron mucho más que los terrestres?",
      "¿Qué ocurriría si Olympus Mons estuviera en la Tierra?",
      "¿Podrían esos volcanes volver a entrar en erupción?",
      "¿Cómo cambia la gravedad al ascender una montaña de más de 20 km de altura?",
      "¿Cómo influye la baja presión atmosférica en las cumbres marcianas?",
      "¿Qué temperatura y qué vientos puede haber en las montañas de Marte?",
      "¿Cómo afectaría la enorme diferencia de altura entre el pie y la cima de Olympus Mons a una expedición?",
      "¿Qué hace de Valles Marineris el mayor cañón conocido del Sistema Solar?",
      "¿Cómo se formó Valles Marineris?",
      "¿Cómo cambia la presión atmosférica al descender varios kilómetros dentro del cañón?",
      "¿Por qué el fondo de un gran cañón aumenta las posibilidades de encontrar hielo o agua?",
      "¿Podría existir niebla, escarcha o agua líquida de forma temporal en las zonas más profundas?",
      "¿Qué pruebas indican que hace miles de millones de años Marte tuvo ríos y lagos?",
      "¿Dónde se encuentra hoy el agua marciana?",
      "¿Qué evidencias existen de cuevas gigantes en Marte?",
      "Tormentas de arena que duran meses en Marte, cómo podrían matarte?",
      "Las arañas de marte, son tan peligrosas?",
      "Impactos en Marte, ¿cómo afectaría a una futura colonia el impacto de asteroide o cometa gigante en Marte?",
      "Bombardear los polos, ¿una solución temporal para la baja densidad atmosférica marciana?"
    ]
  },
  {
    id: 4,
    title: "Las sondas Viking y el enigma de la vida en Marte",
    subtopics: [
      "¿Ya encontramos vida en Marte con las misiones Viking?",
      "El misterio del metano en Marte y sus posibles orígenes.",
      "¿Sería suficiente con fundir el hielo de los polos para crear una atmósfera respirable?",
      "¿Qué problemas presenta la falta de un campo magnético global?",
      "¿Cuánto tiempo podría llevar una terraformación parcial?",
      "¿Qué tecnologías serían necesarias para hacer Marte más habitable?",
      "¿Qué lugares serían prioritarios para una primera base permanente?",
      "¿Qué recursos podrían obtenerse directamente del suelo marciano para vivir allí?",
      "¿Realmente podríamos sembrar patatas en Marte?",
      "Las tormentas de arena en Marte",
      "Galerías y cuevas profundas en Marte",
      "El misterio del metano de Marte",
      "Nubes en Marte, ¿es posible?",
      "Fobos, ¿podría caernos encima la pequeña lina de Marte?",
      "Derretir los polos marcianos, ¿es posible",
      "¿Se podría simplemente estrellar una de las lunas marcianas sobre los polos para crear una atmósfera temporal?"
    ]
  },
  {
  id: 5,
  title: "Gatos, catnip y hormonas que controlan nuestra vida",
  subtopics: [
    "¿Cómo afecta la hierba gatera (catnip) a los gatos a nivel cerebral y de comportamiento?",
    "Hormonas que controlan nuestra vida: la oxitocina y cómo nos afecta en las relaciones sociales.",
    "La serotonina como el interruptor biológico del humor y del bienestar.",
    "Desórdenes bipolares: por qué se producen a nivel neuroquímico.",
    "Fármacos nootrópicos: ¿qué hay de real en las 'drogas inteligentes' y qué es mito?",
    "Dopamina: el sistema de recompensa que impulsa la motivación y las adicciones.",
    "Melatonina y ritmos circadianos: por qué dormir bien cambia el funcionamiento del cerebro.",
    "Cortisol: cuándo el estrés nos ayuda y cuándo empieza a perjudicarnos.",
    "Adrenalina: qué ocurre en nuestro organismo durante una situación de peligro.",
    "Endorfinas: por qué el ejercicio puede hacernos sentir eufóricos.",
    "Testosterona y estrógenos: mucho más que hormonas sexuales.",
    "¿Existe realmente un 'cerebro adicto'? Cómo cambian las neuronas con las drogas.",
    "El efecto placebo: cómo las expectativas pueden modificar el funcionamiento del cerebro.",
    "¿Por qué los gatos ronronean? Lo que dice la ciencia sobre esta conducta.",
    "Feromonas en animales y humanos: qué sabemos realmente sobre su influencia.",
    "¿Por qué algunos gatos no reaccionan al catnip? La explicación genética.",
    "Microbiota intestinal y cerebro: la sorprendente conexión entre el intestino y las emociones.",
    "¿Podemos entrenar nuestro cerebro para ser más felices? Lo que dice la neurociencia."
  ]
},
  {
    id: 6,
    title: "Los barcos de metal, submarinos y el Triángulo de las Bermudas",
    subtopics: [
      "¿Por qué flotan los barcos de metal y cuáles son sus límites de carga?",
      "El misterio del Mar de los Sargazos y el mito del Triángulo de las Bermudas.",
      "¿Se puede hacer un barco verdaderamente invisible al radar?",
      "¿Cómo funcionan exactamente los submarinos para ascender y descender?",
      "¿Cuáles son los límites técnicos y estructurales de un submarino profundo?",
      "¿Qué es un submarino nuclear, cómo funciona y qué autonomía real tiene?"
    ]
  },
  {
    id: 7,
    title: "El tamaño real del Sol, tipos de estrellas y evolución estelar",
    subtopics: [
      "El tamaño real del Sol en comparación con la Tierra y otros planetas gigantes.",
      "Si el sol es tan gigante, ¿por qué tiene el tamaño aparente en el cielo a un balón de basket?",
      "¿Crees que la gravedad de Marte u otros planetas puede afectar directamente a la vida en la Tierra?",
      "¿Por qué los planetas no caen directamente hacia el Sol?",
      "¿Cómo se ve y se siente el sol desde otros planetas del sistema solar?",
      "¿Si la luna está tan cerca por qué tiene temperaturas tan distintas?",
      "¿Por qué existen las alineaciones planetarias y qué efectos reales tienen?",
      "¿Por qué suceden los eclipses solares y lunares?",
      "¿Es el Sol una estrella gigante o enana en el universo?",
      "Tipos de estrellas y el ciclo de la evolución estelar.",
      "¿Cómo morirá nuestro Sol y qué pasará con la Tierra?",
      "¿Tiene nuestro Sol una estrella compañera invisible o podría existir un agujero negro primordial compañero?"
    ]
  },
  {
    id: 8,
    title: "Las sondas Voyager y la exploración del espacio profundo",
    subtopics: [
      "Las sondas Voyager: ¿qué descubrimientos históricos hicieron por primera vez?",
      "¿Qué hitos de navegación espacial permitieron que cambiaran la ciencia para siempre?",
      "¿Qué es la fotografía 'Pale Blue Dot' (Un punto azul pálido) y por qué es un símbolo ético y científico?",
      "¿Cuántas sondas fabricadas por el ser humano han llegado tan lejos?",
      "¿Cuántas veces hemos visitado Urano y qué sabemos realmente de él?",
      "¿Por qué seguimos descubriendo nuevas lunas de Júpiter constantemente?",
      "¿Qué es el famoso disco de las Voyager y qué sabrían de nosotros una civilización que lo encontrase?",
      "Hasta cuando seguirán funcionando las Voyager?"
    ]
  },
  {
  id: 9,
  title: "La Gran Oxidación: el evento que casi acaba con la vida",
  subtopics: [
    "La Gran Oxidación: ¿cómo el oxígeno casi extingue toda la vida en la Tierra primitiva?",
    "¿Por qué le debemos nuestra existencia a una bacteria unicelular que estuvo a punto de acabar con todo?",
    "¿Cómo obtenemos y procesamos energía los seres vivos?",
    "¿Cuáles son los fósiles más antiguos que existen y qué nos enseñan?",
    "¿Cuántas extinciones masivas han ocurrido en la Tierra?",
    "¿Qué fue y por qué ocurrió la explosión del Cámbrico?",
    "¿Existían los mamíferos en el Cámbrico?, ¿qué animales dominaban el mundo?",
    "¿Cómo surgió la primera célula? Las principales hipótesis sobre el origen de la vida.",
    "¿Qué aspecto tenía la Tierra hace 4.000 millones de años?",
    "¿Cómo sabemos cómo era la atmósfera primitiva si nadie estuvo allí para verla?",
    "Las cianobacterias: los microorganismos que transformaron un planeta entero.",
    "¿Qué son los estromatolitos y por qué siguen existiendo hoy?",
    "La endosimbiosis: el pacto evolutivo que dio origen a las células complejas.",
    "¿Cómo pasamos de organismos unicelulares a seres multicelulares?",
    "¿Por qué tardó tanto tiempo en aparecer la vida compleja?",
    "Las cinco grandes extinciones masivas y la posible sexta provocada por el ser humano.",
    "¿Cómo evolucionó el oxígeno hasta alcanzar los niveles actuales?",
    "¿Qué animales fueron los primeros en salir del agua y conquistar la tierra firme?",
    "¿Cómo evolucionaron los primeros ojos, cerebros y sistemas nerviosos?",
    "¿Por qué sobrevivieron algunos organismos a todas las grandes extinciones?",
    "¿Podría repetirse hoy un evento como la Gran Oxidación?",
    "¿Cómo reconstruyen los científicos la historia de la Tierra utilizando rocas e isótopos?"
  ]
},
  {
    id: 10,
    title: "Los ciclos solares, cambios climáticos prehistóricos y la humanidad",
    subtopics: [
      "Los ciclos solares: ¿por qué ocurren y cómo afectan a la vida y la atmósfera terrestre?",
      "¿Qué otros ciclos naturales a corto y largo plazo existen en la Tierra (Ciclos de Milankovitch)?",
      "Cambios climáticos extremos prehistóricos frente al cambio climático actual.",
      "Cambios climáticos documentados en la historia humana reciente.",
      "¿Cómo afectó el clima históricamente al desarrollo y colapso de las civilizaciones?",
      "¿Cuántas edades del hielo ha habido en la historia y a qué zonas del planeta afectaron?",
      "¿Podría cambiar o desestabilizarse la órbita de la Tierra?",
      "La extinción de los dinosaurios: qué sabemos realmente del impacto que cambió el planeta.",
      "¿Qué ocurrió durante el período Criogénico? La hipótesis de la Tierra bola de nieve.",
      "¿Podría una tormenta solar acabar con la vida?, ¿y una supernova?"
    ]
  },
  {
    id: 11,
    title: "Fusión nuclear y Helio-3: ¿la energía del futuro?",
    subtopics: [
      "Fusión nuclear y Helio-3: ¿cómo de cerca estamos realmente de tener un reactor de fusión comercial?",
      "¿Puede ocurrir un accidente catastrófico (como Chernóbil) en un reactor de fusión?",
      "¿Qué ocurre con los residuos en la fusión frente a la fisión nuclear?",
      "¿Cuáles serían las ventajas socioeconómicas y ambientales de la fusión?",
      "¿Qué experimentos internacionales están más cerca de conseguirlo? ¿Qué es el proyecto ITER?",
      "¿Cuál es la participación española y europea en el desarrollo de la fusión nuclear?"
    ]
  },
  {
    id: 12,
    title: "Titán, Dragonfly y los lagos de metano",
    subtopics: [
      "La misión Cassini-Huygens y por qué marcó un antes y un después en la exploración planetaria.",
      "¿Cuántas veces ha visitado la humanidad Titán y qué encontró la sonda Huygens al aterrizar?",
      "¿Cómo son los mares y lagos de metano líquido en Titán?",
      "¿Se podría vivir en Titán? ¿Cómo sería la vida en un entorno tan frío y denso?",
      "¿Puede haber un océano de agua líquida bajo la corteza de hielo de Titán?",
      "¿Podría establecerse una base científica autosuficiente allí?",
      "¿Cómo sería dar un paseo por la superficie de Titán, qué gravedad experimentaríamos y qué veríamos?"
    ]
  },
  {
    id: 13,
    title: "Vivir en las nubes de Venus: ¿una alternativa realista?",
    subtopics: [
      "Vivir en la atmósfera de Venus: ¿por qué se plantea como una opción más viable que la superficie?",
      "¿Qué misterios e infierno de presión y temperatura esconde la superficie de Venus?",
      "¿Es posible que exista vida microbiana autóctona en las nubes de Venus?",
      "¿Podríamos terraformar Venus algún día o es físicamente imposible?",
      "¿Cómo sería la estructura y el día a día de una base flotante en las nubes de Venus?",
      "¿Por qué es muy probable que ningún ser humano pise jamás la superficie de Venus?",
      "¿Podríamos extraer recursos valiosos de la superficie sin necesidad de descender físicamente?"
    ]
  },
  {
    id: 14,
    title: "La formación de la Luna, túneles de lava y agua perpetua",
    subtopics: [
      "La hipótesis del gran impacto (Theia) y cómo se formó la Luna.",
      "¿Por qué existen los eclipses y por qué siempre vemos la misma cara lunar (rotación síncrona)?",
      "¿Qué es la cara oculta de la Luna y por qué no es una 'cara oscura'?",
      "¿Dónde se encuentra el agua perpetua en la Luna y cómo se conserva?",
      "Los peligros ocultos de la Luna: polvo abrasivo (regolito) y radiación solar extrema.",
      "¿Por qué la Luna es un lugar ideal para instalar radiotelescopios gigantes?",
      "¿Sería posible construir bases lunares humanas seguras dentro de antiguos túneles de lava?"
    ]
  },
  {
    id: 15,
    title: "Cómo sabemos el tamaño de la Tierra y los secretos de la gravedad",
    subtopics: [
      "¿Quién calculó por primera vez el tamaño de la Tierra hace miles de años y cómo lo hizo con simples palos y sombras?",
      "¿Qué forma geométrica tiene realmente la Tierra y por qué no es una esfera perfecta?",
      "¿Qué son las anomalías magnéticas y cómo funciona el campo magnético protector de la Tierra?",
      "¿La gravedad terrestre actúa de la misma manera en todas partes del planeta?",
      "¿Cómo afecta la microgravedad a los astronautas a nivel óseo y muscular en la Estación Espacial Internacional?",
      "¿Por qué se forman exactamente las auroras boreales y australes?",
      "¿Cómo afectan las tormentas solares extremas a nuestras redes eléctricas e infraestructuras de telecomunicaciones?"
    ]
  },
  {
    id: 16,
    title: "Pangea, la tectónica de placas y los supervolcanes",
    subtopics: [
      "El supercontinente Pangea y las bases científicas de la deriva continental.",
      "¿Qué fuerzas internas del manto terrestre hicieron que la tectónica de placas comenzara a funcionar?",
      "¿Por qué planetas como Marte o la Luna no tienen tectónica de placas activa?",
      "¿Cómo conserva el interior de la Tierra tanto calor después de 4500 millones de años?",
      "¿Qué papel juegan los supervolcanes en la historia climática de la Tierra?",
      "¿Qué papel tienen las placas tectónicas en la formación y destrucción de archipiélagos y cordilleras?",
      "La extinción de los dinosaurios: qué sabemos realmente del impacto que cambió el planeta.",
      "¿Qué ocurrió durante el período Criogénico? La hipótesis de la Tierra bola de nieve.",
      "¿Qué pruebas tenemos de que Pangea realmente existió?, ¿Cuál es la historia de su descubrimiento?"
    ]
  },
{
  id: 17,
  title: "La Atlántida: mitos históricos frente a realidades geológicas",
  subtopics: [
    "La leyenda de la Atlántida: ¿qué escribió Platón y qué bases históricas o mitos de inundaciones existían?",
    "Zonas de Europa como Doggerland que estuvieron emergidas y habitadas antes del fin de la última glaciación.",
    "La crisis de salinidad del Messiniense: cuando el Mar Mediterráneo se secó por completo.",
    "La compleja historia geológica del estrecho de Gibraltar y las inundaciones prehistóricas.",
    "Antiguas culturas del suroeste peninsular y teorías sobre si la Atlántida pudo estar en el entorno de Cádiz o Doñana.",
    "¿Existió realmente la Atlántida o fue una alegoría política creada por Platón?",
    "Los grandes tsunamis de la Antigüedad y su posible influencia en los mitos de civilizaciones perdidas.",
    "El tsunami de Lisboa de 1755: cómo cambió la historia de Europa y la ciencia.",
    "¿Qué sabemos hoy sobre Tartessos? Arqueología frente a leyenda.",
    "Las Columnas de Hércules: geografía, mitología y navegación en el mundo antiguo.",
    "¿Cómo era el nivel del mar hace 20.000 años y qué territorios permanecen hoy bajo el agua?",
    "Las ciudades sumergidas más famosas del mundo: Pavlopetri, Heracleion, Baiae y otras.",
    "¿Podría una civilización desaparecer casi por completo dejando muy pocas huellas arqueológicas?",
    "Cómo detectan los arqueólogos y geólogos antiguas costas y asentamientos hoy sumergidos.",
    "El diluvio universal: ¿tienen base histórica los grandes relatos de inundaciones?",
    "¿Qué ocurrió realmente al final de la última glaciación? El rápido ascenso del nivel del mar.",
    "Los eventos Heinrich y el Dryas Reciente: cambios climáticos bruscos que transformaron el planeta.",
    "¿Hubo culturas avanzadas antes de Sumer? Qué dicen realmente las evidencias.",
    "Mitos arqueológicos populares: Mu, Lemuria y otras civilizaciones perdidas.",
    "¿Podría descubrirse algún día una ciudad prehistórica completamente sumergida en el Atlántico?",
    "Cómo la tectónica de placas ha cambiado el mapa de la Tierra durante millones de años.",
    "¿Qué parte de verdad hay en los documentales y teorías virales sobre la Atlántida?"
  ]
},
{
  id: 18,
  title: "La Pequeña Edad de Hielo y cambios climáticos bruscos",
  subtopics: [
    "La Pequeña Edad de Hielo (siglos XIV al XIX): ¿cuándo y por qué sucedió (Mínimo de Maunder)?",
    "Registros históricos, pinturas de la época y testimonios de inviernos extremos en Europa.",
    "Grandes extinciones de especies motivadas por cambios climáticos naturales bruscos en el pasado.",
    "Eventos astronómicos (actividad solar, impactos de asteroides) y su influencia histórica en el clima.",
    "¿Podría cambiar el clima terrestre de manera extremadamente brusca en la actualidad?",
    "La Tierra antes de chocar con Theia: ¿cómo era nuestro planeta en sus inicios?",
    "El Óptimo Climático Medieval: ¿fue realmente una época más cálida que la actual en algunas regiones?",
    "Las grandes glaciaciones de la Tierra: cuándo ocurrieron y qué las desencadenó.",
    "¿Qué provocó el fin de la última Edad de Hielo?",
    "Cómo las erupciones volcánicas pueden enfriar el planeta durante años.",
    "El 'año sin verano' de 1816: la erupción del Tambora y sus consecuencias globales.",
    "¿Qué es el Dryas Reciente y por qué el clima cambió en apenas unas décadas?",
    "Las corrientes oceánicas: el papel de la circulación termohalina en el clima global.",
    "¿Podría detenerse la Corriente del Golfo? Qué dice la ciencia.",
    "Cómo reconstruyen los científicos el clima del pasado mediante hielo, sedimentos y anillos de los árboles.",
    "Los ciclos de Milankovitch: cómo la órbita terrestre influye en las glaciaciones.",
    "¿Qué ocurrió tras el impacto del asteroide que extinguió a los dinosaurios? El 'invierno de impacto'.",
    "Supervolcanes como Yellowstone o Toba: ¿podrían provocar un invierno volcánico global?",
    "La hipótesis de la Tierra bola de nieve: cuando casi todo el planeta quedó congelado.",
    "¿Cómo influye el Sol en el clima? Separando mitos de evidencias científicas.",
    "Cambios climáticos rápidos en la historia humana: cómo afectaron al auge y caída de civilizaciones.",
    "¿Qué diferencia existe entre tiempo atmosférico, variabilidad climática y cambio climático?",
    "¿Cómo será el clima de la Tierra dentro de 10.000, 100.000 y un millón de años?"
  ]
},
  {
    id: 19,
    title: "La edad del universo y el modelo de expansión cosmológica",
    subtopics: [
      "La edad estimada del universo: ¿cómo podemos ver galaxias que están hoy a 35.000 millones de años luz si el universo tiene 13.800 millones de años?",
      "Descubrimientos del telescopio James Webb que parecen desafiar el modelo inflacionario actual.",
      "La tensión de Hubble: la discordancia científica en la tasa de expansión del universo.",
      "¿Cómo pueden existir cuásares supermasivos en el universo extremadamente temprano?",
      "¿Cómo miden los astrónomos las distancias a las galaxias lejanas de forma fiable?"
    ]
  },
  {
    id: 20,
    title: "Starlink, SpaceX y la revolución de la órbita baja",
    subtopics: [
      "La constelación Starlink: ¿cómo funciona tecnológicamente para dar internet global?",
      "Los planes de SpaceX y otras corporaciones para la colonización de la órbita terrestre baja.",
      "La nave Starship y por qué su concepto de reutilización total lo cambia todo en la exploración espacial.",
      "Las próximas bases lunares internacionales del programa Artemis.",
      "La minería en asteroides y la extracción de recursos lunares: ¿realidad científica o ficción económica?"
    ]
  },
  {
    id: 21,
    title: "Bombas de neutrones y el dilema ético de la ciencia militar",
    subtopics: [
      "¿Qué es una bomba de neutrones y en qué se diferencia de una bomba atómica convencional?",
      "Del Proyecto Manhattan a la bomba de hidrógeno: científicos y dilemas éticos (Oppenheimer, Teller).",
      "Las aplicaciones más destructivas de la ciencia aplicadas a la tecnología militar.",
      "La ciencia de frontera: ¿puede el colisionador de partículas del CERN destruir el mundo accidentalmente?",
      "¿Cómo funciona un pulso electromagnético masivo (EMP) y cómo afectaría a una sociedad digital?",
      "¿Cómo protege la física de la jaula de Faraday frente a tormentas electromagnéticas o pulsos?"
    ]
  },
  {
    id: 22,
    title: "Tecnofirmas, exoplanetas y civilizaciones perdidas",
    subtopics: [
      "La hipótesis silúrica: ¿podría haber existido una civilización tecnológica en la Tierra millones de años antes que los humanos?",
      "¿Qué rastros geológicos o tecnofirmas dejaría nuestra propia civilización dentro de 100 millones de años?",
      "¿Podría una civilización anterior haber salido al espacio o haber llegado a la Luna antes que nosotros?",
      "¿Qué señales concretas buscan los astrofísicos para detectar mundos alienígenas inteligentes?",
      "¿Qué descubrimientos fascinantes hemos hecho en los miles de exoplanetas conocidos hasta ahora?",
      "¿Cuando se descubrió el primer exoplaneta?, ¿cómo se hizo?, ¿hubo gente que no lo creyó?",
      "¿Cuál es el exoplaneta más cercano, y el más prometedor, y el más parecido a la Tierra, y el más misterioso?"
    ]
  },
  {
    id: 23,
    title: "Rascacielos extremos, ciudades submarinas y estaciones espaciales",
    subtopics: [
      "¿Por qué no podemos construir fácilmente edificios de más de 1 km de altura? Retos estructurales y de oscilación.",
      "Problemas ambientales, de suministro de agua y de salud para los habitantes de megaestructuras verticales.",
      "Construir hacia abajo: retos de la minería profunda y ciudades subterráneas.",
      "Construir ciudades autosuficientes en el mar: barreras tecnológicas y de corrosión.",
      "Superestaciones espaciales en órbita: ¿cómo generar gravedad artificial por rotación?",
      "¿Cuáles son las megaconstrucciones más extremas de la tierra?, ¿cuáles son de hace menos de 20 años?, ¿cuales están planificadas para los próximos 10 años?"
    ]
  },
  {
    id: 24,
    title: "Ascensor espacial y métodos exóticos de transporte interplanetario",
    subtopics: [
      "El ascensor espacial: retos de materiales (nanotubos de carbono) y viabilidad física real.",
      "Catapultas electromagnéticas en la Luna: ¿lanzar materiales al espacio sin combustible?",
      "Lanzadores de raíl (Railguns) aplicados al transporte de mercancías fuera de la Tierra.",
      "¿Qué recursos espaciales justificarían económicamente estas megaestructuras?",
      "¿Es factible la explotación minera de la Luna? y en asteróides?",
      "¿Podemos construir una megaestación espacial con residentes permanentes?"
    ]
  },
  {
    id: 25,
    title: "La atmósfera como fluido y los misterios del cielo",
    subtopics: [
      "La atmósfera terrestre estudiada como un fluido: ¿es realmente transparente al ojo y a las ondas?",
      "¿Por qué los asteroides pequeños a veces 'rebotan' en la atmósfera y vuelven al espacio?",
      "¿Cómo sería la física y el clima de un verdadero mundo acuático sin continentes?",
      "¿Cómo afectaría a la evolución de la vida un planeta con el doble de gravedad terrestre?",
      "Un planeta con mucha mayor masa pero mucha menor densidad: ¿cómo cambiaría nuestra exploración?",
      "¿Qué son los ríos atmosféricos y cómo los interpretáis?"
    ]
  },
{
  id: 26,
  title: "Vida en océanos bajo el hielo: Encelado vs Europa",
  subtopics: [
    "¿Qué diferencias físicas y de habitabilidad existen entre el océano de Encelado y el de la luna Europa?",
    "¿Cómo diseñarías una misión robótica capaz de derretir kilómetros de hielo y sumergirse en esos océanos?",
    "Ventajas y desventajas de explorar estas lunas heladas frente a colonizar la superficie de Titán.",
    "¿Puede realmente existir la vida compleja bajo el hielo en estos mundos?, ¿cómo sería?.",
    "¿Qué evidencias tenemos de que Encelado y Europa albergan océanos líquidos?",
    "Los géiseres de Encelado: una ventana natural al océano subterráneo.",
    "¿Qué ha descubierto la misión Cassini sobre Encelado?",
    "Europa Clipper y JUICE: las misiones que buscarán respuestas sobre la habitabilidad de Europa.",
    "¿Qué fuentes de energía podrían alimentar la vida bajo kilómetros de hielo?",
    "Vida sin luz solar: los ecosistemas de las fumarolas hidrotermales como modelo para otros mundos.",
    "¿Qué biomarcadores buscarían los científicos para detectar vida extraterrestre?",
    "¿Cómo esterilizar una sonda espacial para evitar contaminar un océano alienígena?",
    "¿Qué dificultades técnicas supone perforar una corteza de hielo de decenas de kilómetros?",
    "¿Cómo sería un submarino diseñado para explorar un océano extraterrestre?",
    "¿Podrían existir peces o animales complejos en Europa o Encelado, o solo microorganismos?",
    "Titán: mares de metano líquido y una química completamente diferente a la terrestre.",
    "¿Qué otros mundos del Sistema Solar podrían albergar océanos ocultos? Ganímedes, Calisto, Tritón y otros.",
    "¿Qué probabilidades existen de encontrar vida en nuestro Sistema Solar antes de 2050?",
    "Protección planetaria: qué normas existen para evitar contaminar otros mundos.",
    "¿Qué aprenderíamos sobre el origen de la vida si encontráramos organismos independientes de la Tierra?",
    "¿Cómo cambiaría la ciencia y la sociedad si descubriéramos vida extraterrestre en una luna helada?",
    "¿Qué aspecto tendría una futura base científica humana orbitando Europa o Encelado?"
  ]
},
  {
    id: 27,
    title: "Vulcano, el planeta fantasma y la búsqueda del Planeta Nueve",
    subtopics: [
      "La hipótesis histórica del planeta Vulcano (dentro de la órbita de Mercurio) y cómo la Relatividad de Einstein resolvió el misterio.",
      "La anomalía en las órbitas de los objetos transneptunianos: ¿por qué los astrónomos sospechan que existe el Planeta Nueve?",
      "¿Estamos seguros de que es un planeta masivo o podría ser un agujero negro primordial del tamaño de una manzana?",
      "¿Tiene relación la supuesta órbita del Planeta Nueve con las extinciones periódicas registradas en la Tierra?"
    ]
  },
  {
    id: 28,
    title: "Fusión vs Fisión nuclear y los retos de las energías renovables",
    subtopics: [
      "Fusión nuclear frente a Fisión nuclear: la eterna promesa de energía ilimitada y limpia.",
      "¿Cuáles son los principales retos técnicos para domar temperaturas más calientes que el núcleo del Sol?",
      "Las energías renovables (solar, eólica) como solución actual: ¿cuáles son sus límites de intermitencia?",
      "¿Qué tecnologías físicas, químicas y mecánicas tenemos actualmente para almacenar energía a gran escala?"
    ]
  },
  {
  id: 29,
  title: "La Tierra bola de nieve y los ciclos de superglaciaciones",
  subtopics: [
    "La teoría de la 'Tierra Bola de Nieve': la época en que nuestro planeta se congeló por completo hasta el ecuador.",
    "¿Qué bucles de retroalimentación climática (efecto albedo) provocaron y luego revirtieron esta congelación?",
    "¿Cuántas superextinciones biológicas masivas ha registrado la geología y cuáles fueron sus causas desencadenantes?",
    "¿Qué evidencias geológicas demuestran que la Tierra estuvo casi completamente congelada?",
    "¿Cuántas veces pudo convertirse la Tierra en una 'bola de nieve' a lo largo de su historia?",
    "La hipótesis de la 'Tierra bola de barro': ¿estaba realmente todo el planeta congelado?",
    "El papel del CO₂ volcánico en el fin de las superglaciaciones.",
    "Cómo el efecto albedo puede amplificar un pequeño cambio climático hasta convertirlo en global.",
    "¿Qué aspecto tendría la Tierra vista desde el espacio durante una superglaciación?",
    "¿Cómo sobrevivió la vida cuando casi todo el planeta estaba cubierto por hielo?",
    "Las primeras formas de vida compleja tras el fin de la Tierra bola de nieve.",
    "Criogénico, Ediacárico y Cámbrico: el extraordinario despertar de la vida compleja.",
    "¿Podría volver la Tierra a entrar en una superglaciación en el futuro?",
    "Los ciclos de Milankovitch: cómo la órbita terrestre desencadena edades de hielo.",
    "¿Qué diferencia existe entre una glaciación, una edad de hielo y una superglaciación?",
    "La Antártida y Groenlandia: qué nos enseñan sobre los climas extremos del pasado.",
    "Cómo reconstruyen los científicos el clima de hace cientos de millones de años.",
    "Las mayores extinciones de la historia: Ordovícico, Devónico, Pérmico, Triásico y Cretácico.",
    "La Gran Mortandad del Pérmico: la peor extinción conocida en la historia de la Tierra.",
    "¿Qué relación existe entre volcanismo masivo, cambios climáticos y extinciones?",
    "¿Podría una guerra nuclear desencadenar un 'invierno nuclear' comparable a una pequeña edad de hielo?",
    "¿Qué otros planetas o lunas del Sistema Solar han experimentado grandes cambios climáticos?"
  ]
},
  {
  id: 30,
  title: "Grandes imperios marinos, herencia romana y la caída de Bizancio",
  subtopics: [
    "La navegación y el control geoestratégico: comparativa tecnológica entre el Imperio Español y el Imperio Británico.",
    "El debate histórico: ¿fue el Reino de Asturias heredero legítimo de las estructuras y leyes del Imperio Romano de Occidente?",
    "El papel de las potencias ibéricas en la consolidación y defensa del pensamiento y los valores científicos occidentales.",
    "El Imperio Bizantino (Imperio Romano de Oriente): ¿qué factores políticos, militares y tecnológicos provocaron su caída en 1453?",
    "El Camino Español: ¿cómo era recorrer más de 1.000 kilómetros a pie cargando con el equipo de un soldado del siglo XVI?",
    "¿Cómo funcionaba realmente la maquinaria administrativa del Imperio Romano?",
    "La Pax Romana: por qué Roma logró siglos de estabilidad relativa.",
    "La caída del Imperio Romano de Occidente: causas internas, invasiones y crisis económica.",
    "¿Qué heredó Europa de Roma? Derecho, ingeniería, lengua y organización política.",
    "Constantinopla: la ciudad más rica y mejor defendida de la Edad Media.",
    "La pólvora y los cañones otomanos: el arma que cambió la guerra de asedio.",
    "¿Cómo era la vida cotidiana en Constantinopla poco antes de su caída?",
    "El Imperio Español: la primera potencia verdaderamente global de la historia.",
    "La Carrera de Indias: cómo funcionaba la mayor red logística marítima del mundo.",
    "La Armada Invencible: qué ocurrió realmente. La venganza española de 1589.",
    "¿Cómo vivía un marinero durante una travesía transoceánica en el siglo XVI?",
    "La esclavitud y el colonialismo. España versus Inglaterra: La real provisión de 1500.",
    "Los Tercios españoles: organización, entrenamiento y reputación militar.",
    "El Imperio Británico: Corsarios y bulas, las claves de su dominio de los océanos durante dos siglos.",
    "La revolución naval: del galeón al acorazado de acero.",
    "¿Qué imperio fue más extenso: el español, el británico, el mongol o el romano?",
    "El galeón de Manila, y la Ruta de la Seda: la competencia por el comercio mundial.",
    "Cómo cambió la brújula, el astrolabio y la cartografía la historia de la navegación.",
    "El legado del Imperio Bizantino en la cultura, la ciencia y el Renacimiento europeo.",
    "¿Qué habría ocurrido si Cuba no hubiese caído en 1898? Un ejercicio de historia contrafactual."
  ]
},
  {
    id: 31,
    title: "La edad de la Tierra y el descubrimiento científico de los dinosaurios",
    subtopics: [
      "¿Cómo calculó la ciencia moderna la edad de la Tierra (4500 millones de años) mediante la datación radiométrica de meteoritos?",
      "La historia del descubrimiento de los primeros fósiles de dinosaurios: cómo cambió nuestra visión del tiempo geológico.",
      "El método científico aplicado a la reconstrucción biológica de animales extintos a partir de fragmentos óseos.",
      "La megafauna de los sinápsidos: Esos grandes desconocidos.",
      "El supercontinente Pangea",
      "Los Terápsidos",
      "Los Dinocéfalos, la versión mamífera de los dinosaurios",
      "Los Gorgonopsidos, stranger things no era tan loco",
      "La extinción del Pérmico-Triásico: un gameover global"
    ]
  },
  {
    id: 32,
    title: "Desextinción: clonar un mamut y aves gigantes del pasado",
    subtopics: [
      "La ciencia de la desextinción: ¿es técnicamente viable clonar un mamut lanudo o el ave gigante moa de Nueva Zelanda?",
      "¿Qué límites biológicos y de degradación del ADN impiden por completo revivir a los dinosaurios (Parque Jurásico)?",
      "Debates éticos y ecológicos: ¿debemos reintroducir especies extinguidas en ecosistemas actuales modificados por el hombre?"
    ]
  },
  {
    id: 33,
    title: "Levitación magnética, trenes bala y el concepto de Hyperloop",
    subtopics: [
      "La física de la levitación magnética (Maglev): ¿cómo flotan y se propulsan los trenes sin tocar la vía?",
      "¿Por qué un tren Maglev carece de rozamiento mecánico y qué velocidad máxima teórica y real puede alcanzar?",
      "Comparativa de eficiencia energética entre trenes Maglev y el ferrocarril de alta velocidad convencional.",
      "La propuesta de Hyperloop (vactrain en tubos de baja presión): ¿es factible técnicamente, qué retos de seguridad presenta y dónde se investiga?"
    ]
  },
  {
    id: 34,
    title: "Oxidación biológica, envejecimiento celular y la búsqueda de la inmortalidad",
    subtopics: [
      "La paradoja del oxígeno: el elemento esencial que nos da la vida pero que también nos oxida y envejece.",
      "Las mitocondrias: su papel crucial en la producción de energía y la teoría mitocondrial del envejecimiento.",
      "El ADN mitocondrial: ¿por qué se hereda únicamente por vía materna y cómo se usa para rastrear linajes evolutivos?",
      "Los telómeros y la enzima telomerasa: ¿son el verdadero reloj biológico de la juventud o una simplificación comercial?",
      "La biogerontología y los intentos extremos de multimillonarios tecnológicos por revertir el envejecimiento humano."
    ]
  },
  {
    id: 35,
    title: "Bajo las tinieblas de Laki: el volcán que desató la Revolución Francesa",
    subtopics: [
      "La erupción de la fisura volcánica de Laki (Islandia) en 1783: liberación masiva de gases de azufre y flúor.",
      "Consecuencias climáticas globales: inviernos extremadamente fríos y sequías devastadoras en toda Europa.",
      "El impacto sociopolítico indirecto: malas cosechas, hambruna en Francia y su influencia como catalizador de la Revolución Francesa de 1789.",
      "La diferencia entre una erupción volcánica estándar y una erupción de fisura volcánica masiva."
    ]
  },
  {
    id: 36,
    title: "La prueba de que la Tierra tenía anillos hace 500 millones de años",
    subtopics: [
      "El periodo Ordovícico: descubrimientos geológicos de impactos de meteoritos alineados cerca del ecuador terrestre primitivo.",
      "La hipótesis científica: la Tierra capturó un gran asteroide que se desintegró por fuerzas de marea creando un sistema de anillos temporales.",
      "¿Cómo afectaría un sistema de anillos de polvo a la cantidad de luz solar recibida y al clima del planeta?",
      "La evidencia geológica de cráteres de impacto de la misma edad en diferentes continentes actuales."
    ]
  },
  {
    id: 37,
    title: "Cuando el oxígeno provocó la mayor glaciación de la historia",
    subtopics: [
      "La Gran Oxidación y el colapso del metano atmosférico: ¿cómo la fotosíntesis eliminó el potente gas de efecto invernadero dominante?",
      "La Glaciación Huroniana: la época en que la Tierra se convirtió en una bola de nieve debido al auge del oxígeno.",
      "El impacto evolutivo en los organismos anaerobios que dominaban el planeta y la posterior adaptación de la respiración celular celular."
    ]
  },
  {
    id: 38,
    title: "El Mar de los Sargazos: misterios del Atlántico y su ecosistema único",
    subtopics: [
      "El Mar de los Sargazos: el único 'mar' del mundo que no tiene costas terrestres, delimitado por corrientes oceánicas.",
      "La física de los giros oceánicos y la acumulación de algas del género Sargassum.",
      "El ciclo de vida migratorio de las anguilas europeas y americanas hacia este mar para reproducirse: un misterio biológico.",
      "Mitos históricos de navegación (barcos atrapados en la calma chicha) y realidades científicas sobre la navegación en la zona."
    ]
  },
  {
  id: 39,
  title: "La anomalía del Atlántico Sur y el debilitamiento magnético",
  subtopics: [
    "¿Qué es la Anomalía del Atlántico Sur (SAA) y por qué el campo magnético terrestre es significativamente más débil en esa zona?",
    "¿Cómo afecta esta anomalía a los satélites en órbita baja y a los ordenadores de la Estación Espacial Internacional?",
    "¿Está la Tierra experimentando el inicio de una inversión de los polos magnéticos y qué consecuencias reales tendría para nuestra sociedad tecnológica?",
    "¿Cómo estudian los geofísicos el paleomagnetismo en las rocas de los fondos oceánicos?",
    "¿Cómo se genera el campo magnético terrestre en el núcleo externo?",
    "¿Por qué el campo magnético de la Tierra cambia constantemente de intensidad y dirección?",
    "Las inversiones magnéticas del pasado: ¿cada cuánto ocurren y cuánto duran?",
    "¿Qué ocurriría si el campo magnético terrestre desapareciera durante unos siglos?",
    "¿Podría una inversión de los polos afectar al clima de la Tierra?",
    "Auroras boreales y australes: cómo nacen a partir del viento solar.",
    "Tormentas solares extremas: el evento Carrington y el riesgo para nuestra tecnología.",
    "¿Cómo protege la magnetosfera a la Tierra frente a la radiación espacial?",
    "Los cinturones de radiación de Van Allen: una barrera invisible alrededor del planeta.",
    "¿Cómo funciona una brújula y por qué señala al norte magnético en lugar del geográfico?",
    "¿Por qué el polo norte magnético se está desplazando tan rápidamente?",
    "¿Cómo miden los científicos el campo magnético terrestre desde satélites y observatorios?",
    "El núcleo de la Tierra: qué sabemos realmente sobre su estructura y dinámica.",
    "¿Existen anomalías magnéticas similares en otros planetas del Sistema Solar?",
    "Marte: cómo perdió su campo magnético y qué consecuencias tuvo para su atmósfera.",
    "¿Qué relación existe entre el magnetismo terrestre y la tectónica de placas?",
    "¿Cómo utilizan los arqueólogos y geólogos el paleomagnetismo para datar rocas y yacimientos?",
    "¿Podría una gran tormenta solar provocar un apagón global en el siglo XXI?",
    "Mitos y realidades sobre el debilitamiento del campo magnético terrestre."
  ]
},
  {
    id: 40,
    title: "Krakatoa 1883: la explosión que estremeció al mundo y los supervolcanes",
    subtopics: [
      "La cataclísmica erupción del volcán Krakatoa en 1883: la onda de choque que dio varias vueltas al planeta y el sonido más fuerte registrado en la historia.",
      "Consecuencias climáticas globales del polvo y aerosoles en la estratosfera (caída de temperaturas globales).",
      "La diferencia física entre un volcán convencional (estratovolcán) y un supervolcán (caldera volcánica gigante como Yellowstone o el Teide en el pasado).",
      "¿Cómo monitorizan los vulcanólogos actuales los movimientos magmáticos para predecir erupciones?",
      "El Teide y el volcán de la Palma. ¿Pueden provocar de verdad un enorme maremoto?"
    ]
  },
  {
  id: 41,
  title: "La raza Munchkin y la manipulación genética selectiva en mascotas",
  subtopics: [
    "La raza de gato Munchkin: la mutación genética (acondroplasia/enanismo) que acorta sus patas.",
    "La ciencia de la cría selectiva en animales domésticos y sus consecuencias éticas y de salud para los animales.",
    "Dilemas morales en el aula: ¿es ético perpetuar mutaciones físicas perjudiciales por mera estética humana?",
    "El método científico aplicado al estudio de la salud articular y ósea de estas razas frente a gatos comunes.",
    "¿Cómo funcionan las mutaciones genéticas que modifican el desarrollo de los huesos?",
    "Selección artificial: cómo el ser humano ha transformado perros, gatos y animales de granja.",
    "¿Cuál es la diferencia entre selección artificial, ingeniería genética y edición genética?",
    "Las razas de perros con más problemas de salud: qué dice la evidencia científica.",
    "¿Por qué los bulldogs, pugs y otras razas braquicéfalas tienen tantas dificultades respiratorias?",
    "Scottish Fold: cuando una mutación que afecta a las orejas también perjudica a los huesos.",
    "¿Qué enfermedades hereditarias son más frecuentes en los gatos de raza?",
    "Consanguinidad y pérdida de diversidad genética en animales domésticos.",
    "¿Cómo se detectan las enfermedades genéticas mediante pruebas de ADN en mascotas?",
    "La domesticación del gato: de cazador salvaje a compañero del ser humano.",
    "¿Por qué existen tantas razas de perros y tan pocas de gatos?",
    "¿Cómo influye la genética en el comportamiento de perros y gatos?",
    "¿Es posible criar animales sin transmitir enfermedades hereditarias?",
    "¿Dónde está el límite ético de la selección artificial en animales?",
    "El husky y el perro lobo checo: Buscando al lobo perfecto",
    "CRISPR y edición genética: ¿podríamos corregir enfermedades hereditarias en mascotas?",
    "¿Qué legislación existe sobre la cría de animales con problemas genéticos en distintos países?",
    "Las razas 'de moda': cómo las redes sociales influyen en la demanda y el bienestar animal.",
    "¿Qué podemos aprender sobre genética humana estudiando la genética de perros y gatos?"
  ]
},
  {
    id: 42,
    title: "El Nitruro de Boro: ¿el verdadero sustituto revolucionario del grafeno?",
    subtopics: [
      "Estructura atómica y propiedades del Nitruro de Boro (BN), también conocido como 'grafeno blanco'.",
      "¿Por qué sus propiedades aislantes y su increíble resistencia al calor lo hacen superior al grafeno en microelectrónica espacial?",
      "Aplicaciones industriales reales del Nitruro de Boro en lubricantes extremos, blindaje térmico y nanotecnología.",
      "El método científico para sintetizar nuevos materiales bidimensionales en el laboratorio.",
      "Las baterías del futuro: ¿qué podríamos hacer con una batería casi infinita?"
    ]
  },
  {
    id: 43,
    title: "El Episodio Pluvial Carniense: cuando llovió durante 2 millones de años",
    subtopics: [
      "El Episodio Pluvial Carniense hace 230 millones de años: ¿por qué un planeta árido experimentó lluvias torrenciales ininterrumpidas durante millones de años?",
      "La hipótesis de las erupciones masivas de la provincia ígnea de Wrangellia y la inyección masiva de CO2 en la atmósfera.",
      "El impacto biológico: cómo este cambio climático húmedo impulsó la radiación evolutiva y el dominio de los dinosaurios primitivos.",
      "¿Cómo identifican los geólogos y paleoclimatólogos estos periodos de lluvias masivas en los estratos de roca sedimentaria?"
    ]
  },
  {
    id: 44,
    title: "El evento de Tunguska y el peligro de los impactos de asteroides",
    subtopics: [
      "El misterioso evento de Tunguska en 1908: una colosal explosión en Siberia que derribó 80 millones de árboles sin dejar un cráter de impacto.",
      "La explicación física moderna: la explosión aérea (airburst) de un asteroide o cometa de unos 50 metros en la atmósfera.",
      "¿Podríamos sobrevivir en la actualidad a un impacto de asteroide de tamaño similar si cayera en una zona densamente poblada?",
      "¿Qué tecnologías de defensa planetaria (como la misión DART de la NASA) se investigan para desviar asteroides peligrosos?"
    ]
  },
  {
    id: 45,
    title: "Apophis, asteroides potencialmente peligrosos y la red de exploración espacial",
    subtopics: [
      "El asteroide Apophis: por qué se consideró uno de los asteroides más peligrosos para la Tierra y qué sabemos hoy de su aproximación en 2029.",
      "La escala de Torino y la escala de Palermo para cuantificar el riesgo real de impactos cósmicos.",
      "La Red de Espacio Profundo (Deep Space Network): cómo rastreamos naves y vigilamos objetos celestes peligrosos.",
      "La importancia de la cooperación científica internacional y la ciudadanía crítica ante noticias sensacionalistas sobre el fin del mundo."
    ]
  },
  {
    id: 46,
    title: "El Dryas Reciente, cambios climáticos abruptos y mitos antiguos",
    subtopics: [
      "El periodo del Dryas Reciente hace 12.900 años: un enfriamiento global repentino y masivo justo al final de la última glaciación.",
      "La teoría del impacto del Dryas Reciente (hipótesis del cometa) y la teoría de la alteración de la corriente termohalina atlántica.",
      "¿Cómo influyó este cambio climático extremo en los últimos grupos de cazadores-recolectores y el nacimiento de la agricultura?",
      "Conexión con mitos antiguos: el Diluvio Universal y el hundimiento de civilizaciones legendarias analizados desde la geología crítica."
    ]
  },
  {
    id: 47,
    title: "La máquina Enigma, Alan Turing y el nacimiento de la informática",
    subtopics: [
      "La máquina criptográfica Enigma: ¿cómo funcionaba su complejo sistema de rotores para cifrar las comunicaciones militares alemanas?",
      "El papel crucial del equipo de matemáticos de Bletchley Park liderado por Alan Turing para descifrar el código Enigma.",
      "La máquina Colossus y la Bombe de Turing: cómo la necesidad militar de descifrar mensajes dio origen a los primeros ordenadores programables.",
      "La ciudadanía digital crítica aplicada a la criptografía moderna: ¿por qué la seguridad de tus datos bancarios y chats actuales depende del mismo principio matemático?",
      "¿Cómo funcionan los generadores de números aleatorios en criptografía?",
      "¿Por qué una contraseña segura es tan difícil de romper?",
      "¿Qué ocurriría si mañana desapareciera toda la criptografía de Internet?"
    ]
  },
  {
    id: 48,
    title: "La misión Cassini-Huygens en Titán y el sueño del vuelo extraterrestre",
    subtopics: [
      "La odisea de la misión Cassini-Huygens para cartografiar el sistema de Saturno.",
      "La hazaña del aterrizaje de Huygens en Titán: la retransmisión de los sonidos y las primeras fotos de una superficie alienígena helada.",
      "El sueño de volar en otros mundos: ¿por qué la baja gravedad de Titán y su densa atmósfera hacen que volar allí con hélices sea increíblemente fácil?",
      "La futura misión Dragonfly: un dron/octocóptero nuclear que explorará la química orgánica prebiótica de Titán.",
      "La atmósfera de Titán: por qué es más densa que la terrestre.",
      "¿Cómo sería caminar, correr o volar sobre la superficie de Titán?",
      "¿Podría existir vida basada en una química diferente bajo las condiciones de Titán?",
      "Cassini: los mayores descubrimientos de una de las misiones más exitosas de la historia.",
      "La maniobra del Gran Final de Cassini: por qué la NASA decidió destruir la sonda en Saturno.",
      "¿Cómo sobrevivió la sonda Huygens al descenso y aterrizaje en Titán?",
      "Los misteriosos hidrocarburos de Titán: un laboratorio natural para estudiar la química prebiótica.",
      "Comparativa entre Titán, Europa y Encelado: ¿cuál ofrece más posibilidades de albergar vida?",
      "Dragonfly: cómo funcionará el primer vehículo volador que explorará otro mundo.",
      "¿Qué instrumentos científicos llevará Dragonfly y qué buscarán exactamente?",
      "¿Cómo se alimenta un robot nuclear mediante un generador termoeléctrico de radioisótopos (RTG)?"
    ]
  },
  {
    id: 49,
    title: "La megafauna del Carbonífero y los insectos gigantes que dominaron el planeta",
    subtopics: [
      "El periodo Carbonífero hace 300 millones de años: niveles de oxígeno atmosférico del 35% frente al 21% actual.",
      "La relación física entre los niveles de oxígeno y el tamaño máximo de los insectos (que respiran pasivamente por tráqueas).",
      "Meganeura (libélulas del tamaño de águilas) y Arthropleura (milpiés de más de 2 metros de longitud): ¿cómo vivían?",
      "La fotosíntesis masiva que generó los mayores depósitos de carbón mineral de los que depende hoy la humanidad.",
      "¿Cómo era un bosque del Carbonífero? Helechos gigantes, licopodios y pantanos infinitos.",
      "¿Por qué el Carbonífero produjo tanto carbón y por qué hoy ya no ocurre lo mismo?",
      "¿Qué animales dominaban la Tierra antes de los dinosaurios?",
      "Los primeros reptiles: el gran salto evolutivo que permitió conquistar los ambientes secos.",
      "¿Cómo respiran los insectos y por qué ese sistema limita su tamaño máximo?",
      "Sobrevivirías en un bosque del carbonifero?",
      "¿Podrían volver a existir insectos gigantes si aumentara el oxígeno atmosférico?",
      "La fotosíntesis masiva que generó los mayores depósitos de carbón mineral de los que depende hoy la humanidad."
    ]
  },
{
  id: 50,
  title: "Misterios geológicos: los secretos ocultos en el interior de la Tierra",
  subtopics: [
    "El pulso de la Tierra: ¿por qué nuestro planeta vibra continuamente aunque no haya terremotos?",
    "El zumbido de la Tierra: el misterioso sonido que emite nuestro planeta y que los humanos no podemos escuchar.",
    "La peridotita verde: ¿qué aspecto tiene realmente la roca que forma gran parte del manto terrestre?",
    "Los océanos ocultos a 500 km de profundidad: ¿puede haber enormes cantidades de agua atrapadas dentro de los minerales del manto?",
    "Las superestructuras LLSVP: gigantescas masas desconocidas en las profundidades de la Tierra que podrían tener miles de kilómetros de diámetro.",
    "¿Qué hay realmente en el centro de la Tierra? Cómo sabemos que existe un núcleo sólido dentro de uno líquido.",
    "¿Cómo podemos estudiar el interior de la Tierra si nadie ha conseguido perforar hasta el manto?",
    "Las ondas sísmicas como 'rayos X' del planeta: cómo permiten descubrir estructuras que nunca hemos visto.",
    "¿Existen ríos o corrientes de roca líquida bajo nuestros pies?",
    "La tectónica de placas: ¿por qué continentes enteros se desplazan varios centímetros cada año?",
    "¿Podría existir vida a cientos de kilómetros bajo nuestros pies?",
    "El agua profunda de la Tierra: ¿cuánta podría estar almacenada en minerales del manto?",
    "El diamante que llegó del manto: cómo algunos minerales contienen pistas sobre las profundidades de la Tierra.",
    "Las plumas del manto: enormes columnas de roca caliente que podrían alimentar volcanes durante millones de años.",
    "¿Qué provocó realmente las mayores erupciones volcánicas de la historia?",
    "La Tierra que respira: cómo el carbono y el agua viajan continuamente entre la superficie y el interior del planeta.",
    "¿Podría existir un 'segundo océano' escondido dentro de la Tierra?",
    "Las montañas que desaparecen: qué ocurre con las rocas cuando son arrastradas hacia el interior mediante la subducción.",
    "¿Por qué la Tierra tiene un campo magnético y Marte lo perdió?",
    "El núcleo de la Tierra se está enfriando: ¿qué ocurrirá cuando deje de ser suficientemente caliente?",
    "¿Puede cambiar la velocidad de rotación de la Tierra? El planeta que acelera y frena constantemente.",
    "Los terremotos más profundos: ¿cómo puede romperse una roca a cientos de kilómetros bajo tierra?",
    "¿Cómo era el Mediterráneo antes de convertirse en el mar que conocemos? La crisis de salinidad del Messiniense.",
    "¿Podría volver a cerrarse el estrecho de Gibraltar y desaparecer el Mediterráneo en el futuro geológico?",
    "La inundación Zancleana: ¿cómo volvió a llenarse el Mediterráneo tras quedar prácticamente aislado?",
    "Cádiz y Sevilla hace millones de años: ¿qué aspecto tenía el suroeste de la península cuando estaba cubierto por el mar?",
    "¿Por qué aparecen fósiles marinos en las montañas de Andalucía?",
    "El choque entre África y Europa: cómo está deformando actualmente la península Ibérica.",
    "¿Por qué Granada es una de las zonas con mayor actividad sísmica de la península Ibérica?",
    "El terremoto de Lisboa de 1755: ¿qué sabemos sobre el gran terremoto, tsunami e incendio que transformó Europa?",
    "¿Podría repetirse un gran terremoto como el de Lisboa y afectar actualmente a España y Portugal?",
    "El arco de Gibraltar: una de las estructuras tectónicas más fascinantes y complejas del Mediterráneo occidental.",
    "¿Cómo será el Mediterráneo dentro de millones de años si África continúa acercándose a Europa?",
    "¿Podría desaparecer el estrecho de Gibraltar y convertirse el Mediterráneo en un enorme lago?",
    "¿Qué secretos podrían esconder las zonas más profundas de la corteza oceánica?",
    "El futuro de la geología: ¿qué nuevos misterios del interior de la Tierra podremos resolver durante este siglo?"
  ]
}
];
