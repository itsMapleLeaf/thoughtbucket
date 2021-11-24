import { serveTailwindCss } from "remix-tailwind"

export const loader = () => serveTailwindCss("app/tailwind.css")
