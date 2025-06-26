import { FC, useState } from "react";
import "../../assets/css/style.css";
import logo from "../../assets/images/nafes-logo.svg";
import user from "../../assets/images/user.png";
import { useDispatch } from "react-redux";
import { logout } from "../../app/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";

export const Header: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <>
      <style>{`
        .header-container {
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, #46A2FF 0%, #2E8EF7 50%, #1976D2 100%);
          box-shadow: 0 4px 20px rgba(70, 162, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 8px;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        
        .logo-container:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .logo-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .logo-container:hover::before {
          left: 100%;
        }
        
        .header-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .header-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .header-button:active {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .header-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .header-button:hover::before {
          left: 100%;
        }
        
        .user-avatar {
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .header-button:hover .user-avatar {
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.1);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
        }
        
        .logout-button {
          background: rgba(244, 67, 54, 0.15);
          border: 1px solid rgba(244, 67, 54, 0.3);
        }
        
        .logout-button:hover {
          background: rgba(244, 67, 54, 0.25);
          border-color: rgba(244, 67, 54, 0.4);
          box-shadow: 0 8px 25px rgba(244, 67, 54, 0.15);
        }
        
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }
        
        .header-button:hover .icon-container {
          transform: scale(1.1);
        }
        
        .logout-button:hover .icon-container {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        .user-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          min-width: 200px;
        }
        
        .user-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        
        .user-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          right: 20px;
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: none;
          border-right: none;
          transform: rotate(45deg);
        }
        
        .menu-item {
          padding: 12px 16px;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .menu-item:hover {
          background: rgba(70, 162, 255, 0.1);
          color: #46A2FF;
        }
        
        .menu-item:first-child {
          border-radius: 12px 12px 0 0;
        }
        
        .menu-item:last-child {
          border-radius: 0 0 12px 12px;
          border-bottom: none;
        }
        
        .brand-text {
          background: linear-gradient(45deg, #ffffff, #e3f2fd);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.025em;
        }
        
        .header-divider {
          width: 1px;
          height: 24px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
        }
      `}</style>

      <header className="header-container fixed left-0 top-0 w-full px-4 sm:px-6 lg:px-8 py-3 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left section - Logo and Brand */}
          <div className="nf_head_left-con flex items-center gap-4">
            <Link to={"/dashboard"} className="logo-container block">
              <img
                className="w-[2.5rem] h-[2.5rem] object-contain"
                src={logo}
                alt="Nafes Logo"
              />
            </Link>
            <div className="header-divider hidden sm:block"></div>
            <h1 className="brand-text hidden sm:block">Nafes Dashboard</h1>
          </div>

          {/* Right section - User controls */}
          <div className="nf_head_right-con flex items-center gap-3">
            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="header-button flex items-center gap-3 text-white font-medium lg:text-[0.885rem] py-2.5 px-4 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <img
                    className="user-avatar w-[1.5rem] h-[1.5rem] object-cover rounded-full"
                    src={user}
                    alt="User Avatar"
                  />
                  <span className="hidden sm:inline font-semibold">
                    PlusGammer
                  </span>
                </div>
                <div
                  className={`icon-container transition-transform duration-300 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className={`user-menu ${isUserMenuOpen ? "open" : ""}`}>
                <div className="menu-item">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-8 h-8 object-cover rounded-full"
                      src={user}
                      alt="User Avatar"
                    />
                    <div>
                      <div className="font-semibold text-sm">PlusGammer</div>
                      <div className="text-xs text-gray-500">Administrator</div>
                    </div>
                  </div>
                </div>
                {/* <div className="menu-item">
                  <div className="flex items-center gap-3">
                    <div className="icon-container">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <span>Profile Settings</span>
                  </div>
                </div> */}
                {/* <div className="menu-item">
                  <div className="flex items-center gap-3">
                    <div className="icon-container">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.742 9.97512 4.01062 9.78251C4.27925 9.5899 4.48167 9.32074 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90337 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>Settings</span>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="logout-button header-button flex items-center gap-2 text-white font-medium lg:text-[0.885rem] py-2.5 px-4 rounded-xl"
            >
              <div className="icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 11V7.16146C9.99998 6.63435 9.99997 6.17953 10.0306 5.80498C10.0629 5.40963 10.1342 5.01641 10.327 4.63803C10.6146 4.07355 11.0735 3.6146 11.638 3.32698C12.0164 3.13419 12.4096 3.06287 12.805 3.03057C13.1795 2.99997 13.6343 2.99998 14.1614 3H16.8386C17.3657 2.99998 17.8205 2.99997 18.195 3.03057C18.5904 3.06287 18.9836 3.13419 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C20.8658 5.01641 20.9371 5.40963 20.9694 5.80497C21 6.17954 21 6.63434 21 7.16148V16.8386C21 17.3657 21 17.8205 20.9694 18.195C20.9371 18.5904 20.8658 18.9836 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.9836 20.8658 18.5904 20.9371 18.195 20.9694C17.8205 21 17.3657 21 16.8385 21H14.1615C13.6343 21 13.1795 21 12.805 20.9694C12.4096 20.9371 12.0164 20.8658 11.638 20.673C11.0735 20.3854 10.6146 19.9265 10.327 19.362C10.1342 18.9836 10.0629 18.5904 10.0306 18.195C9.99997 17.8205 9.99999 17.3657 10 16.8386V13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H10Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.70711 14.2929C8.09763 14.6834 8.09763 15.3166 7.70711 15.7071C7.31658 16.0976 6.68342 16.0976 6.29289 15.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289C8.09763 8.68342 8.09763 9.31658 7.70711 9.70711L6.41421 11H10V13H6.41421L7.70711 14.2929Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="hidden sm:inline font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
