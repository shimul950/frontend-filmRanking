import jwt from "jsonwebtoken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-model-filmranking.onrender.com/api/v1";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";

const token = jwt.sign(
    { id: "admin_seed_master", email: "admin@filmrank.com", role: "SUPER_ADMIN" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
);

const headers = {
    "Content-Type": "application/json",
    Cookie: `accessToken=${token}; better-auth.session_token=${token}`,
    Authorization: `Bearer ${token}`,
};

const SEED_CASTS = [
    {
        name: "Leonardo DiCaprio",
        bio: "Academy Award-winning American actor known for iconic roles in Titanic, Inception, The Wolf of Wall Street, and The Revenant. A passionate environmental advocate.",
        nationality: "American",
        birthDate: "1974-11-11T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Cillian Murphy",
        bio: "Irish actor celebrated for his transformative roles as J. Robert Oppenheimer in Oppenheimer and Thomas Shelby in Peaky Blinders, as well as frequent collaborations with Christopher Nolan.",
        nationality: "Irish",
        birthDate: "1976-05-25T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Christian Bale",
        bio: "English actor renowned for his intense physical transformations and commitment, acclaimed as Bruce Wayne/Batman in The Dark Knight Trilogy, American Psycho, and The Fighter.",
        nationality: "British",
        birthDate: "1974-01-30T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Morgan Freeman",
        bio: "Legendary American actor with one of cinema's most recognizable voices. Famous for The Shawshank Redemption, Driving Miss Daisy, Million Dollar Baby, and Seven.",
        nationality: "American",
        birthDate: "1937-06-01T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Tom Hanks",
        bio: "Widely regarded as an American cultural icon, recipient of two consecutive Academy Awards for Philadelphia and Forrest Gump, also starred in Cast Away, Saving Private Ryan, and Toy Story.",
        nationality: "American",
        birthDate: "1956-07-09T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Keanu Reeves",
        bio: "Beloved Canadian actor renowned for defining action roles as Neo in The Matrix saga and the eponymous assassin in the John Wick franchise.",
        nationality: "Canadian",
        birthDate: "1964-09-02T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Brad Pitt",
        bio: "Academy Award-winning actor and producer, known for Fight Club, Se7en, Once Upon a Time in Hollywood, Inglourious Basterds, and Moneyball.",
        nationality: "American",
        birthDate: "1963-12-18T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Scarlett Johansson",
        bio: "One of the world's highest-grossing actresses, famed as Natasha Romanoff / Black Widow in the Marvel Cinematic Universe, and acclaimed performances in Lost in Translation and Marriage Story.",
        nationality: "American",
        birthDate: "1984-11-22T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Emma Stone",
        bio: "Two-time Academy Award winner recognized for La La Land, Poor Things, The Favourite, and Birdman, celebrated for her versatility and charm.",
        nationality: "American",
        birthDate: "1988-11-06T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Robert De Niro",
        bio: "Two-time Academy Award-winning cinema titan celebrated for legendary collaborations with Martin Scorsese: Taxi Driver, Raging Bull, Goodfellas, and The Irishman.",
        nationality: "American",
        birthDate: "1943-08-17T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Al Pacino",
        bio: "Legendary American actor whose career spans over five decades, unforgettable as Michael Corleone in The Godfather trilogy, Scarface, Dog Day Afternoon, and Heat.",
        nationality: "American",
        birthDate: "1940-04-25T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Matthew McConaughey",
        bio: "Oscar-winning American actor known for captivating performances in Interstellar, Dallas Buyers Club, True Detective, and The Wolf of Wall Street.",
        nationality: "American",
        birthDate: "1969-11-04T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    },
];

const SEED_DIRECTORS = [
    {
        name: "Christopher Nolan",
        bio: "Acclaimed British-American filmmaker recognized for his non-linear storytelling, practical effects, and blockbusters like Oppenheimer, Interstellar, The Dark Knight Trilogy, and Inception.",
        nationality: "British-American",
        birthDate: "1970-07-30T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Quentin Tarantino",
        bio: "Visionary auteur famous for his non-linear storylines, stylized violence, memorable dialogue, and cinematic homages: Pulp Fiction, Kill Bill, Inglourious Basterds, and Django Unchained.",
        nationality: "American",
        birthDate: "1963-03-27T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Martin Scorsese",
        bio: "Iconic American director, producer, and screenwriter who shaped modern cinema through masterworks such as Taxi Driver, Goodfellas, The Wolf of Wall Street, and The Departed.",
        nationality: "American",
        birthDate: "1942-11-17T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Steven Spielberg",
        bio: "The most commercially successful director in film history, pioneering the modern Hollywood blockbuster with Jaws, Jurassic Park, Schindler's List, and Raiders of the Lost Ark.",
        nationality: "American",
        birthDate: "1946-12-18T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Denis Villeneuve",
        bio: "French-Canadian visionary acclaimed for his striking visual aesthetic and philosophical sci-fi epics: Dune: Part One & Two, Blade Runner 2049, Arrival, and Sicario.",
        nationality: "Canadian",
        birthDate: "1967-10-03T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "David Fincher",
        bio: "Master of psychological thrillers and clinical precision, celebrated for Fight Club, Se7en, The Social Network, Zodiac, and Gone Girl.",
        nationality: "American",
        birthDate: "1962-08-28T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "James Cameron",
        bio: "Pioneering technological innovator who directed two of history's highest-grossing films: Titanic and Avatar, alongside sci-fi landmarks Terminator 2: Judgment Day and Aliens.",
        nationality: "Canadian",
        birthDate: "1954-08-16T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Ridley Scott",
        bio: "English director and producer celebrated for groundbreaking atmosphere and worldbuilding in Alien, Blade Runner, Gladiator, and The Martian.",
        nationality: "British",
        birthDate: "1937-11-30T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Hayao Miyazaki",
        bio: "Legendary Japanese animator, director, and co-founder of Studio Ghibli, beloved worldwide for Spirited Away, Princess Mononoke, and The Boy and the Heron.",
        nationality: "Japanese",
        birthDate: "1941-01-05T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Bong Joon-ho",
        bio: "South Korean filmmaker who made history when Parasite became the first non-English language film to win Best Picture at the Academy Awards, also known for Memories of Murder and Snowpiercer.",
        nationality: "South Korean",
        birthDate: "1969-09-14T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    },
    {
        name: "Greta Gerwig",
        bio: "American director and screenwriter known for her witty, empathetic, and culturally defining films including Lady Bird, Little Women, and the global box office sensation Barbie.",
        nationality: "American",
        birthDate: "1983-08-04T00:00:00.000Z",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    },
];

const SEED_WEB_SERIES = [
    {
        title: "Breaking Bad",
        synopsis: "A chemistry teacher diagnosed with terminal lung cancer teams up with a former student to manufacture and sell crystal meth, spiraling into the dangerous criminal underworld.",
        releaseYear: 2008,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Stranger Things",
        synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl with telekinetic powers.",
        releaseYear: 2016,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Game of Thrones",
        synopsis: "Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        releaseYear: 2011,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "PREMIUM",
        posterUrl: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Chernobyl",
        synopsis: "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes.",
        releaseYear: 2019,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "PREMIUM",
        posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "The Last of Us",
        synopsis: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
        releaseYear: 2023,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "PREMIUM",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Succession",
        synopsis: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company.",
        releaseYear: 2018,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "PREMIUM",
        posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Severance",
        synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth.",
        releaseYear: 2022,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Arcane",
        synopsis: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
        releaseYear: 2021,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Dark",
        synopsis: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families and a time-travel conspiracy.",
        releaseYear: 2017,
        language: "German",
        country: "Germany",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    },
    {
        title: "Better Call Saul",
        synopsis: "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.",
        releaseYear: 2015,
        language: "English",
        country: "USA",
        status: "RELEASED",
        pricing: "FREE",
        posterUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80",
    },
];

async function runSeed() {
    console.log("=== FILM RANK DATABASE SEEDER ===");
    console.log(`Connecting to: ${API_BASE_URL}`);

    // 1. Seed Casts
    console.log("\n--- Seeding Cast Members ---");
    let existingCasts = [];
    try {
        const res = await fetch(`${API_BASE_URL}/cast`, { headers });
        const json = await res.json();
        existingCasts = json.data || [];
    } catch (e) {
        console.warn("Could not fetch existing casts:", e.message);
    }
    const existingCastNames = new Set(existingCasts.map((c) => c.name.toLowerCase().trim()));

    let castAdded = 0;
    for (const cast of SEED_CASTS) {
        if (existingCastNames.has(cast.name.toLowerCase().trim())) {
            console.log(`[SKIP] Cast "${cast.name}" already exists.`);
            continue;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/cast`, {
                method: "POST",
                headers,
                body: JSON.stringify(cast),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                console.log(`[SUCCESS] Cast "${cast.name}" created.`);
                castAdded++;
            } else {
                console.error(`[FAILED] Cast "${cast.name}":`, json.message || res.status);
            }
        } catch (e) {
            console.error(`[ERROR] Cast "${cast.name}":`, e.message);
        }
    }

    // 2. Seed Directors
    console.log("\n--- Seeding Directors ---");
    let existingDirectors = [];
    try {
        const res = await fetch(`${API_BASE_URL}/director`, { headers });
        const json = await res.json();
        existingDirectors = json.data || [];
    } catch (e) {
        console.warn("Could not fetch existing directors:", e.message);
    }
    const existingDirectorNames = new Set(existingDirectors.map((d) => d.name.toLowerCase().trim()));

    let directorAdded = 0;
    for (const dir of SEED_DIRECTORS) {
        if (existingDirectorNames.has(dir.name.toLowerCase().trim())) {
            console.log(`[SKIP] Director "${dir.name}" already exists.`);
            continue;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/director`, {
                method: "POST",
                headers,
                body: JSON.stringify(dir),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                console.log(`[SUCCESS] Director "${dir.name}" created.`);
                directorAdded++;
            } else {
                console.error(`[FAILED] Director "${dir.name}":`, json.message || res.status);
            }
        } catch (e) {
            console.error(`[ERROR] Director "${dir.name}":`, e.message);
        }
    }

    // 3. Seed Web Series
    console.log("\n--- Seeding Web Series ---");
    let existingSeries = [];
    try {
        const res = await fetch(`${API_BASE_URL}/web-series`, { headers });
        const json = await res.json();
        existingSeries = json.data || [];
    } catch (e) {
        console.warn("Could not fetch existing web series:", e.message);
    }
    const existingSeriesTitles = new Set(existingSeries.map((s) => s.title.toLowerCase().trim()));

    let seriesAdded = 0;
    for (const series of SEED_WEB_SERIES) {
        if (existingSeriesTitles.has(series.title.toLowerCase().trim())) {
            console.log(`[SKIP] Web Series "${series.title}" already exists.`);
            continue;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/web-series`, {
                method: "POST",
                headers,
                body: JSON.stringify(series),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                console.log(`[SUCCESS] Web Series "${series.title}" created.`);
                seriesAdded++;
            } else {
                console.error(`[FAILED] Web Series "${series.title}":`, json.message || res.status);
            }
        } catch (e) {
            console.error(`[ERROR] Web Series "${series.title}":`, e.message);
        }
    }

    console.log("\n=== SEEDING SUMMARY ===");
    console.log(`Cast Added: ${castAdded} / ${SEED_CASTS.length}`);
    console.log(`Directors Added: ${directorAdded} / ${SEED_DIRECTORS.length}`);
    console.log(`Web Series Added: ${seriesAdded} / ${SEED_WEB_SERIES.length}`);
}

runSeed();
