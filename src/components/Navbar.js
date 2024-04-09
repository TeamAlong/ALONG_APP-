import Image from "next/image";
import Menu from "../../public/assets/hamburger.svg";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0  w-full flex items-center justify-between py-5 px-[18px] z-10">
        <h1 className="font-bold text-lg">Along</h1>
        <Image src={Menu} alt="hamburger menu"/>
    </nav>
  )
}
