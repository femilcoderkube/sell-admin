// src/components/Aside.tsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { generateRoutes } from "../../routes/menuItems";
import { RoutesProps } from "../../utils";
import { useDispatch } from "react-redux";
import { setTrue } from "../../app/features/sidebar/booleanSlice";

export const Aside: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const dispatch = useDispatch();

  // Retrieve and parse admin data from localStorage
  const adminSidebar = localStorage.getItem("admin");
  const jsonValue = adminSidebar ? JSON.parse(adminSidebar) : null;
  // console.log("jsonValue", jsonValue?.adminAccess?.modules);

  // Generate routes dynamically using adminside data
  const routes: RoutesProps[] = useMemo(() => {
    dispatch(setTrue());
    const adminside = jsonValue?.adminAccess?.modules || [];
    return generateRoutes(adminside);
  }, [jsonValue]);

  const handleSubMenuToggle = (id: number) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  return (
    <aside
      className="fixed left-0 bg-dark-blue px-[0.8rem] h-screen overflow-y-auto pt-[6rem] w-[15rem] hide-scrollbar"
    >
      {/* <aside className="fixed left-0 bg-dark-blue px-[0.8rem] min-h-full text-center pt-[6rem] w-[15rem]"> */}
      <ul className="flex flex-col gap-2">
        {routes.map((item, key) => {
          // console.log("routes--", item)
          return item.isShow ? (
            <li key={key} className="flex flex-col gap-2">
              <Link
                to={item.submenu ? "#" : item.path}
                className={`${
                  item.isPartner
                    ? `aside_link text-[1.0625rem] font-medium text-left block text-white text-center gap-2 py-[0.45rem] px-2 rounded-[0.52rem] transition-all duration-300 ${
                        openSubMenu === key ? "text-white" : ""
                      }`
                    : `aside_link text-[1.0625rem] hover:bg-primary-gradient font-medium text-left block text-custom-gray flex items-center gap-2 py-[0.45rem] px-2 rounded-[0.52rem] transition-all duration-300 
                ${openSubMenu === key ? "bg-[#1E2233] text-white active" : ""}`
                }`}
                style={
                  item.isPartner
                    ? { backgroundColor: item.partnerColor.replace(/"/g, "") }
                    : {}
                }
                onMouseEnter={() => setHoveredItem(key)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault(); // Prevent navigation for parent with submenu
                    handleSubMenuToggle(key);
                    if (item.isPartner) {
                      localStorage.setItem("partnerId", item.partnerId);
                    }
                  }
                }}
              >
                {item.icon}
                {item.label}
                {item.submenu && !item.isPartner && (
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
                  {item.submenu.map((sub, subKey) => (
                    <li key={subKey}>
                      <Link
                        to={sub.path}
                        className="text-[#AAB4D4] block py-2 px-4 hover:bg-[#1E2233] rounded-md text-center"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ) : (
            <React.Fragment key={key} />
          );
        })}
      </ul>
    </aside>
  );
};
