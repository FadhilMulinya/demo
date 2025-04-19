// components/Navbar.tsx
import Link from "next/link";
import ConnectButton from "./connectButton";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Todo List
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>

           <ConnectButton />
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;