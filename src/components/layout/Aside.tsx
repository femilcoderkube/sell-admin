import React, { useState } from "react";
// import { motion } from "framer-motion";
import { routes } from "../../routes";
import { Link } from "react-router-dom";

export const Aside: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const handleSubMenuToggle = (id: number) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  return (
    <aside className="fixed left-0 bg-dark-blue px-[0.8rem] min-h-full text-center pt-[6rem] w-[15rem]">
      <ul className="flex flex-col gap-2">
        {routes.map((item, key) =>
          item.isShow ? (
            <li key={key} className="flex flex-col gap-2">
              <Link
                to={item.submenu ? "#" : item.path}
                className={`aside_link text-[1.0625rem] hover:bg-primary-gradient font-medium text-left block text-custom-gray flex items-center gap-2 py-[0.45rem] px-2 rounded-[0.52rem] transition-all duration-300 
                ${openSubMenu === key ? "bg-[#1E2233] text-white active" : ""}`}
                onMouseEnter={() => setHoveredItem(key)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={(e) => {
                  // e.preventDefault(); // Prevent page reload when clicking #
                  if (item.submenu) {
                    handleSubMenuToggle(key);
                  }
                }}
              >
                {item.icon}
                {item.label}
                {item.submenu && (
                  <span className="flex-[1] flex justify-end">
                    <img
                      className="down_arrow duration-300"
                      src={
                        hoveredItem === key || openSubMenu === key
                          ? item.white_svg
                          : item.dark_svg
                      }
                      alt="dropdown"
                    />
                  </span>
                )}
              </Link>

              {item.submenu && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={
                    openSubMenu === key ? { height: "auto" } : { height: 0 }
                  }
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden submenu"
                >
                  {item.submenu.map((sub, key) => (
                    <li key={key}>
                      <Link
                        to={sub.path}
                        className="text-[#AAB4D4] block py-2 px-4 hover:bg-[#1E2233] rounded-md"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
    </aside>
  );
};
