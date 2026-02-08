export interface EmailMessage {
  to: string; // Recipient email address
  subject: string;
  html: string;
  text?: string;
  from?: string; // Optional override
}

export interface EmailResult {
  id: string; // Provider-specific ID
  success: boolean;
  provider: string;
  timestamp: Date;
  error?: any;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailResult>;
}

// Categories for preference checking
export type EmailCategory = 'alerts' | 'summaries' | 'achievements';
