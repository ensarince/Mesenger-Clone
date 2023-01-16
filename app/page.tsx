import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { Message } from '../typings';
import { unstable_getServerSession } from 'next-auth';
import Providers from './providers';

//we can make this async func since we using server side components
//!server side rendering but not sure still how we did it??
async function Homepage() {
  //default url when deploy
  const data = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000/"}/api/getMessages`).then(
    (res) => res.json()
  );

  const messages: Message[] = data.messages;
  const session = await unstable_getServerSession()

  return (
    <Providers session={session}>
    <main>
        <MessageList initialMessages = {messages} />
        <ChatInput session={session} />
    </main>
    </Providers>
 )
} 

export default Homepage