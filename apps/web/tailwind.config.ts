// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets" | "theme"> = {
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
};

export default config;
