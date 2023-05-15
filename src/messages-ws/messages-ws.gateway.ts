import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({
  cors: true,
  // ,namespace:'/productos'
})
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(
    client: Socket,

    // , ...args: any[]
  ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      // throw new
      client.disconnect();
      return;
    }

    // console.log({ payload });
    // console.log({ token });
    // console.log(client);
    // this.messagesWsService.registerClient(client, payload.id);

    // client.join('ventas');
    // client.join(client.id);
    // client.join(user.email);
    // this.wss.to('ventas').emit('');

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );

    // console.log('Cliente Conectado', client.id);
    // throw new Error('Method not implemented.');
    // console.log(object);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    // throw new Error('Method not implemented.');
    // console.log('Cliente desconectado', client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  // "message-from-client"
  @SubscribeMessage('message-from-client')
  async onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);
    // !Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!!',
    //   message: payload.message || ' no-message!!',
    // });

    // !emitir a todos menos al cliente inciial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo!!',
    //   message: payload.message || ' no-message!!',
    // });

    // this.wss.to('clientID')
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || ' no-message!!',
    });
  }
}
