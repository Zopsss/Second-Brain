// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";
// @ts-expect-error;
import tailwindcssMotion from "tailwindcss-motion";

const config: Pick<Config, "content" | "presets" | "theme" | "plugins"> = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    presets: [sharedConfig],
    theme: {
        extend: {
            colors: {
                purple: {
                    600: "#9332eb",
                },
            },
        },
    },
    plugins: [tailwindcssMotion],
};

export default config;
