export interface Category {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    words: string[];
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    isCustom?: boolean;
}

export const CATEGORIES: Category[] = [
    {
        id: 'col_general',
        title: '🇨🇴 De la Tierrita',
        description: 'Cosas que todo colombiano conoce.',
        icon: '🇨🇴',
        color: '#FFD700', // Amarillo
        difficulty: 'Fácil',
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
            'Carriel', 'Poncho', 'Orquídea', 'Palma de Cera', 'Cóndor'
        ]
    },
    {
        id: 'col_music',
        title: '🎵 Parranda Santa',
        description: 'Desde Vallenato hasta lo urbano.',
        icon: '🎵',
        color: '#00D4FF', // Cyan
        difficulty: 'Medio',
        words: [
            'Carlos Vives', 'Shakira', 'J Balvin', 'Karol G', 'Juanes',
            'Joe Arroyo', 'Diomedes Díaz', 'Maluma', 'Grupo Niche', 'Binomio de Oro',
            'La Gota Fría', 'Cali Pachanguero', 'La Bicicleta', 'El Preso', 'Fruta Fresca',
            'Celia Cruz', 'Choquibtown', 'Fonseca', 'Silvestre Dangond', 'Cumbiana',
            'Sebastián Yatra', 'Camilo', 'Andrés Cepeda', 'Totó la Momposina', 'Petrona Martínez',
            'Lisandro Meza', 'Rodolfo Aicardi', 'Los Hispanos', 'Pastor López', 'Fruko y sus Tesos',
            'Aterciopelados', 'Bomba Estéreo', 'Monsieur Periné', 'Systema Solar', 'Herencia de Timbiquí',
            'Jorge Celedón', 'Pipe Bueno', 'Jessi Uribe', 'Yeison Jiménez', 'Darío Gómez',
            'El Rey del Despecho', 'La Pollera Colorá', 'Colombia Tierra Querida', 'Soy Colombiano', 'La Tierra del Olvido'
        ]
    },
    {
        id: 'col_tv',
        title: '📺 Farándula Criolla',
        description: 'Novelas, reinas y personajes.',
        icon: '📺',
        color: '#FF1744', // Red
        difficulty: 'Fácil',
        words: [
            'Betty la Fea', 'Pedro el Escamoso', 'Epa Colombia', 'Amparo Grisales', 'El Pibe Valderrama',
            'Sofía Vergara', 'James Rodríguez', 'Falcao', 'Rigoberto Urán', 'Nairo Quintana',
            'Don Armando', 'La Pola', 'El Tino Asprilla', 'Café con Aroma de Mujer', 'Desafío',
            'Sábados Felices', 'Pirry', 'Jota Mario', 'Margarita Rosa de Francisco', 'Greeicy',
            'Lina Tejeiro', 'La Liendra', 'Yina Calderón', 'Aida Victoria', 'Esperanza Gómez',
            'Elif', 'Pasión de Gavilanes', 'La Hija del Mariachi', 'Los Reyes', 'Padres e Hijos',
            'Cuentos de los Hermanos Grimm', 'El Chavo (aunque no es de acá se ve mucho)', 'Jorge Barón', 'Show de las Estrellas', 'La Voz Colombia',
            'MasterChef', 'Claudia Bahamón', 'Gregorio Pernía', 'Robinson Díaz', 'Julián Román',
            'Catherine Siachoque', 'Aura Cristina Geithner', 'Endry Cardeño', 'Lucho Díaz', 'Mariana Pajón'
        ]
    },
    {
        id: 'col_geo',
        title: '🗺️ Pueblos y Ciudades',
        description: 'De norte a sur, de oriente a occidente.',
        icon: '🗺️',
        color: '#00E676', // Green
        difficulty: 'Medio',
        words: [
            'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla',
            'Guatapé', 'Salento', 'Villa de Leyva', 'Santa Marta', 'San Andrés',
            'Leticia', 'Pasto', 'Manizales', 'Popayán', 'Bucaramanga',
            'Caño Cristales', 'Desierto de la Tatacoa', 'Parque Tayrona', 'Monserrate', 'Piedra del Peñol',
            'Ciudad Perdida', 'Santuario de las Lajas', 'Valle del Cocora', 'Catedral de Sal', 'Laguna de Guatavita',
            'Barichara', 'Mompox', 'Jardín (Antioquia)', 'Filandia', 'Monguí',
            'Isla Gorgona', 'Cabo de la Vela', 'Punta Gallinas', 'Parque de los Nevados', 'Volcán Totumo',
            'Chocó', 'Nuquí', 'Bahía Solano', 'Amazonas', 'Llanos Orientales',
            'Río Magdalena', 'Río Cauca', 'Nevado del Ruiz', 'Sierra Nevada', 'Chicamocha'
        ]
    },
    {
        id: 'col_sayings',
        title: '🗣️ Dichos y Refranes',
        description: 'Para que hable como es.',
        icon: '🗣️',
        color: '#AA00FF', // Purple
        difficulty: 'Difícil',
        words: [
            'No de papaya', 'Camello', 'Guayabo', 'Polas', 'Parcero',
            'Chimba', 'Vaca', 'Hacer vaca', 'Echar los perros', 'Mamando gallo',
            'Se le tiene', 'Pailas', 'Ñapa', 'Chicharrón', 'Mecato',
            'Tengo filo', 'Berraco', 'Hágale', '¡Quiubo!', 'Su merced',
            'Dar lora', 'Echar gafa', 'Mamar ron', 'Tirarse el paso', 'Hacerse el loco',
            'Ponerse las pilas', 'Sacar la piedra', 'Tener huevo', 'Ser un sapo', 'Estar moscas',
            'Comer cuento', 'Armar la gorda', 'Caer gordo', 'Parar bolas', 'Tomar del pelo',
            'A otro perro con ese hueso', 'Salió de guatemala a guatepeor', 'No me abra los ojos', 'Me importa un culo', 'Se le mojó la canoa',
            'Cójala suave', 'Frens', 'Severo', 'Visaje', 'Boleta',
            'Chanda', 'Enguayabado', 'Jincho', 'Prendido', 'Entonado'
        ]
    }
];
