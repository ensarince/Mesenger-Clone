// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../redis';
import { Message } from '../../typings';

//use type we created and declare the data with that
type Data = {
  messages: Message[];
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
      if(req.method !== 'GET'){
        res.status(405).json({body: 'Method Not Allowed'})
        return;
    }

    //get the data, parse it and sort it, put it in array and return that array
    const messagesRes = await redis.hvals('messages')
    const messages: Message[] = 
      messagesRes.map((message) => 
      JSON.parse(message)).sort((a, b) => a.created_at - b.created_at)

    res.status(200).json({ messages })
}
