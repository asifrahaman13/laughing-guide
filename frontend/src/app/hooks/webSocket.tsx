import React from "react";
import { useRef, useState } from "react";
interface WebSocketStatus {
  message: string;
  status: boolean;
}
const useWebSocket = (
  url: string,
  onMessage: (event: MessageEvent) => void,
  onOpen?: (event: Event) => void,
  onClose?: (event: CloseEvent) => void,
) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>({
    message: "",
    status: false,
  });

  React.useEffect(() => {
    const websocket = new WebSocket(url);
    websocketRef.current = websocket;

    websocket.onopen = (event: Event) => {
      console.log("Connected to websocket");
      if (onOpen) {
        onOpen(event);
      }
    };

    websocket.onmessage = (event: MessageEvent) => {
      onMessage(event);
    };

    websocket.onclose = (event: CloseEvent) => {
      console.log("Disconnected from websocket");
      if (onClose) {
        onClose(event);
      }
    };

    return () => {
      websocket.close();
    };
  }, [url, onMessage, onOpen, onClose]);

  return { websocketRef, status, setStatus };
};

export default useWebSocket;
