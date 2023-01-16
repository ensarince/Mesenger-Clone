"use client"
import { FormEvent, useState } from "react"
import {v4 as uuid} from "uuid"
import { Message } from "../typings"
import useSWR from 'swr'
import fetcher from "../utils/fetchMessages"
import { unstable_getServerSession } from "next-auth"

type Props = {
    session: Awaited<ReturnType<typeof unstable_getServerSession> | any>
}
function ChatInput({ session }: Props) {
    
    const [input, setInput] = useState("")

     /* data fetch using SWR, a HTTP cache invalidation strategy popularized by HTTP RFC 5861.
     SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate),
     and finally come with the up-to-date data. */
    const {data: messages, error, mutate} = useSWR("/api/getMessages", fetcher)

    const addMessage = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!input) return;

        //! really nice way of implementing form input submit

        const messageToSend = input;
        setInput('');

        const id = uuid();

        if(!session || !input) return;
        
        const message: Message = {
            id,
            message: messageToSend,
            created_at: Date.now(),
            username: session?.user?.name!,
            profilePic: session?.user?.image!,  
            email: session?.user?.email!,
        };

        const uploadMessageToUpstash = async () => {
            const data = await fetch('/api/addMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                }),
            }).then(res => res.json())
            return [data.message, ...messages!];
        };
        await mutate(uploadMessageToUpstash, {
            optimisticData: [message, ...messages!],
            //if there error, just render previous data
            rollbackOnError: true,
        })
    }

  return (
    <form onSubmit={addMessage} className='fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 border-t border-gray-100 bg-white '>
        <input disabled={!session} id="messageInput" value={input} type="text" onChange={e => setInput(e.target.value)} className='flex-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600
            focus: border-transparent px-5  py-3 disabled:opacity-50 disabled:cursor-not-allowed' placeholder='Enter a message...'/>
        <button disabled={!input} type='submit' className='bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            disabled:opacity-50 disabled:cursor-not-allowed'>
                Send
        </button>
    </form>
  )
}

export default ChatInput