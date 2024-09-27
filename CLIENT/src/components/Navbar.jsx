import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProfileIcon from "./ProfileIcon";


export default function Navbar() {
  return (
    <div className="mx-auto px-5 lg:px-7 py-2 bg-white shadow">
      <div className="flex items-center justify-between">
        {/* Left Side (Start) */}
        <div className="flex items-center">
          <Bars3Icon className="w-10 p-2 hover:bg-sea-100 rounded-full hover:shadow"></Bars3Icon>
          <img src="/docs.png" alt="" className="h-8 ml-3" />
          <h3 className="text-lg font-medium mx-2">Docs</h3>
        </div>

        {/* Center Search Box */}
        <div className="relative hidden sm:flex items-center bg-sea-50 rounded-full md:w-1/3 lg:w-2/4">
          <span className="absolute left-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-black" />
          </span>
          <input
            type="text"
            className="bg-transparent pl-10 pr-5 py-2 focus:shadow focus-visible:border focus:bg-white rounded-full w-full focus:outline-none"
            placeholder="Search"
          />
        </div>

        {/* Right Side (End) */}
        <div className="flex items-center">
          <ProfileIcon></ProfileIcon>
        </div>
      </div>
    </div>
  );
}
