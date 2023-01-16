import Pusher from "pusher";
import ClientPusher from "pusher-js"

export const serverPusher = new Pusher({
    appId: "1537954",
    key: "98ce91e45153d6dd8f9c",
    secret: process.env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: true
})

export const clientPusher = new ClientPusher('98ce91e45153d6dd8f9c', {
    cluster: 'eu',
    forceTLS: true,
  })