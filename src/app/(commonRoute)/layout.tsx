import Navbar from "./_component/shared/navbar/Navbar"


export default function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    
      <div>
        <Navbar/>
          
        {children}
        <div>Footer</div>

      </div>
  )
}
