export { default } from "next-auth/middleware"

//secures the matching routes...
export const config = { matcher: ["/"] };