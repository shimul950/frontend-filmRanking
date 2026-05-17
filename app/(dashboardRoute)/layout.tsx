

export default function commonLayout({
  admin,
  user
}: Readonly<{
  admin: React.ReactNode,
  user: React.ReactNode
}>) {
  return (   
      <div>
        {admin}
      </div>
  )
}
