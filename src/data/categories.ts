export interface CharadaCard {
    word: string;
    verse?: string;
    description?: string;
    mime?: string;
    // New fields for Apocalipsis
    title?: string; // Original title from data
    capitulo?: string;
    thread?: string;
    exegesis?: string;
    oldTestament?: { ref: string; text: string }[];
    symbology?: { item: string; meaning: string }[];
    imagen?: string;
}

/**
 * WORD COUNTS (Generated Debug Info)
 * ----------------------------------
 * De la Tierrita: 106
 * Parranda Santa: 95
 * Farándula Criolla: 79
 * Pasión Tricolor: 80
 * Pueblos y Ciudades: 95
 * Dichos y Refranes: 100
 * Paisas Pues: 140
 * Costeños: 118
 * Rolos (Cachacos): 110
 * Santandereanos: 105
 * Llaneros: 110
 * Vallunos: 155
 */
export interface Category {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    words: (string | CharadaCard)[];
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    isCustom?: boolean;
    image?: any; // For require() or uri
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_CATEGORIES: Category[] = [

    {
        id: 'col_general',
        title: 'De la Tierrita',
        description: 'Cosas que todo colombiano conoce.',
        icon: '🇨🇴',
        color: '#FFD700', // Amarillo
        difficulty: 'Fácil' as const,
        image: require('../../assets/cat_tierrita.png'),
        words: [
            'Arepa', 'Bandeja Paisa', 'Chigüiro', 'Transmilenio', 'Paseo de Olla',
            'Tinto', 'Aguacate', 'Sombrero Vueltiao', 'Ruana', 'Ajiaco',
            'Manilla', 'Chiva', 'Empanada', 'Buñuelo', 'Natilla',
            'Sancocho', 'Bocadillo', 'Oblea', 'Tamal', 'Hormiga Culona',
            'Mochila Wayúu', 'Lechona', 'Patacón', 'Changua', 'Mazamorra',
            'Almojábana', 'Pandebono', 'Chocolate con Queso', 'Fritanga', 'Corrientazo',
            'Buseta', 'Colectivo', 'Plaza de Mercado', 'Vendedor Ambulante', 'Paloquemao',
            'Ciclovía', 'Pico y Placa', 'Trancón', 'Aguinaldo',
            'Año Viejo', 'Finca', 'Hamaca', 'Alpargatas',
            'Carriel', 'Poncho', 'Orquídea', 'Palma de Cera', 'Cóndor',
            // Nuevas (50+)
            'Chontaduro', 'Lulada', 'Champús', 'Guanábana', 'Uchuva',
            'Granadilla', 'Pitaya', 'Borojó', 'Zapote', 'Mangostino',
            'Mamoncillo', 'Corozo', 'Guayaba', 'Maracuyá', 'Tomate de Árbol',
            'Cocadas', 'Panelitas', 'Hojaldra', 'Envuelto', 'Subido',
            'Mantecada', 'Roscón', 'Liberal', 'Mojicón', 'Garulla',
            'Achiras', 'Canguil', 'Crispetas', 'Maiz Pira', 'Bollo Limpio',
            'Suero Costeño', 'Mote de Queso', 'Rondón', 'Cuy', 'Ternera a la Llanera',
            'Mamona', 'Carne Oreada', 'Pepitoria', 'Mute', 'Genovesas',
            'Changua', 'Caldo de Costilla', 'Sopa de Mondongo', 'Cazuela de Mariscos', 'Arroz de Coco',
            'Arroz Atollado', 'Arroz con Pollo', 'Salpicón', 'Agua de Panela', 'Huevos Pericos'
        ]
    },
    {
        id: 'col_music',
        title: 'Folclor y Ritmos',
        description: 'Desde Vallenato hasta lo urbano.',
        icon: '🎵',
        color: '#00D4FF', // Cyan
        difficulty: 'Medio' as const,
        image: require('../../assets/cat_music.png'),
        words: [
            'Cumbia', 'Vallenato', 'Porro', 'Bambuco', 'Pasillo',
            'Joropo', 'Currulao', 'Mapalé', 'Merecumbé', 'Chandé',
            'Bullerengue', 'Tambora', 'Gaita', 'Acordeón', 'Caja Vallenata',
            'Guacharaca', 'Arpa Llanera', 'Cuatro', 'Bandola', 'Tiple',
            'Requinto', 'Marimba de Chonta', 'Cununo', 'Guasá', 'Sombrero Vueltiao',
            'Mochila Arhuaca', 'Ruana', 'Alpargatas', 'Carriel', 'Festival Vallenato',
            'Carnaval de Barranquilla', 'Feria de las Flores', 'Blancos y Negros', 'La Pollera Colorá', 'Colombia Tierra Querida',
            'La Piragua', 'El Sanjuanero', 'Yo Me Llamo Cumbia', 'Espumas', 'Pueblito Viejo',
            'Las Acacias', 'Los Guaduales', 'Antioqueñita', 'El Pescador', 'Prende la Vela',
            // Nuevas (Musicales y Culturales)
            'Danza del Garabato', 'El Congo', 'Son de Negro', 'Cumbiamberas', 'Silleteros',
            'Desfile de Mitos', 'Cuadrillas de San Martín', 'Torneo del Joropo', 'Raje', 'Rajaleña',
            'San Pedro en el Huila', 'Festival del Petronio', 'Festival de la Leyenda', 'Piqueria', 'Trova Paisa',
            'Copla', 'Décima', 'Zafra', 'Cantos de Vaquería', 'Alabaos',
            'Chirimía', 'Murga', 'Papayera', 'Banda Pelayera', 'Serenata',
            'Tuna', 'Estudiantina', 'Dueto', 'Trio', 'Conjunto Vallenato',
            'Parranda Vallenata', 'Toque de Tambores', 'Rueda de Cumbia', 'Fandango', 'Grito de Monte'
        ]
    },
    {
        id: 'col_tv',
        title: 'Farándula Criolla',
        description: 'Novelas, reinas y personajes.',
        icon: '📺',
        color: '#FF1744', // Red
        difficulty: 'Fácil' as const,
        image: require('../../assets/cat_tv.png'),
        words: [
            'Betty la Fea', 'Pedro el Escamoso', 'Epa Colombia', 'Amparo Grisales', 'Sofía Vergara',
            'Don Armando', 'La Pola', 'Café con Aroma de Mujer', 'Desafío',
            'Sábados Felices', 'Pirry', 'Jota Mario', 'Margarita Rosa de Francisco',
            'Lina Tejeiro', 'La Liendra', 'Juanpis González', 'Maleja Restrepo',
            'Elif', 'Pasión de Gavilanes', 'La Hija del Mariachi', 'Los Reyes', 'Padres e Hijos',
            'Cuentos de los Hermanos Grimm', 'El Chavo (aunque no es de acá se ve mucho)', 'Jorge Barón', 'Show de las Estrellas', 'La Voz Colombia',
            'MasterChef', 'Claudia Bahamón', 'Gregorio Pernía', 'Robinson Díaz', 'Julián Román',
            'Catherine Siachoque', 'Aura Cristina Geithner', 'Endry Cardeño',
            // Nuevas (50+)
            'Cabal y Farah', 'Totono Grisales',
            'Ana Sofía Henao', 'Taliana Vargas',
            'Paulina Vega', 'Ariadna Gutiérrez', 'Andrea Serna', 'Carolina Cruz', 'Jessica Cediel',
            'Laura Acuña', 'Vicky Dávila', 'Juan Diego Alvira', 'Séptimo Día', 'El Rastro',
            'Profesor Super O', 'Tal Cual', 'Frailejón Ernesto Pérez', 'Aurelio Cheveroni', 'Club 10',
            'Buki', 'Mary Méndez', 'Carlos Calero', 'Agmeth Escaf', 'La Gorda Fabiola',
            'Polilla', 'Don Jediondo', 'Mandíbula', 'Alerta', 'Hassam',
            'Suso el Paspi', 'Lokillo', 'Piter Albeiro', 'Camilo Cifuentes', 'Vargasvil',
            'La Reina del Flow', 'Hasta que la plata nos separe'
        ]
    },
    {
        id: 'col_sports',
        title: 'Pasión Tricolor',
        description: 'Nuestra gloria deportiva.',
        icon: '⚽',
        color: '#FFEA00', // Yellow
        difficulty: 'Medio' as const,
        image: require('../../assets/cat_sports.png'),
        words: [
            'Selección Colombia', 'El Pibe Valderrama', 'René Higuita', 'El Escorpión', 'Faustino Asprilla',
            'James Rodríguez', 'Radamel Falcao García', 'Lucho Díaz', 'David Ospina', 'Juan Guillermo Cuadrado',
            'Nairo Quintana', 'Rigoberto Urán', 'Egan Bernal', 'Lucho Herrera', 'Cochise Rodríguez',
            'Mariana Pajón', 'Caterine Ibargüen', 'Anthony Zambrano', 'Yuberjén Martínez', 'María Isabel Urrutia',
            'Oscar Figueroa', 'Juan Pablo Montoya', 'Tatiana Calderón', 'Cabal y Farah', 'Alejandro Falla',
            'Atlético Nacional', 'Millonarios', 'América de Cali', 'Independiente Santa Fe', 'Junior de Barranquilla',
            'Deportivo Cali', 'Independiente Medellín', 'Once Caldas', 'Campeón de la Libertadores', 'El 5-0 contra Argentina',
            'Gol de Yepes', 'Era Gol de Yepes', 'Mundial Brasil 2014', 'Copa América 2001', 'Estadio Metropolitano',
            'El Campín', 'Atanasio Girardot', 'Tejo', 'Mecha', 'Bocín',
            'Rana', 'Bolo Criollo', 'Chaza', 'Patinaje', 'Chechi Baena',
            'La Selección Femenina', 'Linda Caicedo', 'Catalina Usme', 'Supermán López', 'Chavita',
            'Caiman Sanchez', 'Willigton Ortiz', 'El Tino Asprilla', 'Tren Valencia', 'Leonel Álvarez',
            'Totono Grisales', 'Faryd Mondragón', 'Mario Yepes', 'Mayer Candelo', 'Chicho Serna',
            'Aristizábal', 'El Palomo Usuriaga', 'Iván Ramiro Córdoba', 'Miguel Calero', 'Abel Aguilar',
            'Macnelly Torres', 'Teófilo Gutiérrez', 'Pambelé', 'Happy Lora', 'Beisbol',
            'Edgar Rentería', 'Gio Urshela', 'Pesas', 'Ciclismo', 'Fútbol de Salón'
        ]
    },
    {
        id: 'col_geo',
        title: 'Pueblos y Ciudades',
        description: 'De norte a sur, de oriente a occidente.',
        icon: '🗺️',
        color: '#00E676', // Green
        difficulty: 'Medio' as const,
        image: require('../../assets/cat_geo.png'),
        words: [
            'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla',
            'Guatapé', 'Salento', 'Villa de Leyva', 'Santa Marta', 'San Andrés',
            'Leticia', 'Pasto', 'Manizales', 'Popayán', 'Bucaramanga',
            'Caño Cristales', 'Desierto de la Tatacoa', 'Parque Tayrona', 'Piedra del Peñol',
            'Ciudad Perdida', 'Valle del Cocora', 'Laguna de Guatavita',
            'Barichara', 'Mompox', 'Jardín (Antioquia)', 'Filandia', 'Monguí',
            'Isla Gorgona', 'Cabo de la Vela', 'Punta Gallinas', 'Parque de los Nevados', 'Volcán Totumo',
            'Chocó', 'Nuquí', 'Bahía Solano', 'Amazonas', 'Llanos Orientales',
            'Río Magdalena', 'Río Cauca', 'Nevado del Ruiz', 'Sierra Nevada', 'Chicamocha',
            // Nuevas (50+)
            'Tunja', 'Duitama', 'Sogamoso', 'Paipa', 'Ráquira',
            'Chiquinquirá', 'Honda', 'Mariquita', 'Girardot', 'Melgar',
            'Ibagué', 'Neiva', 'Villavicencio', 'Yopal', 'Arauca',
            'Florencia', 'Mocoa', 'Mitú', 'Puerto Inírida', 'Puerto Carreño',
            'San José del Guaviare', 'Tumaco', 'Buenaventura', 'Quibdó', 'Turbo',
            'Necoclí', 'Capurganá', 'Sapzurro', 'Tolú', 'Coveñas',
            'Sincelejo', 'Montería', 'Valledupar', 'Riohacha', 'Maicao',
            'Uribia', 'Manaure', 'Palomino', 'Minca', 'Taganga',
            'Isla Fuerte', 'Isla Múcura', 'Tintipán', 'Providencia', 'Santa Catalina',
            'Malpelo', 'Parque de los Katíos', 'Chiribiquete', 'Amacayacu', 'Sumapaz'
        ]
    },
    {
        id: 'col_sayings',
        title: 'Dichos y Refranes',
        description: 'Para que hable como es.',
        icon: '🗣️',
        color: '#AA00FF', // Purple
        difficulty: 'Difícil' as const,
        image: require('../../assets/cat_sayings.png'),
        words: [
            'No de papaya', 'Camello', 'Parcero',
            'Chimba', 'Vaca', 'Hacer vaca', 'Echar los perros', 'Mamando gallo',
            'Se le tiene', 'Pailas', 'Ñapa', 'Chicharrón', 'Mecato',
            'Tengo filo', 'Berraco', 'Hágale', '¡Quiubo!', 'Su merced',
            'Dar lora', 'Echar gafa', 'Pasarla bueno', 'Tirarse el paso', 'Hacerse el loco',
            'Ponerse las pilas', 'Sacar la piedra', 'Tener huevo', 'Ser un sapo', 'Estar moscas',
            'Comer cuento', 'Armar la gorda', 'Caer gordo', 'Parar bolas', 'Tomar del pelo',
            'A otro perro con ese hueso', 'Salió de guatemala a guatepeor', 'No me abra los ojos', 'Me importa un comino', 'Se le mojó la canoa',
            'Cójala suave', 'Frens', 'Severo', 'Visaje', 'Boleta',
            'Chanda', 'Entonado',
            // Nuevas (50+)
            'Pilas pues', 'Juepucha (sin ofender)', 'Despistado', 'Compadre', 'Habla carretas',
            'Qué vaina', 'Carachas', 'Eche', 'No friegue', 'Ajá',
            'Cógela con su avena y su pitillo', 'El que tiene tienda que la atienda', 'Mugen, no te vistas que no vas', 'Soldado avisado no muere en guerra', 'A caballo regalado no se le mira el diente',
            'Más vale pájaro en mano', 'En casa de herrero azadón de palo', 'Matar dos pájaros de un tiro', 'Camarón que se duerme',
            'Barriga llena corazón contento', 'Cría cuervos y te sacarán los ojos', 'Dime con quién andas', 'El que busca encuentra',
            'Hierba mala nunca muere', 'Loros viejos no aprenden a hablar', 'Ojos que no ven', 'Perro que ladra no muerde',
            'Al que le van a dar le guardan', 'Amanecerá y veremos', 'Cada loco con su cuento', 'De eso tan bueno no dan tanto', 'El que mucho abarca poco aprieta',
            'Hijo de tigre sale pintado', 'La ropa sucia se lava en casa', 'Lo barato sale caro', 'Mal de muchos consuelo de tontos', 'Más vale tarde que nunca',
            'No hay mal que por bien no venga', 'Ojo por ojo', 'Papelito habla', 'Quien tiene boca se equivoca', 'Sarna con gusto no pica',
            'Tanto va el cántaro al agua', 'Una golondrina no hace verano', 'Zapatero a tus zapatos', 'Tener la sartén por el mango', 'Estar en la olla'
        ]
    },
    {
        id: 'col_paisa',
        title: 'Paisas Pues',
        description: '¡Más paisa que la arepa!',
        icon: '🤠',
        color: '#2E7D32', // Forest Green
        difficulty: 'Medio' as const,
        image: require('../../assets/Paisas.png'),
        words: [
            // Lugares y Cultura
            'Bandeja Paisa', 'Feria de las Flores', 'Silleteros', 'Metro de Medellín', 'Pueblito Paisa',
            'Guatapé', 'Piedra del Peñol', 'Jericó', 'Santa Fe de Antioquia', 'Parque Lleras',
            'Plaza de Botero', 'Comuna 13', 'El Poblado', 'Jardín', 'Támesis',
            'Suroeste Antioqueño', 'Oriente Antioqueño', 'Río Medellín', 'Cerro Nutibara', 'Cerro de las Tres Cruces',
            'Edificio Coltejer', 'Parque Berrío', 'Parque Explora', 'Jardín Botánico', 'Museo de Antioquia',
            'Sabaneta', 'Envigado', 'Itagüí', 'Bello', 'La Estrella',
            'Caldas', 'Copacabana', 'Girardota', 'Barbosa', 'San Pedro de los Milagros',
            'Santa Elena', 'Palmas', 'San Antonio de Pereira', 'Carmen de Viboral', 'La Ceja',
            'Rionegro', 'Marinilla', 'El Retiro', 'Sonsón', 'Andes',
            'Ciudad del Río', 'Puente de Occidente', 'Hidroituango', 'EPM', 'Medellín',
            // Comida
            'Arepa Paisa', 'Arepa de Chócolo', 'Mazamorra', 'Claro', 'Mondongo',
            'Fríjoles', 'Chicharrón', 'Chorizo', 'Morcilla', 'Hogao',
            'Calentado', 'Parva', 'Buñuelo', 'Pandequeso', 'Quesito',
            'Brevas con Arequipe', 'Solteritas', 'Oblea', 'Salpicón', 'Empanada Envigadeña',
            'Sancocho Antioqueño', 'Sudado de Pollo', 'Carne Molida', 'Tajadas de Maduro', 'Agua de Panela con Queso',
            // Modismos y Personajes
            'Pues', 'Oigan a mi tío', 'Charro', 'Chimba',
            'Parce', 'Mañé', 'Taco (Trancón)', 'Cojer la comba al palo', 'Dar visaje',
            'Comer callado', 'Desparchado', 'Embalado', 'Farra',
            'Loliar', 'Mister', 'Achantado', 'Amañado', 'Arracachas',
            'Berraco', 'Boquisabroso', 'Casado', 'Chichipato', 'Chicanear',
            'La Eterna Primavera', 'Atlético Nacional', 'Independiente Medellín', 'Fernando Botero', 'Rigoberto Urán', 'Cochise Rodríguez',
            'Rene Higuita', 'Faber Burgos', 'Suso el Paspi', 'Cosiaca', 'Pedro Rimales',
            'Moniar', 'Poliar', 'Voliar', 'Chichar', 'Culebrero',
            'Arriero', 'Mula', 'Carriel', 'Poncho', 'Sombrero Aguadeño',
            'Machete', 'Alpargatas', 'Ruana', 'Tiple', 'Trova Paisa',
            'Fonda', 'Finca', 'Mayordomo', 'La Feria',
            'Arepa de Mote', 'Cerezas', 'Casquitos de Guayaba'
        ]
    },
    {
        id: 'col_costeno',
        title: 'Costeños',
        description: 'Ajá, ¿y qué? Sabor y alegría.',
        icon: '🏖️',
        color: '#0288D1', // Light Blue
        difficulty: 'Fácil' as const,
        image: require('../../assets/Costenos.png'),
        words: [
            // Dichos y Expresiones
            'Ajá', 'Cule vaina', 'Bollo limpio', 'Suero costeño',
            'Mote e´ queso', 'Arroz de coco', 'Arepa de huevo', 'Patacón', 'Carimañola',
            'Eche', 'Erda', 'Cipote', 'Barro', 'Lenteja',
            'Espeluque', 'Full', 'Corroncho', 'Espantajopo',
            'Filo', 'Foco', 'Mamar gallo', 'Pechichón', 'Recocha',
            'Sereno', 'Zapote', 'Chévere', 'Bacano',
            'Pelao', 'Cuadro', 'Llave', 'Compadre', 'Mijito',
            'Cule pava', 'Te la vacilas', 'Pura laya',
            // Comida
            'Cayeye', 'Cabeza de Gato', 'Sancocho de Pescado', 'Viuda de Pescado', 'Arroz de Lisa',
            'Butifarra', 'Kibbeh', 'Pan de Bono Costeño', 'Jugo de Corozo', 'Agua de Coco',
            'RASPAO', 'Bollo de Mazorca', 'Bollo de Yuca', 'Queso Costeño', 'Bocachico',
            'Mojarra Frita', 'Coctel de Camarón', 'Cazuela de Mariscos', 'Langosta', 'Muelas de Cangrejo',
            'Enyucado', 'Cocada', 'Alegría', 'Caballito', 'Dulce de Ñame',
            // Cultura y Lugares
            'Sombrero Vueltiao', 'Marimonda', 'Carnaval de Barranquilla', 'La Ventana al Mundo', 'Castillo de San Felipe',
            'Murallas de Cartagena', 'Parque Tayrona', 'Sierra Nevada', 'Ciudad Perdida', 'Cabo de la Vela',
            'Punta Gallinas', 'Manaure', 'Palomino', 'Minca', 'Taganga',
            'Rodadero', 'Bocagrande', 'La Boquilla', 'Playa Blanca', 'Isla Barú',
            'Islas del Rosario', 'Mompox', 'Ciénaga', 'Aracataca', 'Valledupar',
            'Riohacha', 'Sincelejo', 'Montería', 'San Andrés', 'Providencia',
            'Vallenato', 'Cumbia', 'Porro', 'Mapalé', 'Champeta',
            'Fandango', 'Bullerengue', 'Chandé', 'Gaita', 'Tambora',
            // Personajes
            'El Pibe Valderrama', 'Sofía Vergara',
            'Radamel Falcao', 'Edgar Rentería', 'Teófilo Gutiérrez', 'Pambelé',
            'Gabriel García Márquez', 'Totó la Momposina', 'Petrona Martínez', 'Estercita Forero', 'Checo Acosta'
        ]
    },
    {
        id: 'col_rolo',
        title: 'Rolos (Cachacos)',
        description: 'Ala, qué frío tan machu.',
        icon: '🧣',
        color: '#455A64', // Blue Grey
        difficulty: 'Medio' as const,
        image: require('../../assets/Rolos.png'),
        words: [
            // Comida
            'Ajiaco', 'Changua', 'Tamal con chocolate', 'Almojábana', 'Pandebono',
            'Chocolate santafereño', 'Agua de panela con queso', 'Oblea', 'Milhoja', 'Roscon resobado',
            'Pan de yuca', 'Gullas', 'Garullas', 'Masato', 'Chicha',
            'Fritanga', 'Piquete', 'Gallina criolla', 'Sopa de pan', 'Cuchuco de trigo',
            'Mazorca', 'Envuelto de mazorca', 'Cuajada con melao', 'Brevas con arequipe', 'Postre de natas',
            'Merengón', 'Fresas con crema', 'Salpicón', 'Aromática',
            // Lugares
            'Plaza de Bolívar', 'La Candelaria', 'Chorro de Quevedo', 'Usaquén',
            'Parque Simón Bolívar', 'Jardín Botánico', 'Maloka', 'Mundo Aventura', 'Salitre Mágico',
            'El Campín', 'Movistar Arena', 'Teatro Colón', 'Museo del Oro', 'Museo Nacional',
            'Torre Colpatria', 'Planetario', 'Biblioteca Virgilio Barco', 'Zona T', 'Parque de la 93',
            'Transmilenio', 'Séptima', 'Ciclovía', 'Paloquemao', 'Corabastos',
            'Guatavita', 'Suesca', 'Zipaquirá', 'La Calera',
            'Sopó', 'Chía', 'Cajicá', 'Tabio', 'Tenjo',
            // Expresiones y Cultura
            'Ala', 'Chusco', 'Paila', 'Ñero', 'Gomelo',
            'Hablar paja', 'Jurgo', 'Tinto', 'Huevos Pericos', 'Onces',
            'Rumbiar', 'Sietecueros', 'Llovizna',
            'Trancón', 'Buseta', 'Colectivo', 'Taxi', 'Uber',
            'Carachas', 'Sumercé', 'Regáleme', 'Vecino', 'Mondongo',
            'Chino', 'Mija', 'Juepuerca',
            'Tan bonito', 'Hacer vaca', 'Caer gordo', 'Parar bolas',
            'Sacar la piedra', 'Tener huevo', 'Hacer oso', 'Darse garra', 'Estar moscas',
            'Millonarios', 'Santa Fe', 'La Equidad', 'Fortaleza', 'Bogotá FC'
        ]
    },
    {
        id: 'col_santander',
        title: 'Santandereanos',
        description: '¡Mano! Carácter y hormigas.',
        icon: '😡',
        color: '#D84315', // Deep Orange
        difficulty: 'Difícil' as const,
        image: require('../../assets/Santander.png'),
        words: [
            // Comida
            'Hormiga Culona', 'Mute', 'Cabrito', 'Pepitoria', 'Arepa Santandereana',
            'Carne Oreada', 'Bocadillo Veleño', 'Tamal Santandereano', 'Chicha', 'Masato',
            'Chorizo del Valle de San José', 'Dulce de Arroz', 'Génovas', 'Piña de Lebrija', 'Cacao',
            'Chocolate Cruz', 'Kola Hipinto', 'Sopa de Mondongo',
            'Sopa de arepa', 'Arroz de pepitoria', 'Yuca frita', 'Ají', 'Dulce de apio',
            // Lugares
            'Cañón del Chicamocha', 'Panachi', 'Barichara', 'San Gil', 'Bucaramanga',
            'Girón', 'Zapatoca', 'El Socorro', 'Puente del Común', 'Salto del Duende',
            'Lengerke', 'Mesa de los Santos', 'Piedecuesta', 'Floridablanca', 'Barrancabermeja',
            'Río Suárez', 'Río Fonce', 'Cueva del Indio', 'Cascada de Juan Curi', 'Parque Gallineral',
            'Hoyopiri', 'Páramo de Santurbán', 'Berlín', 'Vetas',
            // Expresiones
            'Mano', 'Pingo', 'Toche', 'Arrecho',
            'Joda', 'Nonos', 'Chino', 'Motilones', 'Berraco',
            'Mire puest', 'Usted', 'Fuete', 'Chocatos', 'Zute',
            'Juepuerca', 'Ole', '¡Diga!', 'Tantico',
            '¡Calle la jeta!', 'Topar', 'Atanquiza', 'Vusté', 'Coshcos',
            'Fúquese', 'Gurre', 'Guache', 'Soche', 'Jarto',
            'Lambón', 'Pingarria', 'Retahíla', 'Surrón', 'Tiesto',
            // Cultura y Personajes
            'Atlético Bucaramanga', 'Alianza Petrolera', 'Cúcuta Deportivo (Vecino)', 'Comuneros', 'Galán',
            'Manuela Beltrán', 'Antonia Santos', 'Virgilio Barco', 'Luis Carlos Galán', 'Rodolfo Hernández',
            'Bambuco', 'Torbellino', 'Guabina', 'Tiple',
            'Requinto', 'Alpargatas', 'Sombrero Vueltiao (Uso común)', 'Ruana (En páramo)', 'Tabaco'
        ]
    },
    {
        id: 'col_llanero',
        title: 'Llaneros',
        description: 'Joropo, carne y sabana.',
        icon: '🐎',
        color: '#FF8F00', // Amber
        difficulty: 'Difícil' as const,
        image: require('../../assets/Llaneros.png'),
        words: [
            // Cultura y Música
            'Joropo', 'Arpa', 'Cuatro', 'Maracas', 'Capachos',
            'Bandola', 'Coleo', 'Manga de coleo', 'Trabajo de llano', 'Cantos de vaquería',
            'Contrapunteo', 'Pasaje', 'Golpe', 'Zumba que zumba', 'Seis numerao',
            'Gabán', 'Pajarillo', 'Quirpa', 'Chipola', 'San Rafael',
            'Festival de la Canción Llanera', 'Torneo Internacional del Joropo', 'Cuadrillas de San Martín', 'Festival del Retorno', 'Día de la Llaneridad',
            // Comida
            'Mamona', 'Ternera a la llanera', 'Carne a la perra', 'Chigüiro', 'Cachama',
            'Sancocho de gallina', 'Picillo', 'Tungos', 'Majule',
            'Agua de Arroz', 'Cacho', 'Queso siete cueros', 'Pan de arroz', 'Rosquitas de sagú',
            'Gofios', 'Dulce de marañón', 'Melcocha', 'Masato de arroz',
            'Topocho', 'Plátano maduro', 'Yuca brava', 'Mañoco', 'Casabe',
            // Naturaleza y Lugares
            'Caño Cristales', 'Villavicencio', 'Yopal', 'Arauca', 'Puerto Carreño',
            'San Martín', 'Granada', 'Acacías', 'Restrepo', 'Cumaral',
            'Río Meta', 'Río Guaviare', 'Río Orinoco', 'Río Manacacías', 'Obelisco',
            'Los Ocarros', 'Malocas', 'Las Pavas', 'Tame', 'Saravena',
            'Sabana', 'Morichal', 'Esteros', 'Matas de monte', 'Serranía de la Macarena',
            'Chigüiro', 'Venado', 'Ocarro', 'Oso palmero', 'Corocora',
            // Expresiones y Utensilios
            'Guate', 'Pariente', 'Camarita', 'Botalón', 'Fundo',
            'Hato', 'Garero', 'Pijotero', 'Veguero', 'Cimarron',
            'Cabrestero', 'Baquiano', 'Soguero', 'Mensú', 'Caballeriza',
            'Hamaca', 'Campechana', 'Chinchorro', 'Mosquitero', 'Totuma',
            'Cotizas', 'Liquiliqui', 'Sombrero llanero', 'Rejo', 'Soga',
            'Chafalote', 'Cuchillo', 'Polainas', 'Espuelas', 'Montura'
        ]
    },
    {
        id: 'col_valluno',
        title: 'Vallunos',
        description: '¡Mirá ve! Salsa y sabor.',
        icon: '💃',
        color: '#8E24AA', // Purple
        difficulty: 'Medio' as const,
        image: require('../../assets/Vallunos.png'),
        words: [
            // Comida
            'Cholado', 'Champús', 'Lulada', 'Pandebono', 'Manjar Blanco',
            'Aborrajado', 'Marranitas', 'Chontaduro', 'Sancocho de Gallina', 'Chuleta Valluna',
            'Empanada Valluna', 'Ají de Maní', 'Bofe', 'Chilapos', 'Jugo de Borojó',
            'Dulce de Cortado', 'Desamargado', 'Maceta', 'Alfeñique', 'Pan de Yuca',
            'Rosquillas', 'Tostadas de Plátano', 'Arroz Atollado', 'Fiambre', 'Tamal Valluno',
            'Bizcocho de Cuajada', 'Caspi', 'Grosellas con Sal', 'Mango Biche', 'Gelatina de Pata',
            'Arepa de Chócolo (también se ve)', 'Hojaldras', 'Trababuches', 'Champus valluno',
            // Lugares
            'Cali', 'Río Pance', 'Bulevar del Río',
            'Gato de Tejada', 'Barrio San Antonio', 'Juanchito', 'Km 18',
            'Lago Calima', 'Buga', 'Tuluá', 'Palmira',
            'Cartago', 'Bordados de Cartago', 'Zoológico de Cali', 'Estadio Pascual Guerrero', 'Plaza de Cayzedo',
            'Chipichape', 'Unicentro Cali', 'Jardín Botánico', 'Museo La Tertulia', 'Teatro Municipal',
            'Parque del Perro', 'Granada', 'Menga', 'Dapa', 'San Cipriano',
            'Buenaventura', 'Muelle Turístico', 'Ladrilleros', 'Juanchaco', 'Bahía Málaga',
            'Jamundí', 'Yumbo', 'Candelaria', 'Florida', 'Pradera',
            'El Cerrito', 'Hacienda El Paraíso', 'Ginebra', 'Guacarí', 'Roldanillo',
            'Zarzal', 'Sevilla', 'Caicedonia', 'La Unión', 'Versalles',
            // Salsa y Cultura
            'Feria de Cali', 'Salsódromo', 'Grupo Niche', 'Guayacán Orquesta', 'Jairo Varela',
            'Piper Pimienta', 'Delirio', 'Mulato Cabaret', 'Carpa Delirio',
            'Salsa Caleña', 'Pasos de Salsa', 'Cali Pachanguero', 'Oiga Mire Vea', 'Las Caleñas',
            'América de Cali', 'Deportivo Cali', 'El Clásico', 'Diablos Rojos', 'Azucareros',
            'La Mechita', 'El Glorioso', 'Palmaseca', 'Barón Rojo', 'Frente Radical',
            'Petronio Álvarez', 'Currulao', 'Marimba', 'Chirimía', 'Pacífico',
            // Jerga y Expresiones
            'Mirá ve', 'Oís', 'Písquelo', 'Borondo', 'Dar un borondo',
            'Chuspa', 'Calidoso', 'Aletoso', 'Bochinche', 'Churrusco',
            'Chontaduro (el vendedor)', 'Birlocha', 'Guachafita', 'Recocha', 'Desparche',
            'Foquiado', 'Chicanero', 'Voliar uña', 'Voliar pata', 'Zumbambico',
            'Cusumbosolo', 'Pamplinas', '¡Ve!', '¡Mirá!', '¡Oíme!',
            '¿La vistes?', '¿Lo vistes?', '¿Si o no?', 'Bien o qué', 'Todo bien',
            'Camellador', 'Entucado', 'Tusa', 'Enguayabado', 'Galería',
            'El MIO', 'Chiva', 'Motorratón', 'Guala', 'Jeepao'
        ]
    },
    {
        id: 'col_custom_example', // Example for type safety only, removed in real app usually or kept as placeholder
        title: 'Tu Propia Charada',
        description: '¡Crea la tuya!',
        icon: '✨',
        color: '#333',
        difficulty: 'Medio' as const,
        words: [],
        isCustom: true
    }
].filter(c => c.id !== 'col_custom_example'); // Filter out the example custom

// Re-export without the example

export const getCategories = async (): Promise<Category[]> => {
    try {
        const customJson = await AsyncStorage.getItem('custom_categories');
        const customCategories: Category[] = customJson ? JSON.parse(customJson) : [];
        return [...DEFAULT_CATEGORIES, ...customCategories];
    } catch (e) {
        console.error("Error loading categories", e);
        return DEFAULT_CATEGORIES;
    }
};

export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const customJson = await AsyncStorage.getItem('custom_categories');
        if (customJson) {
            const customCategories: Category[] = JSON.parse(customJson);
            const filtered = customCategories.filter(c => c.id !== id);
            await AsyncStorage.setItem('custom_categories', JSON.stringify(filtered));
        }
    } catch (e) {
        console.error("Error deleting category", e);
    }
};
