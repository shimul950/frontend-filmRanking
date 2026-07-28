import Navbar from "../../../components/shared/navbar/Navbar"


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
