import { WebSocketServer } from 'ws';
import { INIT_GAME } from './message.js';
import { questions } from './getQuestions.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log("Connected")
  ws.on('error', console.error);

  ws.on('message', function message(data) {
   console.log("CAME")
    async function ques(){
      if(data.toString()=== INIT_GAME){
      console.log("REANNNN")
      const question =await  questions( 'recurrsion' , 'easy' , 'single correct' , 'javascript' , 5 )
      console.log("questions:" , question)
    }
    else{
      console.log("not init-game")
    }
    }
    ques();
    console.log('received: %s', data);
  });

  ws.send('something');
});