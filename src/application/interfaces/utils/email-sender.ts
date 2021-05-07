export interface EmailSender {
  send: (to: string, subject: string, content: string) => Promise<void>;
}
