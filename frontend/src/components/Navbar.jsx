import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  FiBell,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

export default function Navbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always leave the protected page after logout.
      window.location.href = "/login";
    }
  }
  const { user, logout } = useAuth();

  const {
    t,
  } = useLanguage();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profilePhoto, setProfilePhoto] =
    useState(
      localStorage.getItem(
        "skySenseProfilePhoto"
      ) || ""
    );

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "darkMode"
      ) === "true"
    );

  // ================================
  // LOGGED-IN NAVIGATION
  // ================================

  const navItems = [
    {
      to: "/",
      icon: "⌂",
      label: t("Home"),
    },
    {
      to: "/forecast",
      icon: "▥",
      label: t("Forecast"),
    },
    {
      to: "/weather-map",
      icon: "🗺️",
      label: t("Weather Map"),
    },
    {
      to: "/favorites",
      icon: "♡",
      label: t("Favorites"),
    },
    {
      to: "/history",
      icon: "◷",
      label: t("History"),
    },
    {
      to: "/alerts",
      icon: <FiBell />,
      label: t("Alerts"),
    },
    {
      to: "/assistant",
      icon: "◉",
      label: t("Assistant"),
    },
  ];

  // ================================
  // GUEST NAVIGATION
  // ================================

  const guestNavItems = [
    {
      to: "/",
      icon: "⌂",
      label: t("Home"),
    },
  ];

  const visibleNavItems = user
    ? navItems
    : guestNavItems;

  // ================================
  // DARK MODE
  // ================================

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );
  }, [darkMode]);

  useEffect(() => {
    function handleThemeChange() {
      const savedMode =
        localStorage.getItem(
          "darkMode"
        ) === "true";

      setDarkMode(savedMode);
    }

    window.addEventListener(
      "darkModeChanged",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "darkModeChanged",
        handleThemeChange
      );
    };
  }, []);

  // ================================
  // PROFILE PHOTO
  // ================================

  useEffect(() => {
    function updateProfilePhoto() {
      setProfilePhoto(
        localStorage.getItem(
          "skySenseProfilePhoto"
        ) || ""
      );
    }

    window.addEventListener(
      "skySenseProfilePhotoChanged",
      updateProfilePhoto
    );

    return () => {
      window.removeEventListener(
        "skySenseProfilePhotoChanged",
        updateProfilePhoto
      );
    };
  }, []);

  // ================================
  // TOGGLE DARK MODE
  // ================================

  function toggleDarkMode() {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "darkMode",
      newMode.toString()
    );

    document.body.classList.toggle(
      "dark-mode",
      newMode
    );

    window.dispatchEvent(
      new Event("darkModeChanged")
    );
  }

  return (
    <>
      {/* =================================
          DESKTOP SIDEBAR
      ================================= */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="brand-cloud">
            ☁
          </div>

          <div>
            <span>SkySense</span>
            <strong>AI</strong>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          {/* MAIN NAV */}

          <div className="nav-main">

            {visibleNavItems.map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={
                    item.to === "/"
                  }
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${isActive
                      ? "active"
                      : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              )
            )}

          </div>


          {/* ================================
              BOTTOM NAV
          ================================= */}

          <div className="nav-bottom">

            {user ? (
              <>

                {/* PROFILE */}

                <NavLink
                  to="/profile"
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${isActive
                      ? "active"
                      : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    ♙
                  </span>

                  <span>
                    {t("Profile")}
                  </span>

                </NavLink>


                {/* SETTINGS */}

                <NavLink
                  to="/settings"
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${isActive
                      ? "active"
                      : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    ⚙
                  </span>

                  <span>
                    {t("Settings")}
                  </span>

                </NavLink>


                {/* ADMIN */}

                {user.role ===
                  "admin" && (
                    <NavLink
                      to="/admin"
                      className={({
                        isActive,
                      }) =>
                        `sidebar-link ${isActive
                          ? "active"
                          : ""
                        }`
                      }
                    >

                      <span className="sidebar-icon">
                        ♢
                      </span>

                      <span>
                        Admin
                      </span>

                    </NavLink>
                  )}


                {/* LOGOUT */}

                <button
                  className="sidebar-link logout-link"
                  onClick={handleLogout}
                  type="button"
                  disabled={isLoggingOut}
                >

                  <span className="sidebar-icon">
                    ↪
                  </span>

                  <span>
                    {isLoggingOut ? "Logging out..." : t("Logout")}
                  </span>

                </button>

              </>
            ) : (
              <>

                {/* GUEST LOGIN */}

                <NavLink
                  to="/login"
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${isActive
                      ? "active"
                      : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    <FiLogIn />
                  </span>

                  <span>
                    Login
                  </span>

                </NavLink>


                {/* GUEST REGISTER */}

                <NavLink
                  to="/register"
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${isActive
                      ? "active"
                      : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    <FiUserPlus />
                  </span>

                  <span>
                    Register
                  </span>

                </NavLink>

              </>
            )}

          </div>

        </nav>


        {/* =================================
            DARK MODE
        ================================= */}

        <div className="sidebar-dark-mode">

          <span className="dark-mode-icon">
            {darkMode
              ? "☾"
              : "☼"}
          </span>

          <div>

            <small>
              {darkMode
                ? t("Dark")
                : t("Light")}
            </small>

            <span>
              {darkMode
                ? t("Dark Mode")
                : t("Light Mode")}
            </span>

          </div>


          <button
            type="button"
            className={`dark-switch ${darkMode
              ? "active"
              : ""
              }`}
            onClick={
              toggleDarkMode
            }
            aria-label="Toggle dark mode"
          >

            <span></span>

          </button>

        </div>

      </aside>


      {/* =================================
          MOBILE HEADER
      ================================= */}

      <header className="mobile-header">

        <div className="mobile-brand">

          <span>☁</span>

          <strong>
            SkySense AI
          </strong>

        </div>


        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
        >
          ☰
        </button>

      </header>


      {/* =================================
          MOBILE NAVIGATION
      ================================= */}

      {mobileOpen && (
        <div className="mobile-sidebar">

          {visibleNavItems.map(
            (item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={
                  item.to === "/"
                }
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `mobile-sidebar-link ${isActive
                    ? "active"
                    : ""
                  }`
                }
              >

                <span>
                  {item.icon}
                </span>

                {item.label}

              </NavLink>
            )
          )}


          {/* ================================
              LOGGED-IN MOBILE
          ================================= */}

          {user ? (
            <>

              <NavLink
                to="/profile"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `mobile-sidebar-link ${isActive
                    ? "active"
                    : ""
                  }`
                }
              >

                <span>♙</span>

                {t("Profile")}

              </NavLink>


              <NavLink
                to="/settings"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `mobile-sidebar-link ${isActive
                    ? "active"
                    : ""
                  }`
                }
              >

                <span>⚙</span>

                {t("Settings")}

              </NavLink>


              {user.role ===
                "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className={({
                      isActive,
                    }) =>
                      `mobile-sidebar-link ${isActive
                        ? "active"
                        : ""
                      }`
                    }
                  >

                    <span>♢</span>

                    Admin

                  </NavLink>
                )}


              <button
                type="button"
                className="mobile-sidebar-link"
                onClick={() => {
                  setMobileOpen(
                    false
                  );

                  handleLogout();
                }}
              >

                <span>↪</span>

                {isLoggingOut ? "Logging out..." : t("Logout")}

              </button>

            </>
          ) : (
            <>

              {/* GUEST MOBILE LOGIN */}

              <NavLink
                to="/login"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `mobile-sidebar-link ${isActive
                    ? "active"
                    : ""
                  }`
                }
              >

                <span>
                  <FiLogIn />
                </span>

                Login

              </NavLink>


              {/* GUEST MOBILE REGISTER */}

              <NavLink
                to="/register"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  `mobile-sidebar-link ${isActive
                    ? "active"
                    : ""
                  }`
                }
              >

                <span>
                  <FiUserPlus />
                </span>

                Register

              </NavLink>

            </>
          )}


          {/* MOBILE DARK MODE */}

          <button
            type="button"
            className="mobile-sidebar-link"
            onClick={
              toggleDarkMode
            }
          >

            <span>
              {darkMode
                ? "☾"
                : "☼"}
            </span>

            {darkMode
              ? t("Light Mode")
              : t("Dark Mode")}

          </button>

        </div>
      )}

    </>
  );
}