"use client";

// import Image from "next/image";
// import styles from "./themeToggle.module.css";
// import { ThemeContext } from "@/context/ThemeContext";
// import React, { useContext } from 'react'
// import { useTheme } from '@designcise/next-theme-toggle'


// const ThemeToggle = () => {
//   const { toggle, theme } = useContext(ThemeContext);

//   return (
//     <div
//       className={styles.container}
//       onClick={toggle}
//       style={
//         theme === "dark" ? { backgroundColor: "white" } : { backgroundColor: "#0f172a" }
//       }
//     >
//       <Image src="/moon.png" alt="" width={14} height={14} />
//       <div
//         className={styles.ball}
//         style={
//           theme === "dark"
//             ? { left: 1, background: "#0f172a" }
//             : { right: 1, background: "white" }
//         }
//       ></div>
//       <Image src="/sun.png" alt="" width={14} height={14} />
//     </div>
//   );
// };

// export default ThemeToggle;


'use client'

import React, { useContext } from 'react'
import { useTheme } from '@designcise/next-theme-toggle'

export default function ToggleThemeButton() {
  const { theme, themes, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme.type === themes.dark.type ? themes.light : themes.dark)}>
      Toggle Theme
    </button>
  )
}
