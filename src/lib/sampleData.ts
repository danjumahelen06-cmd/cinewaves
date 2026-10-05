import { Movie, TVShow } from '../types';

// Legal demo video streams (Creative Commons / Open Movie projects)
export const DEMO_VIDEOS = {
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephantDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  weAreGoingOnBullrun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  forBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  forBiggerEscapes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  forBiggerFun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  forBiggerJoyrides: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
};

// Generates an ultra-crisp, cinematic SVG data URL with mood-appropriate gradient, typography & framing
export function generateCinematicPoster(
  title: string,
  genre: string,
  year: number,
  primaryColor = '#3b82f6',
  secondaryColor = '#9333ea',
  badgeText = '4K ULTRA HD'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#07090e" />
        <stop offset="40%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020408" />
      </linearGradient>
      <linearGradient id="glow" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.55" />
        <stop offset="50%" stop-color="${secondaryColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
      </linearGradient>
      <radialGradient id="spotlight" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.4" />
        <stop offset="100%" stop-color="transparent" stop-opacity="0" />
      </radialGradient>
      <filter id="cinematic-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="60" />
      </filter>
    </defs>
    
    <!-- Background Base -->
    <rect width="600" height="900" fill="url(#bg)" />
    
    <!-- Atmospheric Glows -->
    <circle cx="300" cy="280" r="240" fill="${primaryColor}" opacity="0.3" filter="url(#cinematic-blur)" />
    <circle cx="450" cy="500" r="200" fill="${secondaryColor}" opacity="0.25" filter="url(#cinematic-blur)" />
    <rect width="600" height="900" fill="url(#spotlight)" />

    <!-- Cinema Art Texture Lines -->
    <g opacity="0.15" stroke="#ffffff" stroke-width="1">
      <circle cx="300" cy="380" r="180" fill="none" stroke-dasharray="6,6" />
      <circle cx="300" cy="380" r="260" fill="none" stroke-opacity="0.4" />
      <line x1="60" y1="380" x2="540" y2="380" stroke-opacity="0.3" />
      <line x1="300" y1="140" x2="300" y2="620" stroke-opacity="0.3" />
    </g>

    <!-- Cinematic Vignette / Bottom Scrim -->
    <rect width="600" height="900" fill="url(#glow)" />
    <rect y="450" width="600" height="450" fill="black" opacity="0.75" />

    <!-- Top Tagline & Format Badge -->
    <text x="50" y="70" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#06b6d4">CINEWAVE ORIGINAL</text>
    <rect x="440" y="52" width="110" height="24" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="495" y="68" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" letter-spacing="1" fill="#94a3b8" text-anchor="middle">${badgeText}</text>

    <!-- Genre & Year Header -->
    <text x="50" y="660" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="#38bdf8" text-transform="uppercase">${genre} · ${year}</text>

    <!-- Main Title -->
    <text x="50" y="720" font-family="'Outfit', sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-1">
      ${title.length > 18 ? title.slice(0, 18) + '...' : title}
    </text>

    <!-- Decorative Accent Bar -->
    <rect x="50" y="745" width="60" height="4" rx="2" fill="${primaryColor}" />

    <!-- Subtitle / Cinematic Tag -->
    <text x="50" y="785" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="400" fill="#94a3b8">Directed by World-Class Creators</text>
    <text x="50" y="810" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#64748b" letter-spacing="1">DOLBY VISION · DOLBY ATMOS · 5.1</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateCinematicBackdrop(
  title: string,
  tagline: string,
  primaryColor = '#0284c7',
  secondaryColor = '#7c3aed'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#05070b" />
        <stop offset="50%" stop-color="#0c121e" />
        <stop offset="100%" stop-color="#030407" />
      </linearGradient>
      <radialGradient id="nebula1" cx="65%" cy="35%" r="50%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.5" />
        <stop offset="60%" stop-color="${secondaryColor}" stop-opacity="0.2" />
        <stop offset="100%" stop-color="transparent" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="nebula2" cx="30%" cy="60%" r="40%">
        <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="transparent" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" />
        <stop offset="60%" stop-color="#080a0f" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#080a0f" />
      </linearGradient>
      <linearGradient id="leftFade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#080a0f" stop-opacity="0.95" />
        <stop offset="45%" stop-color="#080a0f" stop-opacity="0.6" />
        <stop offset="100%" stop-color="transparent" />
      </linearGradient>
    </defs>

    <rect width="1920" height="1080" fill="url(#bg)" />
    <rect width="1920" height="1080" fill="url(#nebula1)" />
    <rect width="1920" height="1080" fill="url(#nebula2)" />

    <!-- Ambient Geometric Cinematic Rings -->
    <g opacity="0.12" stroke="#ffffff" stroke-width="1.5">
      <circle cx="1250" cy="450" r="420" fill="none" />
      <circle cx="1250" cy="450" r="300" stroke-dasharray="12,12" fill="none" />
      <line x1="800" y1="450" x2="1700" y2="450" stroke-opacity="0.4" />
    </g>

    <!-- Gradients for Text Legibility -->
    <rect width="1920" height="1080" fill="url(#leftFade)" />
    <rect width="1920" height="1080" fill="url(#bottomFade)" />

    <!-- Title and Atmospheric Subtle Watermark in Background -->
    <text x="1820" y="980" text-anchor="end" font-family="'Outfit', sans-serif" font-size="28" font-weight="700" fill="#334155" opacity="0.4">CINEWAVE STUDIOS</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Chronicles of Aetheria',
    description:
      'In a distant galaxy where gravity is controlled by ancient crystalline relics, a renegade astro-engineer must navigate an interstellar armada to prevent the collapse of the jump gate network.',
    poster_url: generateCinematicPoster('Chronicles of Aetheria', 'Sci-Fi · Adventure', 2026, '#06b6d4', '#6366f1'),
    backdrop_url: generateCinematicBackdrop('Chronicles of Aetheria', 'Beyond the edge of known physics lies destiny.', '#0284c7', '#4f46e5'),
    video_url: DEMO_VIDEOS.tearsOfSteel,
    trailer_url: DEMO_VIDEOS.tearsOfSteel,
    release_year: 2026,
    runtime: 148,
    rating: 9.1,
    genre: 'Sci-Fi',
    type: 'movie',
    director: 'Evelyn Vance',
    cast_members: 'Marcus Reed, Lyra Sterling, Kaelen Voss, Elena Rossi',
    featured: true,
  },
  {
    id: 'm2',
    title: 'Neon Horizon: 2099',
    description:
      'A disgraced cyber-detective uncovers a consciousness transfer conspiracy that links the neon penthouses of New Tokyo to the perilous flooded slums of the lower tiers.',
    poster_url: generateCinematicPoster('Neon Horizon', 'Cyberpunk · Thriller', 2025, '#ec4899', '#8b5cf6'),
    backdrop_url: generateCinematicBackdrop('Neon Horizon', 'Memory is the ultimate contraband.', '#db2777', '#7c3aed'),
    video_url: DEMO_VIDEOS.forBiggerEscapes,
    trailer_url: DEMO_VIDEOS.forBiggerEscapes,
    release_year: 2025,
    runtime: 132,
    rating: 8.7,
    genre: 'Thriller',
    type: 'movie',
    director: 'Kenji Takahashi',
    cast_members: 'Daisuke Sato, Mia Thorne, Julian Alvarez, Chloe Chen',
    featured: true,
  },
  {
    id: 'm3',
    title: 'The Quantum Paradox',
    description:
      'When an experimental deep-space warp test creates localized temporal splintering, four research scientists must decide which timeline deserves to survive before reality unravels.',
    poster_url: generateCinematicPoster('The Quantum Paradox', 'Sci-Fi · Drama', 2026, '#3b82f6', '#06b6d4'),
    backdrop_url: generateCinematicBackdrop('The Quantum Paradox', 'Every choice creates a world.', '#2563eb', '#0891b2'),
    video_url: DEMO_VIDEOS.sintel,
    trailer_url: DEMO_VIDEOS.sintel,
    release_year: 2026,
    runtime: 154,
    rating: 8.9,
    genre: 'Sci-Fi',
    type: 'movie',
    director: 'Jonathan Mercer',
    cast_members: 'Claire Dupont, Ronald Hayes, Ananya Patel, Simon Drake',
    featured: true,
  },
  {
    id: 'm4',
    title: 'Echoes of the Deep',
    description:
      'At 11,000 meters beneath the Marianas, a deep-sea drilling expedition breaches an oceanic trench sealing an ancient bioluminescent biosphere that has its own defensive intelligence.',
    poster_url: generateCinematicPoster('Echoes of the Deep', 'Horror · Mystery', 2024, '#10b981', '#0284c7'),
    backdrop_url: generateCinematicBackdrop('Echoes of the Deep', 'Some depths should remain in silence.', '#059669', '#0369a1'),
    video_url: DEMO_VIDEOS.forBiggerBlazes,
    trailer_url: DEMO_VIDEOS.forBiggerBlazes,
    release_year: 2024,
    runtime: 118,
    rating: 8.4,
    genre: 'Horror',
    type: 'movie',
    director: 'Guillermo Ortiz',
    cast_members: 'Sarah Jenkins, Dominic Cruz, Mateo Lindqvist',
    featured: false,
  },
  {
    id: 'm5',
    title: 'Solaris Drift',
    description:
      'A solitary pilot guiding an automated cargo vessel between Mars and the Asteroid Belt receives a distress signal from a spacecraft recorded missing forty years ago.',
    poster_url: generateCinematicPoster('Solaris Drift', 'Sci-Fi · Suspense', 2025, '#f59e0b', '#ef4444'),
    backdrop_url: generateCinematicBackdrop('Solaris Drift', 'The void keeps every secret.', '#d97706', '#dc2626'),
    video_url: DEMO_VIDEOS.weAreGoingOnBullrun,
    trailer_url: DEMO_VIDEOS.weAreGoingOnBullrun,
    release_year: 2025,
    runtime: 126,
    rating: 8.6,
    genre: 'Sci-Fi',
    type: 'movie',
    director: 'Ariana Holm',
    cast_members: 'Ethan Cross, Vera Kingsley, Michael O’Connor',
    featured: true,
  },
  {
    id: 'm6',
    title: 'The Silent Archive',
    description:
      'In a future where historical documents are destroyed to rewrite corporate ancestry, an underground guild of bibliophiles risks capital sentencing to preserve forbidden literature.',
    poster_url: generateCinematicPoster('The Silent Archive', 'Drama · Mystery', 2024, '#8b5cf6', '#64748b'),
    backdrop_url: generateCinematicBackdrop('The Silent Archive', 'Truth is immortalized in ink.', '#7c3aed', '#475569'),
    video_url: DEMO_VIDEOS.bigBuckBunny,
    trailer_url: DEMO_VIDEOS.bigBuckBunny,
    release_year: 2024,
    runtime: 139,
    rating: 8.8,
    genre: 'Drama',
    type: 'movie',
    director: 'Sophie Laurent',
    cast_members: 'Gabriel Rousseau, Astrid Lind, Timothy Thorne',
    featured: false,
  },
  {
    id: 'm7',
    title: 'Cipher Protocol',
    description:
      'An elite counter-intelligence agent is framed for an AI breach that crippled global financial markets. Racing across Zurich, Berlin, and Singapore, she has 48 hours to clear her name.',
    poster_url: generateCinematicPoster('Cipher Protocol', 'Action · Thriller', 2025, '#ef4444', '#f97316'),
    backdrop_url: generateCinematicBackdrop('Cipher Protocol', 'Trust nobody. Verify everything.', '#dc2626', '#ea580c'),
    video_url: DEMO_VIDEOS.forBiggerFun,
    trailer_url: DEMO_VIDEOS.forBiggerFun,
    release_year: 2025,
    runtime: 122,
    rating: 8.5,
    genre: 'Action',
    type: 'movie',
    director: 'Chadwick Sterling',
    cast_members: 'Natasha Roman, Eric Holt, David Zhao, Jessica Bell',
    featured: false,
  },
  {
    id: 'm8',
    title: 'Velvet Mirage',
    description:
      'Set against the golden era of 1950s Monaco, an audacious high-society art heist turns into a dangerous game of cat-and-mouse between an enigmatic countess and an Interpol inspector.',
    poster_url: generateCinematicPoster('Velvet Mirage', 'Romance · Crime', 2023, '#ec4899', '#f43f5e'),
    backdrop_url: generateCinematicBackdrop('Velvet Mirage', 'A masterclass in deception and desire.', '#be185d', '#e11d48'),
    video_url: DEMO_VIDEOS.forBiggerJoyrides,
    trailer_url: DEMO_VIDEOS.forBiggerJoyrides,
    release_year: 2023,
    runtime: 114,
    rating: 8.1,
    genre: 'Romance',
    type: 'movie',
    director: 'Camille Moreau',
    cast_members: 'Helena Beaumont, Julien Cassel, Victor Hugo V',
    featured: false,
  },
  {
    id: 'm9',
    title: 'The Last Vanguard',
    description:
      'After planetary defenses fall to an unknown cosmic entity, the survivors aboard Earth’s final orbital battlestation stage a desperate counteroffensive.',
    poster_url: generateCinematicPoster('The Last Vanguard', 'Action · Sci-Fi', 2026, '#38bdf8', '#ef4444'),
    backdrop_url: generateCinematicBackdrop('The Last Vanguard', 'Stand together or fall in the dark.', '#0284c7', '#b91c1c'),
    video_url: DEMO_VIDEOS.tearsOfSteel,
    trailer_url: DEMO_VIDEOS.tearsOfSteel,
    release_year: 2026,
    runtime: 142,
    rating: 8.8,
    genre: 'Action',
    type: 'movie',
    director: 'Jack Callahan',
    cast_members: 'Brett Harrison, Sienna Cole, Lucas Kim',
    featured: false,
  },
  {
    id: 'm10',
    title: 'Shadows of Olympus',
    description:
      'An epic historical drama following the political intrigues, military campaigns, and philosophical betrayals within Alexander’s fractured court following his sudden death.',
    poster_url: generateCinematicPoster('Shadows of Olympus', 'Drama · History', 2024, '#eab308', '#d97706'),
    backdrop_url: generateCinematicBackdrop('Shadows of Olympus', 'Empires rise and men turn to dust.', '#ca8a04', '#b45309'),
    video_url: DEMO_VIDEOS.elephantDream,
    trailer_url: DEMO_VIDEOS.elephantDream,
    release_year: 2024,
    runtime: 165,
    rating: 8.9,
    genre: 'Drama',
    type: 'movie',
    director: 'Nikolaos Drakos',
    cast_members: 'Alexander Petrov, Diana Prince, Kassandra Vane',
    featured: false,
  },
  {
    id: 'm11',
    title: 'Apex Protocol',
    description:
      'In a competitive global league of cybernetically enhanced extreme sports, a newcomer discovers that victory comes with a clandestine price paid to the megacorporation owners.',
    poster_url: generateCinematicPoster('Apex Protocol', 'Action · Sci-Fi', 2025, '#06b6d4', '#10b981'),
    backdrop_url: generateCinematicBackdrop('Apex Protocol', 'Speed is nothing without control.', '#0891b2', '#059669'),
    video_url: DEMO_VIDEOS.forBiggerEscapes,
    trailer_url: DEMO_VIDEOS.forBiggerEscapes,
    release_year: 2025,
    runtime: 110,
    rating: 8.2,
    genre: 'Action',
    type: 'movie',
    director: 'Renata Silva',
    cast_members: 'Liam O’Connor, Maya Lin, Zane Sterling',
    featured: false,
  },
  {
    id: 'm12',
    title: 'Starlight Boulevard',
    description:
      'Two aspiring jazz musicians in modern-day Chicago cross paths during an impromptu winter blizzard jam session, igniting a whirlwind romance that challenges their artistic ambition.',
    poster_url: generateCinematicPoster('Starlight Boulevard', 'Comedy · Romance', 2024, '#a855f7', '#ec4899'),
    backdrop_url: generateCinematicBackdrop('Starlight Boulevard', 'Music found them in the storm.', '#9333ea', '#db2777'),
    video_url: DEMO_VIDEOS.sintel,
    trailer_url: DEMO_VIDEOS.sintel,
    release_year: 2024,
    runtime: 116,
    rating: 8.3,
    genre: 'Comedy',
    type: 'movie',
    director: 'Damien Wilder',
    cast_members: 'Marcus Brooks, Zoe Saldana, Theo James',
    featured: false,
  },
  {
    id: 'm13',
    title: 'Chronos Rift',
    description:
      'A clockmaker in 1890s London stumbles upon a pocket watch capable of reversing time by six minutes, becoming the target of Victorian alchemists and Scotland Yard.',
    poster_url: generateCinematicPoster('Chronos Rift', 'Adventure · Fantasy', 2025, '#f59e0b', '#6366f1'),
    backdrop_url: generateCinematicBackdrop('Chronos Rift', 'Every tick writes destiny.', '#d97706', '#4f46e5'),
    video_url: DEMO_VIDEOS.weAreGoingOnBullrun,
    trailer_url: DEMO_VIDEOS.weAreGoingOnBullrun,
    release_year: 2025,
    runtime: 130,
    rating: 8.5,
    genre: 'Adventure',
    type: 'movie',
    director: 'Arthur Pendelton',
    cast_members: 'Hugh Danvers, Eleanor Callow, Giles Sterling',
    featured: false,
  },
  {
    id: 'm14',
    title: 'Subzero Horizon',
    description:
      'A climatology rescue team in the Arctic tundra fights catastrophic whiteout conditions to locate a downed international research aircraft carrying genetic samples.',
    poster_url: generateCinematicPoster('Subzero Horizon', 'Thriller · Adventure', 2025, '#38bdf8', '#0284c7'),
    backdrop_url: generateCinematicBackdrop('Subzero Horizon', 'Nature forgives no mistakes.', '#0ea5e9', '#0369a1'),
    video_url: DEMO_VIDEOS.forBiggerBlazes,
    trailer_url: DEMO_VIDEOS.forBiggerBlazes,
    release_year: 2025,
    runtime: 124,
    rating: 8.4,
    genre: 'Thriller',
    type: 'movie',
    director: 'Mikael Blomqvist',
    cast_members: 'Astrid Lindholm, Torsten Kjell, Ingrid Bergman II',
    featured: false,
  },
  {
    id: 'm15',
    title: 'The Laughing Machine',
    description:
      'When an eccentric tech visionary builds a sentient stand-up comedy android to heal societal anxiety, the machine goes rogue and starts roasting world leaders on live television.',
    poster_url: generateCinematicPoster('The Laughing Machine', 'Comedy · Sci-Fi', 2024, '#f43f5e', '#fbbf24'),
    backdrop_url: generateCinematicBackdrop('The Laughing Machine', 'Humor is humanity’s last firewall.', '#e11d48', '#f59e0b'),
    video_url: DEMO_VIDEOS.bigBuckBunny,
    trailer_url: DEMO_VIDEOS.bigBuckBunny,
    release_year: 2024,
    runtime: 104,
    rating: 7.9,
    genre: 'Comedy',
    type: 'movie',
    director: 'Judd Farrelly',
    cast_members: 'Seth Rogan, Kumail Nanjiani, Awkwafina',
    featured: false,
  },
  {
    id: 'm16',
    title: 'Wanderer of Dunes',
    description:
      'Across an endless post-apocalyptic sea of rust-colored sand, a cartographer and her domesticated cybernetic hawk search for the legendary oasis city of Zerzura.',
    poster_url: generateCinematicPoster('Wanderer of Dunes', 'Adventure · Sci-Fi', 2026, '#d97706', '#dc2626'),
    backdrop_url: generateCinematicBackdrop('Wanderer of Dunes', 'The dunes remember the ocean.', '#b45309', '#991b1b'),
    video_url: DEMO_VIDEOS.tearsOfSteel,
    trailer_url: DEMO_VIDEOS.tearsOfSteel,
    release_year: 2026,
    runtime: 137,
    rating: 8.8,
    genre: 'Adventure',
    type: 'movie',
    director: 'Layla Al-Mansoor',
    cast_members: 'Amira Tariq, Omar Farooq, Samuel West',
    featured: false,
  },
  {
    id: 'm17',
    title: 'Beyond the Lens: Planet Biospheres',
    description:
      'A breathtaking 4K documentary journey examining the most remote macro and microscopic ecosystems on Earth, from hydrothermal ocean vents to cloud forest canopies.',
    poster_url: generateCinematicPoster('Planet Biospheres', 'Documentary · Nature', 2025, '#10b981', '#3b82f6'),
    backdrop_url: generateCinematicBackdrop('Planet Biospheres', 'Witness our planet in unseen splendor.', '#059669', '#1d4ed8'),
    video_url: DEMO_VIDEOS.forBiggerJoyrides,
    trailer_url: DEMO_VIDEOS.forBiggerJoyrides,
    release_year: 2025,
    runtime: 98,
    rating: 9.3,
    genre: 'Documentary',
    type: 'movie',
    director: 'David Attenborough Tribute Guild',
    cast_members: 'Narrated by Sir James Sterling',
    featured: false,
  },
  {
    id: 'm18',
    title: 'The Silk Highway',
    description:
      'An investigative documentary delving into the high-stakes geopolitical corridors of ancient trade routes re-engineered for the modern global electric transit era.',
    poster_url: generateCinematicPoster('The Silk Highway', 'Documentary · Geopolitics', 2024, '#f59e0b', '#10b981'),
    backdrop_url: generateCinematicBackdrop('The Silk Highway', 'The arteries of modern commerce.', '#d97706', '#059669'),
    video_url: DEMO_VIDEOS.forBiggerFun,
    trailer_url: DEMO_VIDEOS.forBiggerFun,
    release_year: 2024,
    runtime: 102,
    rating: 8.6,
    genre: 'Documentary',
    type: 'movie',
    director: 'Mei-Ling Zhou',
    cast_members: 'Historians, Engineers & Transit Planners',
    featured: false,
  },
  {
    id: 'm19',
    title: 'Lumina: Flight of the Firebird',
    description:
      'In a mythical Slavic-inspired kingdom of perpetual autumn, a young apprentice glassblower must forge an enchanted lantern to restore warmth to the royal hearth.',
    poster_url: generateCinematicPoster('Lumina', 'Animation · Family', 2025, '#f97316', '#a855f7'),
    backdrop_url: generateCinematicBackdrop('Lumina', 'An enchanting animated fairy tale for all ages.', '#ea580c', '#9333ea'),
    video_url: DEMO_VIDEOS.sintel,
    trailer_url: DEMO_VIDEOS.sintel,
    release_year: 2025,
    runtime: 95,
    rating: 8.7,
    genre: 'Animation',
    type: 'movie',
    director: 'Klara Novakova',
    cast_members: 'Voices of Anya Taylor-Joy, Colin Farrell, Judi Dench',
    featured: false,
  },
  {
    id: 'm20',
    title: 'Cyber Heist: Berlin',
    description:
      'A ragtag group of white-hat hackers plan the ultimate zero-day infiltration into the world’s most secure biometric vault during the chaos of New Year’s Eve in Berlin.',
    poster_url: generateCinematicPoster('Cyber Heist: Berlin', 'Action · Crime', 2025, '#06b6d4', '#ec4899'),
    backdrop_url: generateCinematicBackdrop('Cyber Heist: Berlin', 'One breach changes everything.', '#0891b2', '#db2777'),
    video_url: DEMO_VIDEOS.forBiggerEscapes,
    trailer_url: DEMO_VIDEOS.forBiggerEscapes,
    release_year: 2025,
    runtime: 115,
    rating: 8.3,
    genre: 'Action',
    type: 'movie',
    director: 'Florian Henckel',
    cast_members: 'Daniel Brühl, Paula Beer, Max Riemelt',
    featured: false,
  },
  {
    id: 'm21',
    title: 'The Haunting of Blackwood Manor',
    description:
      'A restoration architect tasked with surveying an abandoned 18th-century estate in Scotland begins hearing audio resonances from events that transpired two hundred years ago.',
    poster_url: generateCinematicPoster('Blackwood Manor', 'Horror · Suspense', 2024, '#64748b', '#ef4444'),
    backdrop_url: generateCinematicBackdrop('Blackwood Manor', 'Walls have memory.', '#475569', '#dc2626'),
    video_url: DEMO_VIDEOS.forBiggerBlazes,
    trailer_url: DEMO_VIDEOS.forBiggerBlazes,
    release_year: 2024,
    runtime: 108,
    rating: 8.1,
    genre: 'Horror',
    type: 'movie',
    director: 'Robin Macleod',
    cast_members: 'Claire Foy, Paul Mescal, Brian Cox',
    featured: false,
  },
  {
    id: 'm22',
    title: 'Neon Odyssey: Return',
    description:
      'Following a twenty-year deep-sleep voyage across the Perseus Arm, a veteran explorer returns home only to discover that centuries have passed on Earth.',
    poster_url: generateCinematicPoster('Neon Odyssey', 'Sci-Fi · Epic', 2026, '#8b5cf6', '#06b6d4'),
    backdrop_url: generateCinematicBackdrop('Neon Odyssey', 'Time is the greatest ocean.', '#7c3aed', '#0891b2'),
    video_url: DEMO_VIDEOS.tearsOfSteel,
    trailer_url: DEMO_VIDEOS.tearsOfSteel,
    release_year: 2026,
    runtime: 158,
    rating: 9.0,
    genre: 'Sci-Fi',
    type: 'movie',
    director: 'Hiroshi Tanaka',
    cast_members: 'Ken Watanabe, Hiroyuki Sanada, Rinko Kikuchi',
    featured: true,
  },
];

export const INITIAL_TV_SHOWS: TVShow[] = [
  {
    id: 'tv1',
    title: 'Nexus Protocol',
    description:
      'In a hyper-connected metropolis where human memories are synced to a centralized neural cloud, a special investigations unit probes anomalies that corrupt the collective unconsciousness.',
    poster_url: generateCinematicPoster('Nexus Protocol', 'Sci-Fi · Drama', 2025, '#06b6d4', '#3b82f6'),
    backdrop_url: generateCinematicBackdrop('Nexus Protocol', 'Who controls what you remember?', '#0891b2', '#1d4ed8'),
    release_year: 2025,
    rating: 9.2,
    genre: 'Sci-Fi',
    type: 'tv',
    cast_members: 'Gillian Anderson, Sterling K. Brown, Hailee Steinfeld',
    featured: true,
    seasons: [
      {
        id: 's1-tv1',
        show_id: 'tv1',
        season_number: 1,
        title: 'Season 1: Sync Error',
        episodes: [
          {
            id: 'ep1-s1-tv1',
            season_id: 's1-tv1',
            episode_number: 1,
            title: 'Packet Loss',
            description: 'Detective Maya Ward investigates the sudden memory wipe of high-ranking diplomat in Sector 4.',
            thumbnail_url: generateCinematicBackdrop('Packet Loss', 'The investigation starts.', '#06b6d4', '#3b82f6'),
            video_url: DEMO_VIDEOS.tearsOfSteel,
            duration: 52,
          },
          {
            id: 'ep2-s1-tv1',
            season_id: 's1-tv1',
            episode_number: 2,
            title: 'Ghost In The Buffer',
            description: 'A rogue memory snippet leaks across millions of neural feeds simultaneously, inciting city-wide panic.',
            thumbnail_url: generateCinematicBackdrop('Ghost In The Buffer', 'Panic spreads.', '#3b82f6', '#8b5cf6'),
            video_url: DEMO_VIDEOS.forBiggerEscapes,
            duration: 48,
          },
          {
            id: 'ep3-s1-tv1',
            season_id: 's1-tv1',
            episode_number: 3,
            title: 'Zero-Day Genesis',
            description: 'The squad tracks the code signature back to a decommissioned submarine data bunker.',
            thumbnail_url: generateCinematicBackdrop('Zero-Day Genesis', 'Deep dive into the past.', '#8b5cf6', '#ec4899'),
            video_url: DEMO_VIDEOS.forBiggerBlazes,
            duration: 55,
          },
          {
            id: 'ep4-s1-tv1',
            season_id: 's1-tv1',
            episode_number: 4,
            title: 'The Architecture of Forgetting',
            description: 'Maya realizes her own childhood memories have been synthetically rewritten by the founders.',
            thumbnail_url: generateCinematicBackdrop('The Architecture', 'A shocking truth unfolds.', '#ec4899', '#06b6d4'),
            video_url: DEMO_VIDEOS.sintel,
            duration: 58,
          },
        ],
      },
      {
        id: 's2-tv1',
        show_id: 'tv1',
        season_number: 2,
        title: 'Season 2: Partition Collapse',
        episodes: [
          {
            id: 'ep1-s2-tv1',
            season_id: 's2-tv1',
            episode_number: 1,
            title: 'System Reboot',
            description: 'Six months after the shutdown, an encrypted shadow network emerges with underground nodes.',
            thumbnail_url: generateCinematicBackdrop('System Reboot', 'New world order.', '#06b6d4', '#10b981'),
            video_url: DEMO_VIDEOS.weAreGoingOnBullrun,
            duration: 50,
          },
          {
            id: 'ep2-s2-tv1',
            season_id: 's2-tv1',
            episode_number: 2,
            title: 'Hard Fork',
            description: 'Two factions battle over which memory baseline should be canonized into law.',
            thumbnail_url: generateCinematicBackdrop('Hard Fork', 'Faction wars begin.', '#10b981', '#f59e0b'),
            video_url: DEMO_VIDEOS.bigBuckBunny,
            duration: 53,
          },
        ],
      },
    ],
  },
  {
    id: 'tv2',
    title: 'Chronicles of the Red Planet',
    description:
      'Generations of terraformers on Mars grapple with environmental crises, corporate syndicates, and the psychological weight of creating a new cradle of civilization.',
    poster_url: generateCinematicPoster('Red Planet', 'Drama · Sci-Fi', 2024, '#ef4444', '#f97316'),
    backdrop_url: generateCinematicBackdrop('Red Planet', 'The frontier takes everything, but gives humanity a future.', '#dc2626', '#ea580c'),
    release_year: 2024,
    rating: 8.9,
    genre: 'Drama',
    type: 'tv',
    cast_members: 'Pedro Pascal, Carrie-Anne Moss, John Boyega',
    featured: true,
    seasons: [
      {
        id: 's1-tv2',
        show_id: 'tv2',
        season_number: 1,
        title: 'Season 1: Dust & Water',
        episodes: [
          {
            id: 'ep1-s1-tv2',
            season_id: 's1-tv2',
            episode_number: 1,
            title: 'Valles Marineris',
            description: 'The first atmospheric generator comes online, triggering unforeseen geothermal shockwaves.',
            thumbnail_url: generateCinematicBackdrop('Valles Marineris', 'Martian canyon sunrise.', '#ef4444', '#f97316'),
            video_url: DEMO_VIDEOS.forBiggerJoyrides,
            duration: 61,
          },
          {
            id: 'ep2-s1-tv2',
            season_id: 's1-tv2',
            episode_number: 2,
            title: 'The Ice Harvesters',
            description: 'A rebel transport crew refuses to deliver cryogenic water reserves to the wealthy domes.',
            thumbnail_url: generateCinematicBackdrop('The Ice Harvesters', 'Peril on frozen ridges.', '#f97316', '#eab308'),
            video_url: DEMO_VIDEOS.forBiggerFun,
            duration: 54,
          },
        ],
      },
    ],
  },
  {
    id: 'tv3',
    title: 'Shadow Agency',
    description:
      'A clandestine multilateral agency operating in the shadows between sovereign borders prevents global geopolitical disasters that never make the evening news.',
    poster_url: generateCinematicPoster('Shadow Agency', 'Thriller · Action', 2025, '#64748b', '#3b82f6'),
    backdrop_url: generateCinematicBackdrop('Shadow Agency', 'The war you never saw was won yesterday.', '#475569', '#2563eb'),
    release_year: 2025,
    rating: 8.8,
    genre: 'Thriller',
    type: 'tv',
    cast_members: 'Idris Elba, Rebecca Ferguson, Cillian Murphy',
    featured: true,
    seasons: [
      {
        id: 's1-tv3',
        show_id: 'tv3',
        season_number: 1,
        title: 'Season 1: Redacted',
        episodes: [
          {
            id: 'ep1-s1-tv3',
            season_id: 's1-tv3',
            episode_number: 1,
            title: 'Protocol Zero',
            description: 'A mole in Geneva leaks the location of six black sites simultaneously.',
            thumbnail_url: generateCinematicBackdrop('Protocol Zero', 'Geneva safehouse raid.', '#64748b', '#3b82f6'),
            video_url: DEMO_VIDEOS.tearsOfSteel,
            duration: 47,
          },
          {
            id: 'ep2-s1-tv3',
            season_id: 's1-tv3',
            episode_number: 2,
            title: 'Vienna Extraction',
            description: 'An operative must smuggle a key cryptographer out of Austria without diplomatic clearance.',
            thumbnail_url: generateCinematicBackdrop('Vienna Extraction', 'Midnight pursuit.', '#3b82f6', '#8b5cf6'),
            video_url: DEMO_VIDEOS.forBiggerEscapes,
            duration: 51,
          },
        ],
      },
    ],
  },
  {
    id: 'tv4',
    title: 'Arcane Realm',
    description:
      'In a renaissance world powered by volatile celestial alchemy, seven noble houses battle for stewardship of the Silver Throne while a forgotten horror awakens in the northern glaciers.',
    poster_url: generateCinematicPoster('Arcane Realm', 'Fantasy · Drama', 2024, '#a855f7', '#ec4899'),
    backdrop_url: generateCinematicBackdrop('Arcane Realm', 'Magic is not a gift, it is a debt.', '#9333ea', '#db2777'),
    release_year: 2024,
    rating: 9.0,
    genre: 'Drama',
    type: 'tv',
    cast_members: 'Henry Cavill, Eva Green, Charles Dance',
    featured: false,
    seasons: [
      {
        id: 's1-tv4',
        show_id: 'tv4',
        season_number: 1,
        title: 'Season 1: The Alchemist’s Gambit',
        episodes: [
          {
            id: 'ep1-s1-tv4',
            season_id: 's1-tv4',
            episode_number: 1,
            title: 'Fire in the Citadel',
            description: 'A royal coronation is interrupted by an arcane explosion.',
            thumbnail_url: generateCinematicBackdrop('Fire in Citadel', 'Royal feast turns dark.', '#a855f7', '#ec4899'),
            video_url: DEMO_VIDEOS.sintel,
            duration: 63,
          },
        ],
      },
    ],
  },
  {
    id: 'tv5',
    title: 'The Neon Syndicate',
    description:
      'Tokyo, 2088. Rival cybernetic Yakuza syndicates fight for supremacy over autonomous smuggling routes that thread through the subterranean megastructures.',
    poster_url: generateCinematicPoster('The Neon Syndicate', 'Action · Crime', 2025, '#ec4899', '#f43f5e'),
    backdrop_url: generateCinematicBackdrop('The Neon Syndicate', 'Honor is bought with high-voltage steel.', '#db2777', '#e11d48'),
    release_year: 2025,
    rating: 8.7,
    genre: 'Action',
    type: 'tv',
    cast_members: 'Hiroyuki Sanada, Rila Fukushima, Andrew Koji',
    featured: false,
    seasons: [
      {
        id: 's1-tv5',
        show_id: 'tv5',
        season_number: 1,
        title: 'Season 1: Voltage',
        episodes: [
          {
            id: 'ep1-s1-tv5',
            season_id: 's1-tv5',
            episode_number: 1,
            title: 'Chrome and Blood',
            description: 'A courier carrying an encrypted neural drive is ambushed in Shinjuku.',
            thumbnail_url: generateCinematicBackdrop('Chrome and Blood', 'Neon rain alleyway.', '#ec4899', '#f43f5e'),
            video_url: DEMO_VIDEOS.forBiggerEscapes,
            duration: 49,
          },
        ],
      },
    ],
  },
  {
    id: 'tv6',
    title: 'Cosmic Pioneers',
    description:
      'Following the first civilian generation born on an interstellar generational colony vessel traveling towards Proxima Centauri b over an eighty-year voyage.',
    poster_url: generateCinematicPoster('Cosmic Pioneers', 'Sci-Fi · Adventure', 2025, '#06b6d4', '#10b981'),
    backdrop_url: generateCinematicBackdrop('Cosmic Pioneers', 'Home is what we build between the stars.', '#0891b2', '#059669'),
    release_year: 2025,
    rating: 8.9,
    genre: 'Sci-Fi',
    type: 'tv',
    cast_members: 'Mahershala Ali, Florence Pugh, Steven Yeun',
    featured: false,
    seasons: [
      {
        id: 's1-tv6',
        show_id: 'tv6',
        season_number: 1,
        title: 'Season 1: Mid-Voyage',
        episodes: [
          {
            id: 'ep1-s1-tv6',
            season_id: 's1-tv6',
            episode_number: 1,
            title: 'Point of No Return',
            description: 'The ship passes beyond the solar system gravitational boundary, celebrating fifty years in flight.',
            thumbnail_url: generateCinematicBackdrop('Point of No Return', 'The observation dome.', '#06b6d4', '#10b981'),
            video_url: DEMO_VIDEOS.tearsOfSteel,
            duration: 56,
          },
        ],
      },
    ],
  },
  {
    id: 'tv7',
    title: 'Subterranean',
    description:
      'When global surface temperatures make daytime living impossible, human civilization moves into vast subterranean cave systems with strictly rationed geothermal power.',
    poster_url: generateCinematicPoster('Subterranean', 'Thriller · Drama', 2024, '#f59e0b', '#ef4444'),
    backdrop_url: generateCinematicBackdrop('Subterranean', 'Survival runs deep.', '#d97706', '#dc2626'),
    release_year: 2024,
    rating: 8.5,
    genre: 'Thriller',
    type: 'tv',
    cast_members: 'Elisabeth Moss, David Thewlis, Jessie Buckley',
    featured: false,
    seasons: [
      {
        id: 's1-tv7',
        show_id: 'tv7',
        season_number: 1,
        title: 'Season 1: Depth 400',
        episodes: [
          {
            id: 'ep1-s1-tv7',
            season_id: 's1-tv7',
            episode_number: 1,
            title: 'Airway Lock 7',
            description: 'A ventilation crisis forces an engineer into uncharted fissure tunnels.',
            thumbnail_url: generateCinematicBackdrop('Airway Lock 7', 'Descent into fissures.', '#f59e0b', '#ef4444'),
            video_url: DEMO_VIDEOS.forBiggerBlazes,
            duration: 46,
          },
        ],
      },
    ],
  },
  {
    id: 'tv8',
    title: 'Black Ice: Nordic Noir',
    description:
      'In a secluded mining town north of Tromsø, Norway, the thaw of an ancient glacier uncovers a sealed research container dating back to the height of the Cold War.',
    poster_url: generateCinematicPoster('Black Ice', 'Crime · Mystery', 2024, '#38bdf8', '#64748b'),
    backdrop_url: generateCinematicBackdrop('Black Ice', 'The cold preserves every truth.', '#0284c7', '#475569'),
    release_year: 2024,
    rating: 8.6,
    genre: 'Thriller',
    type: 'tv',
    cast_members: 'Jakob Oftebro, Sofia Helin, Mads Mikkelsen',
    featured: false,
    seasons: [
      {
        id: 's1-tv8',
        show_id: 'tv8',
        season_number: 1,
        title: 'Season 1: The Melt',
        episodes: [
          {
            id: 'ep1-s1-tv8',
            season_id: 's1-tv8',
            episode_number: 1,
            title: 'Frozen in 1962',
            description: 'Local sheriff Kari Nygård investigates the discovery of the cryogenic vault.',
            thumbnail_url: generateCinematicBackdrop('Frozen in 1962', 'Glacial expedition.', '#38bdf8', '#64748b'),
            video_url: DEMO_VIDEOS.weAreGoingOnBullrun,
            duration: 52,
          },
        ],
      },
    ],
  },
  {
    id: 'tv9',
    title: 'The Algorithm',
    description:
      'A satirical and biting drama about the eccentric billionaires, burned-out engineers, and rogue data brokers vying for control of the ultimate autonomous content engine.',
    poster_url: generateCinematicPoster('The Algorithm', 'Comedy · Drama', 2025, '#10b981', '#6366f1'),
    backdrop_url: generateCinematicBackdrop('The Algorithm', 'Feed the machine or become the content.', '#059669', '#4f46e5'),
    release_year: 2025,
    rating: 8.8,
    genre: 'Comedy',
    type: 'tv',
    cast_members: 'Nicholas Hoult, Ayo Edebiri, Kieran Culkin',
    featured: false,
    seasons: [
      {
        id: 's1-tv9',
        show_id: 'tv9',
        season_number: 1,
        title: 'Season 1: Engagement Score',
        episodes: [
          {
            id: 'ep1-s1-tv9',
            season_id: 's1-tv9',
            episode_number: 1,
            title: 'Viral Velocity',
            description: 'The team deploys a behavioral prediction model that predicts divorces before they happen.',
            thumbnail_url: generateCinematicBackdrop('Viral Velocity', 'Silicon Valley boardroom.', '#10b981', '#6366f1'),
            video_url: DEMO_VIDEOS.bigBuckBunny,
            duration: 44,
          },
        ],
      },
    ],
  },
  {
    id: 'tv10',
    title: 'Infinite Horizons',
    description:
      'A sweeping natural history series filmed over six years using drone swarm cinematography, capturing the planet’s greatest animal migrations across land, sea, and sky.',
    poster_url: generateCinematicPoster('Infinite Horizons', 'Documentary · Nature', 2024, '#06b6d4', '#eab308'),
    backdrop_url: generateCinematicBackdrop('Infinite Horizons', 'Earth as never witnessed before.', '#0891b2', '#ca8a04'),
    release_year: 2024,
    rating: 9.4,
    genre: 'Documentary',
    type: 'tv',
    cast_members: 'Narrated by Morgan Freeman',
    featured: false,
    seasons: [
      {
        id: 's1-tv10',
        show_id: 'tv10',
        season_number: 1,
        title: 'Season 1: The Great Currents',
        episodes: [
          {
            id: 'ep1-s1-tv10',
            season_id: 's1-tv10',
            episode_number: 1,
            title: 'Rivers in the Sky',
            description: 'Following the Atlantic avian flyways across three continents.',
            thumbnail_url: generateCinematicBackdrop('Rivers in the Sky', 'Avian migrations.', '#06b6d4', '#eab308'),
            video_url: DEMO_VIDEOS.forBiggerJoyrides,
            duration: 50,
          },
        ],
      },
    ],
  },
];
