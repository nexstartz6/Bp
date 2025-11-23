
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AITool {
  Chat = 'Chat',
  Image = 'Image',
  Quick = 'Quick',
}
