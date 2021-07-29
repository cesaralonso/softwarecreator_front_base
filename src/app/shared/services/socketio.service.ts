import { CommonService } from './../common.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import * as socketIo from 'socket.io-client';
import { Action, User, Message, Event } from '../models';


@Injectable()
export class SocketIOService {
    serverUrl: string;
    user: any;

    constructor(
        private authService: AuthService,
        private commonService: CommonService) {
        this.serverUrl = environment.server;
        // usuario
        this.user = this.authService.useJwtHelper();
    }

    private socket;
    initSocket(): void {
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000, //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"],
            "path": "http://localhost:3000/socket.io"
        };
        this.socket = socketIo(this.serverUrl);
    }
    send(message: Message): void {
        // FECHA Y HORA ACTUAL
        const date = new Date();
        const dateAndHour = this.commonService.getDateAndHour(date);

        // Send it now
        message['from'] = this.user;
        message['date'] = dateAndHour.fecha;
        message['hour'] = dateAndHour.hora;

        console.log('send message', message);
        this.socket.emit('message', message);
    }
    onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            console.log('onMessage');
            this.socket.on('message', (data: Message) => {
                    console.log('onMessage data', data);
                    observer.next(data);
                });
        });
    }
    onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
