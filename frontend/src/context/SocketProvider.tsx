import { type ReactElement, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import type { ChildrenProps } from '@/util/props';
import { socketContext } from '@/context/socket';
import type { ScenarioEventKey } from '@/util/api';

export const SocketProvider = ({ children }: ChildrenProps): ReactElement => {
  const socketRef = useRef<Socket | null>(null);

  const emitEvent = (eventKey: ScenarioEventKey): void => {
    console.log(`Emitting event: ${eventKey}`);

    if (socketRef.current) {
      socketRef.current.emit(eventKey);
    }
  };

  return (
    <socketContext.Provider value={{ socketRef: socketRef, emitEvent }}>
      {children}
    </socketContext.Provider>
  );
};
