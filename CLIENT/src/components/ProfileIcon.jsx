import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/AuthState";


function ProfileIcon() {
  const dispatch = useDispatch()
  const {authenticated} = useSelector(state => state.AuthState)
  return (
    <Menu as="div" className="relative">
      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open user menu</span>
        <img
          alt=""
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="h-8 w-8 rounded-full"
        />
      </MenuButton>
      <MenuItems className="absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <MenuItem>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Your Profile
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
        </MenuItem>
        {authenticated ? <MenuItem>
          <a
            onClick={() => dispatch(logout())}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </a>
        </MenuItem>:<MenuItem>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign In
          </a>
        </MenuItem>}
      </MenuItems>
    </Menu>
  );
}

export default ProfileIcon;
