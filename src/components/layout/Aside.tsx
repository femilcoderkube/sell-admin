// src/components/Aside.tsx
import React, { useState, useMemo } from "react";
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
    <>
      <style>{`
        .sidebar-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-item:hover {
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .sidebar-item.active {
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: white;
          border-radius: 0 2px 2px 0;
          transition: height 0.3s ease;
        }
        
        .sidebar-item.active::before,
        .sidebar-item:hover::before {
          height: 60%;
        }
        
        .partner-item {
          position: relative;
          overflow: hidden;
        }
        
        .partner-item::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .partner-item:hover::after {
          left: 100%;
        }
        
        .dropdown-arrow {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .dropdown-arrow:hover {
          filter: brightness(1.2);
        }
        
        .submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
          opacity: 0;
        }
        
        .submenu.open {
          max-height: 500px;
          opacity: 1;
        }
        
        .submenu-item {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .submenu-item:hover {
          transform: translateX(6px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .submenu-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .submenu-item:hover::before {
          transform: translateX(100%);
        }
        
        .sidebar-gradient {
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);
        }
        
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .menu-label {
          flex: 1;
          font-weight: 500;
          letter-spacing: 0.025em;
        }
        
        .submenu-dot {
          width: 6px;
          height: 6px;
          background-color: #AAB4D4;
          border-radius: 50%;
          margin-right: 12px;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .submenu-item:hover .submenu-dot {
          background-color: white;
          transform: scale(1.2);
        }
      `}</style>

      <aside className="fixed left-0 bg-dark-blue h-screen overflow-hidden pt-[6rem] w-[15rem] shadow-2xl border-r border-[#1E2233]">
        {/* Gradient overlay for visual depth */}
        <div className="absolute inset-0 sidebar-gradient pointer-events-none"></div>

        {/* Scrollable content area */}
        <div className="h-full overflow-y-auto px-3 pb-6 hide-scrollbar relative z-10">
          <ul className="flex flex-col gap-2">
            {routes.map((item, key) => {
              return item.isShow ? (
                <li key={key} className="flex flex-col">
                  <Link
                    to={item.submenu ? "#" : item.path}
                    className={`${
                      item.isPartner
                        ? `partner-item text-[0.95rem] font-semibold text-left flex items-center text-white gap-3 py-3 px-3 rounded-xl shadow-lg ${
                            openSubMenu === key ? "active" : ""
                          }`
                        : `sidebar-item text-[0.95rem] font-medium text-left flex items-center text-custom-gray gap-3 py-3 px-3 rounded-xl hover:bg-gradient-to-r hover:from-[#1E2233] hover:to-[#252A41] hover:text-white ${
                            openSubMenu === key
                              ? "bg-gradient-to-r from-[#1E2233] to-[#252A41] text-white active"
                              : ""
                          }`
                    }`}
                    style={
                      item.isPartner
                        ? {
                            background: `linear-gradient(135deg, ${item.partnerColor.replace(
                              /"/g,
                              ""
                            )}, ${item.partnerColor.replace(/"/g, "")}dd)`,
                          }
                        : {}
                    }
                    onMouseEnter={() => setHoveredItem(key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={(e) => {
                      if (item.submenu) {
                        e.preventDefault();
                        handleSubMenuToggle(key);
                        if (item.isPartner) {
                          localStorage.setItem("partnerId", item.partnerId);
                        }
                      }
                    }}
                  >
                    {/* Icon container */}
                    <div className="icon-container">{item.icon}</div>

                    {/* Label */}
                    <span className="menu-label">{item.label}</span>

                    {/* Dropdown arrow */}
                    {item.submenu && !item.isPartner && (
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        <img
                          className={`dropdown-arrow w-full h-full object-contain ${
                            openSubMenu === key ? "open" : ""
                          }`}
                          src={
                            hoveredItem === key || openSubMenu === key
                              ? item.white_svg
                              : item.dark_svg
                          }
                          alt="dropdown"
                        />
                      </div>
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.submenu && (
                    <div
                      className={`submenu ${openSubMenu === key ? "open" : ""}`}
                    >
                      <ul className="mt-2 ml-6 space-y-1 border-l-2 border-[#1E2233] pl-4">
                        {item.submenu.map((sub, subKey) => (
                          <li key={subKey}>
                            <Link
                              to={sub.path}
                              className="submenu-item text-[#AAB4D4] text-sm font-medium flex items-center py-2.5 px-3 rounded-lg hover:bg-gradient-to-r hover:from-[#1E2233] hover:to-[#252A41] hover:text-white"
                            >
                              {/* Submenu indicator dot */}
                              <div className="submenu-dot"></div>

                              <span className="tracking-wide">{sub.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <React.Fragment key={key} />
              );
            })}
          </ul>

          {/* Bottom fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dark-blue to-transparent pointer-events-none"></div>
        </div>
      </aside>
    </>
  );
};
