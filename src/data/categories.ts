export interface Category {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    words: string[];
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    isCustom?: boolean;
    image?: any; // For require() or uri
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_CATEGORIES: Category[] = [
    {
        id: 'col_general',
        title: '🇨🇴 De la Tierrita',
        description: 'Cosas que todo colombiano conoce.',
        icon: '🇨🇴',
        color: '#FFD700', // Amarillo
        difficulty: 'Fácil' as const,
        image: require('../../assets/Cultura.png'),
        words: [
            'Arepa', 'Bandeja Paisa', 'Chigüiro', 'Transmilenio', 'Paseo de Olla',
            'Tinto', 'Aguacate', 'Sombrero Vueltiao', 'Ruana', 'Ajiaco',
            'Manilla', 'Chiva', 'Empanada', 'Buñuelo', 'Natilla',
            'Sancocho', 'Bocadillo', 'Oblea', 'Tamal', 'Hormiga Culona',
            'Mochila Wayúu', 'Lechona', 'Patacón', 'Changua', 'Mazamorra',
            'Almojábana', 'Pandebono', 'Chocolate con Queso', 'Fritanga', 'Corrientazo',
            'Buseta', 'Colectivo', 'Plaza de Mercado', 'Vendedor Ambulante', 'Paloquemao',
            'Ciclovía', 'Pico y Placa', 'Trancón', 'Aguinaldo', 'Novena',
            'Velitas', 'Año Viejo', 'Finca', 'Hamaca', 'Alpargatas',
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
            'Arroz Atollado', 'Arroz con Pollo', 'Salpicón', 'Refajo', 'Pola',
            'Aguardiente', 'Ron Viejo de Caldas', 'Sabajón', 'Canelazo', 'Agua de Panela', 'Perico'
        ]
    },
    {
        id: 'col_music',
        title: '🎵 Parranda Santa',
        description: 'Desde Vallenato hasta lo urbano.',
        icon: '🎵',
        color: '#00D4FF', // Cyan
        difficulty: 'Medio' as const,
        image: require('../../assets/Music.png'),
        words: [
            'Carlos Vives', 'Shakira', 'J Balvin', 'Karol G', 'Juanes',
            'Joe Arroyo', 'Diomedes Díaz', 'Maluma', 'Grupo Niche', 'Binomio de Oro',
            'La Gota Fría', 'Cali Pachanguero', 'La Bicicleta', 'El Preso', 'Fruta Fresca',
            'Celia Cruz', 'Choquibtown', 'Fonseca', 'Silvestre Dangond', 'Cumbiana',
            'Sebastián Yatra', 'Camilo', 'Andrés Cepeda', 'Totó la Momposina', 'Petrona Martínez',
            'Lisandro Meza', 'Rodolfo Aicardi', 'Los Hispanos', 'Pastor López', 'Fruko y sus Tesos',
            'Aterciopelados', 'Bomba Estéreo', 'Monsieur Periné', 'Systema Solar', 'Herencia de Timbiquí',
            'Jorge Celedón', 'Pipe Bueno', 'Jessi Uribe', 'Yeison Jiménez', 'Darío Gómez',
            'El Rey del Despecho', 'La Pollera Colorá', 'Colombia Tierra Querida', 'Soy Colombiano', 'La Tierra del Olvido',
            // Nuevas (50+)
            'Rafael Orozco', 'Kaleth Morales', 'Patricia Teherán', 'Los Inquietos', 'Los Gigantes',
            'Otto Serge', 'Poncho Zuleta', 'Iván Villazón', 'Peter Manjarrés', 'Martín Elías',
            'Ryan Castro', 'Feid', 'Blessd', 'Manuel Turizo', 'Piso 21',
            'Morat', 'ChocQuibTown', 'Goyo', 'Tostao', 'Slow Mike',
            'Alci Acosta', 'Julio Jaramillo', 'Olimpo Cárdenas', 'Helenita Vargas', 'Galy Galiano',
            'Jhonny Rivera', 'Paola Jara', 'Francy', 'Arelys Henao', 'Jimmy Gutiérrez',
            'Luis Alberto Posada', 'Charrito Negro', 'Alzate', 'Giovanny Ayala', 'Uriel Henao',
            'La Cucharita', 'El Sanjuanero', 'Yo Me Llamo Cumbia', 'La Piragua', 'El Pescador',
            'Prende la Vela', 'Carmen de Bolívar', 'Pueblito Viejo', 'Espumas', 'Antioqueñita',
            'Las Acacias', 'Los Guaduales', 'Obsesión', 'Tarde lo Conocí', 'Hoja en Blanco'
        ]
    },
    {
        id: 'col_tv',
        title: '📺 Farándula Criolla',
        description: 'Novelas, reinas y personajes.',
        icon: '📺',
        color: '#FF1744', // Red
        difficulty: 'Fácil' as const,
        image: require('../../assets/Tv.png'),
        words: [
            'Betty la Fea', 'Pedro el Escamoso', 'Epa Colombia', 'Amparo Grisales', 'Sofía Vergara',
            'Don Armando', 'La Pola', 'Café con Aroma de Mujer', 'Desafío',
            'Sábados Felices', 'Pirry', 'Jota Mario', 'Margarita Rosa de Francisco', 'Greeicy',
            'Lina Tejeiro', 'La Liendra', 'Yina Calderón', 'Aida Victoria', 'Esperanza Gómez',
            'Elif', 'Pasión de Gavilanes', 'La Hija del Mariachi', 'Los Reyes', 'Padres e Hijos',
            'Cuentos de los Hermanos Grimm', 'El Chavo (aunque no es de acá se ve mucho)', 'Jorge Barón', 'Show de las Estrellas', 'La Voz Colombia',
            'MasterChef', 'Claudia Bahamón', 'Gregorio Pernía', 'Robinson Díaz', 'Julián Román',
            'Catherine Siachoque', 'Aura Cristina Geithner', 'Endry Cardeño',
            // Nuevas (50+)
            'Cabal y Farah', 'Totono Grisales',
            'La Vendedora de Rosas', 'Lady Tabares', 'Natalia París', 'Ana Sofía Henao', 'Taliana Vargas',
            'Paulina Vega', 'Ariadna Gutiérrez', 'Andrea Serna', 'Carolina Cruz', 'Jessica Cediel',
            'Laura Acuña', 'Vicky Dávila', 'Juan Diego Alvira', 'Séptimo Día', 'El Rastro',
            'Profesor Super O', 'Tal Cual', 'Frailejón Ernesto Pérez', 'Aurelio Cheveroni', 'Club 10',
            'Buki', 'Mary Méndez', 'Carlos Calero', 'Agmeth Escaf', 'La Gorda Fabiola',
            'Polilla', 'Don Jediondo', 'Mandíbula', 'Alerta', 'Hassam',
            'Suso el Paspi', 'Lokillo', 'Piter Albeiro', 'Camilo Cifuentes', 'Vargasvil',
            'Escobar el Patrón del Mal', 'Sin Tetas no hay Paraíso', 'El Capo', 'La Reina del Flow', 'Hasta que la plata nos separe'
        ]
    },
    {
        id: 'col_sports',
        title: '⚽ Pasión Tricolor',
        description: 'Nuestra gloria deportiva.',
        icon: '⚽',
        color: '#FFEA00', // Yellow
        difficulty: 'Medio' as const,
        image: require('../../assets/Deportes.png'),
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
        title: '🗺️ Pueblos y Ciudades',
        description: 'De norte a sur, de oriente a occidente.',
        icon: '🗺️',
        color: '#00E676', // Green
        difficulty: 'Medio' as const,
        image: require('../../assets/Pueblitos.png'),
        words: [
            'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla',
            'Guatapé', 'Salento', 'Villa de Leyva', 'Santa Marta', 'San Andrés',
            'Leticia', 'Pasto', 'Manizales', 'Popayán', 'Bucaramanga',
            'Caño Cristales', 'Desierto de la Tatacoa', 'Parque Tayrona', 'Monserrate', 'Piedra del Peñol',
            'Ciudad Perdida', 'Santuario de las Lajas', 'Valle del Cocora', 'Catedral de Sal', 'Laguna de Guatavita',
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
        title: '🗣️ Dichos y Refranes',
        description: 'Para que hable como es.',
        icon: '🗣️',
        color: '#AA00FF', // Purple
        difficulty: 'Difícil' as const,
        image: require('../../assets/Dichos-refranes.png'),
        words: [
            'No de papaya', 'Camello', 'Guayabo', 'Polas', 'Parcero',
            'Chimba', 'Vaca', 'Hacer vaca', 'Echar los perros', 'Mamando gallo',
            'Se le tiene', 'Pailas', 'Ñapa', 'Chicharrón', 'Mecato',
            'Tengo filo', 'Berraco', 'Hágale', '¡Quiubo!', 'Su merced',
            'Dar lora', 'Echar gafa', 'Mamar ron', 'Tirarse el paso', 'Hacerse el loco',
            'Ponerse las pilas', 'Sacar la piedra', 'Tener huevo', 'Ser un sapo', 'Estar moscas',
            'Comer cuento', 'Armar la gorda', 'Caer gordo', 'Parar bolas', 'Tomar del pelo',
            'A otro perro con ese hueso', 'Salió de guatemala a guatepeor', 'No me abra los ojos', 'Me importa un comino', 'Se le mojó la canoa',
            'Cójala suave', 'Frens', 'Severo', 'Visaje', 'Boleta',
            'Chanda', 'Enguayabado', 'Jincho', 'Prendido', 'Entonado',
            // Nuevas (50+)
            'Pilas pues', 'Juepucha (sin ofender)', 'Despistado', 'Compadre', 'Habla carretas',
            'Qué vaina', 'Carachas', 'Eche', 'No friegue', 'Ajá',
            'Cógela con su avena y su pitillo', 'El que tiene tienda que la atienda', 'Mugen, no te vistas que no vas', 'Soldado avisado no muere en guerra', 'A caballo regalado no se le mira el diente',
            'Más vale pájaro en mano', 'Dios le da pan al que no tiene dientes', 'En casa de herrero azadón de palo', 'Matar dos pájaros de un tiro', 'Camarón que se duerme',
            'Barriga llena corazón contento', 'Cría cuervos y te sacarán los ojos', 'Dime con quién andas', 'El que busca encuentra', 'El que peca y reza empata',
            'Hierba mala nunca muere', 'Loros viejos no aprenden a hablar', 'Más sabe el diablo por viejo', 'Ojos que no ven', 'Perro que ladra no muerde',
            'Al que le van a dar le guardan', 'Amanecerá y veremos', 'Cada loco con su tema', 'De eso tan bueno no dan tanto', 'El que mucho abarca poco aprieta',
            'Hijo de tigre sale pintado', 'La ropa sucia se lava en casa', 'Lo barato sale caro', 'Mal de muchos consuelo de tontos', 'Más vale tarde que nunca',
            'No hay mal que por bien no venga', 'Ojo por ojo', 'Papelito habla', 'Quien tiene boca se equivoca', 'Sarna con gusto no pica',
            'Tanto va el cántaro al agua', 'Una golondrina no hace verano', 'Zapatero a tus zapatos', 'Tener la sartén por el mango', 'Estar en la olla'
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
export const ARCHIVED_WORDS_NSFW = {
    tv_novelas_narcos: [
        'Escobar el Patrón del Mal',
        'Sin Tetas no hay Paraíso',
        'El Capo',
        'La Reina del Sur',
        'El Cartel de los Sapos'
    ],
    dichos_vulgares: [
        'Me importa un culo',
        'Pirobo',
        'Gonorrea',
        'Marica',
        'Sopla mondá',
        'Cule vaina',
        'Erda',
        'No joda',
        'Malparido',
        'Carechimba'
    ]
};

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
