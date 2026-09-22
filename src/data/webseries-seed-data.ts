export interface ISeedWebSeries {
    title: string;
    synopsis: string;
    releaseYear: number;
    language: string;
    country: string;
    status: "RELEASED" | "UPCOMING" | "ARCHIVED";
    pricing: "FREE" | "PREMIUM";
    posterUrl: string;
}

export const SEED_WEB_SERIES: ISeedWebSeries[] = [
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
