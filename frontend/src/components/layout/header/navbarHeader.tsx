import { NavLink } from "react-router-dom";

interface NavbarHeaderProps {
    name: string;
    link: string;
}

export default function NavbarHeader({ name, link }: NavbarHeaderProps) {
    return(
        <NavLink to={link} className={({ isActive }) =>  `text-lg font-medium underline-offset-[16px] decoration-2 hover:text-indigo-600 ${
            isActive ? "underline text-indigo-600" : ""
        }`}>
            <p className="text-lg font-inter font-medium hover:text-indigo-600 hover:cursor-pointer active:underline decoration-2">{name}</p>
        </NavLink>
    )
}