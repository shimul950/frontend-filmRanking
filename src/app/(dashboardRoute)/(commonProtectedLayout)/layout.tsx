
export default function CommonProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10">
            {children}
        </main>
    )
}