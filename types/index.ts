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
  createdAt: string;
  transcribed: boolean;
  status: string;
  recordingUrl: string;
  type: 'inbound' | 'outbound';
  read: boolean;
};

export type Assistant = {
  id: string;
  name: string;
};

export type Number = {
  id: string;
  name: string;
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  assistants: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};
