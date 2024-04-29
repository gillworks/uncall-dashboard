export const calls = [
  {
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    assistant: 'William Smith',
    task: 'Meeting Tomorrow',
    summary:
      "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    transcript:
      "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    startedAt: '2023-10-22T09:00:00',
    endedAt: '2023-10-22T10:00:00',
    transcribed: true,
    status: 'completed',
    recordingUrl:
      'http://example.com/recording/6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    type: 'inbound',
    read: true
  },
  {
    id: '110e8400-e29b-11d4-a716-446655440000',
    assistant: 'Alice Smith',
    task: 'Project Update',
    summary:
      "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
    transcript:
      "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
    startedAt: '2023-10-22T10:30:00',
    endedAt: '2023-10-22T11:30:00',
    transcribed: true,
    status: 'completed',
    recordingUrl:
      'http://example.com/recording/110e8400-e29b-11d4-a716-446655440000',
    type: 'inbound',
    read: false
  },
  {
    id: '3e7c3f6d-bdf5-46ae-8d90-171300f27ae2',
    assistant: 'Bob Johnson',
    task: 'Weekend Plans',
    summary: null,
    transcript: null,
    startedAt: '2023-04-10T11:45:00',
    endedAt: null,
    transcribed: false,
    status: 'in progress',
    recordingUrl: null,
    type: 'outbound',
    read: true
  }
];

export type Call = (typeof calls)[number];
