import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: unknown, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    // In a real application, you might want to:
    // - Log to a remote logging service
    // - Show user-friendly error messages
    // - Send telemetry data
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  }

  logError(message: string, data?: any): void {
    console.error(message, data);
  }

  logWarning(message: string, data?: any): void {
    console.warn(message, data);
  }

  logInfo(message: string, data?: any): void {
    console.info(message, data);
  }
}