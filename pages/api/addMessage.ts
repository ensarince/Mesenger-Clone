// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { serverPusher } from '../../pusher';
import redis from '../../redis';
import { Message } from '../../typings';

//use type we created and declare the data with that
type Data = {
  message: Message;
}
//declare error too
type ErrorData = {
    body: string
}

export default async function handler(
//declare request and response
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
    //control request type
    if(req.method !== 'POST'){
        res.status(405).json({body: 'Method Not Allowed'})
        return;
    }

    const {message} = req.body;

    const newMessage = {
        ...message,
        //replacing time stamp user had with the local server
        created_at: Date.now()
    }

    //push to upstash redis db
    await redis.hset('messages', message.id, JSON.stringify(newMessage))

    //trigger pusher 
    serverPusher.trigger('messages', 'new-message', newMessage)

    res.status(200).json({ message: newMessage })
}
