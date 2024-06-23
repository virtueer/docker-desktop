import { OnApplicationBootstrap } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { exec } from 'child_process';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnApplicationBootstrap {
  @WebSocketServer()
  server: Server;

  onApplicationBootstrap() {
    const command = 'docker events --format json';
    const child = exec(command);

    child.stdout.on('data', (data) => {
      const lines = data.trim().split(/\r?\n/);

      for (const line of lines) {
        for (const [, socket] of this.server.sockets.sockets) {
          try {
            socket.emit('events', JSON.parse(line));
          } catch (error) {
            console.log(error);
            console.log('ERROR JSON -->', line, '<--');
          }
        }
      }
    });
  }
}
