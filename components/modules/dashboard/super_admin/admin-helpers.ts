export function formatAdminDate(dateString?: string): string {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    } catch {
        return "Invalid date";
    }
}

export function getAdminAvatarGradient(name?: string): string {
    if (!name) return "from-amber-600 to-red-700";
    const gradients = [
        "from-amber-500 to-red-600",
        "from-purple-600 to-indigo-700",
        "from-rose-500 to-pink-700",
        "from-cyan-600 to-blue-700",
        "from-emerald-600 to-teal-700",
        "from-violet-600 to-purple-800",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
}
