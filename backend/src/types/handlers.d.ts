declare module './src/socket/handlers/host.handler' {
  export default function hostHandler(io: any, socket: any): void;
}

declare module './src/socket/handlers/player.handler' {
  export default function playerHandler(io: any, socket: any): void;
}

declare module './src/socket/handlers/timer.handler' {
  export default function timerHandler(io: any, socket: any): void;
}

declare module './src/socket/handlers/disconnect.handler' {
  export default function disconnectHandler(io: any, socket: any): void;
}

declare module './src/socket/handlers/game.handler' {
  export default function gameHandler(io: any, socket: any): void;
}