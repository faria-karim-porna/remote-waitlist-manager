import { useEffect } from "react";
import { useWaitlist } from "../contexts/WaitlistContext";

const useWebSocket = (partyId: string | null) => {
  const { updateMessage } = useWaitlist();

  useEffect(() => {
    if (partyId) {
      const ws = new WebSocket("ws://localhost:5000");

      ws.onopen = () => {
        console.log("WebSocket connection established");
        ws.send(JSON.stringify({ partyId }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateMessage(data.message);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
      };
    }
  }, [partyId, updateMessage]);
};

export default useWebSocket;
