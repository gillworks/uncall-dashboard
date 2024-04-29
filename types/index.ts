export type Call = {
  id: string;
  tasks: {
    name: string;
    assistants: {
      name: string;
    };
  };
  summary: string;
  transcript: string;
  startedAt: string;
  endedAt: string;
  transcribed: boolean;
  status: string;
  recordingUrl: string;
  type: 'inbound' | 'outbound';
  read: boolean;
};
