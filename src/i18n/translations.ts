export const translations = {
    es: {
        // App
        loading: "Cargando...",

        // Category Selection
        choose_theme: "Elige tu Tema",
        create_new: "Crear Nueva Charada",
        create_desc: "Haz tu propio juego personalizado",
        delete_category: "Eliminar Categoría",
        delete_confirm: "¿Estás seguro de que quieres borrar \"{0}\"?",
        cancel: "Cancelar",
        delete: "Eliminar",

        // Word Preview
        memorize: "Memoriza las palabras... ¡El juego inicia en {0}s!",
        game_duration: "Duración de la partida:",
        words_round: "Palabras en esta ronda:",
        no_words: "No hay palabras disponibles para esta categoría.",
        shuffle: "🔄 Barajar",
        start: "▶️ ¡Empezar ({0}s)!",

        // Game
        prepare: "¡Prepárate!",
        instruction_forehead: "Ponte el cel en la frente",
        instruction_tilt: "Abajo: ¡Eso! / Arriba: Paso",
        instruction_neutral: "Vuelve al centro",
        lets_go: "¡Hágale!",
        exit: "Salir",
        saving: "Guardando...",
        processing_video: "Procesando video de recuerdo 🎥",

        // Settings
        settings: "Ajustes",
        language: "Idioma",
        back: "Volver",
        music: "Música de Fondo",
        sound_effects: "Efectos de Sonido",
        vibration: "Vibración",
        music_in_video: "Grabar música en video",
        volume_music: "Volumen Música",
        volume_sfx: "Volumen Efectos",
        music_picker_title: "Seleccionar Música",
        pick_local_file: "📂 Abrir mis archivos...",
        default_tracks: "Canciones incluidas",
        no_music: "Silencio total",
        on: "Activado",
        off: "Desactivado",

        // Create Category (Partial)
        create_header: "Crear Categoría",
        missing_data: "Faltan datos",
        missing_data_desc: "Por favor completa todos los campos.",
        few_words: "Muy pocas palabras",
        few_words_desc: "Agrega al menos 5 palabras para que el juego sea divertido.",
        success: "¡Éxito!",
        success_desc: "Categoría creada correctamente.",
        error: "Error",
        error_desc: "No se pudo guardar la categoría.",

        // Results (assuming generic keys based on typical results screens)
        results: "Resultados",
        score: "Puntuación",
        video_saved: "Video guardado en galería",
        share: "Compartir",
        home: "Inicio",
        play_again: "Jugar de nuevo"
    },
    en: {
        // App
        loading: "Loading...",

        // Category Selection
        choose_theme: "Choose your Theme",
        create_new: "Create New Charade",
        create_desc: "Make your own custom game",
        delete_category: "Delete Category",
        delete_confirm: "Are you sure you want to delete \"{0}\"?",
        cancel: "Cancel",
        delete: "Delete",

        // Word Preview
        memorize: "Memorize the words... Game starts in {0}s!",
        game_duration: "Game Duration:",
        words_round: "Words in this round:",
        no_words: "No words available for this category.",
        shuffle: "🔄 Shuffle",
        start: "▶️ Start ({0}s)!",

        // Game
        prepare: "Get Ready!",
        instruction_forehead: "Place phone on forehead",
        instruction_tilt: "Down: Correct! / Up: Pass",
        instruction_neutral: "Return to center",
        lets_go: "Let's go!",
        exit: "Exit",
        saving: "Saving...",
        processing_video: "Processing memory video 🎥",

        // Settings
        settings: "Settings",
        language: "Language",
        back: "Back",
        music: "Background Music",
        sound_effects: "Sound Effects",
        vibration: "Vibration",
        music_in_video: "Include music in video",
        volume_music: "Music Volume",
        volume_sfx: "SFX Volume",
        music_picker_title: "Select Music",
        pick_local_file: "📂 Pick local file...",
        default_tracks: "Included songs",
        no_music: "Silence",
        on: "On",
        off: "Off",

        // Create Category
        create_header: "Create Category",
        missing_data: "Missing Data",
        missing_data_desc: "Please complete all fields.",
        few_words: "Too few words",
        few_words_desc: "Add at least 5 words to make it fun.",
        success: "Success!",
        success_desc: "Category created successfully.",
        error: "Error",
        error_desc: "Could not save category.",

        // Results
        results: "Results",
        score: "Score",
        video_saved: "Video saved to gallery",
        share: "Share",
        home: "Home",
        play_again: "Play Again"
    }
};

export type Language = 'es' | 'en';
export type TranslationKey = keyof typeof translations.es;
