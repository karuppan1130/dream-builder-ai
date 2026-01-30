// Voice Assistant using Web Speech API

export interface VoiceCommand {
  command: string;
  action: string;
  params?: Record<string, string>;
}

// Command patterns for English
const ENGLISH_COMMANDS: Record<string, { patterns: RegExp[]; action: string }> = {
  addRoom: {
    patterns: [
      /add\s+(a\s+)?(\w+)/i,
      /create\s+(a\s+)?(\w+)/i,
      /new\s+(\w+)/i,
    ],
    action: 'ADD_ROOM',
  },
  deleteRoom: {
    patterns: [
      /delete\s+(the\s+)?(\w+)/i,
      /remove\s+(the\s+)?(\w+)/i,
    ],
    action: 'DELETE_ROOM',
  },
  show3D: {
    patterns: [
      /show\s+3d/i,
      /view\s+in\s+3d/i,
      /3d\s+view/i,
      /open\s+3d/i,
    ],
    action: 'SHOW_3D',
  },
  save: {
    patterns: [
      /save\s+(the\s+)?blueprint/i,
      /save\s+project/i,
      /save/i,
    ],
    action: 'SAVE',
  },
  undo: {
    patterns: [
      /undo/i,
      /go\s+back/i,
    ],
    action: 'UNDO',
  },
  redo: {
    patterns: [
      /redo/i,
    ],
    action: 'REDO',
  },
  changeLanguage: {
    patterns: [
      /change\s+language\s+to\s+(\w+)/i,
      /switch\s+to\s+(\w+)/i,
      /speak\s+(\w+)/i,
    ],
    action: 'CHANGE_LANGUAGE',
  },
  help: {
    patterns: [
      /help/i,
      /what\s+can\s+you\s+do/i,
      /commands/i,
    ],
    action: 'HELP',
  },
  newProject: {
    patterns: [
      /new\s+project/i,
      /create\s+project/i,
      /start\s+new/i,
    ],
    action: 'NEW_PROJECT',
  },
  goToDashboard: {
    patterns: [
      /go\s+to\s+dashboard/i,
      /open\s+dashboard/i,
      /dashboard/i,
    ],
    action: 'GO_DASHBOARD',
  },
  export: {
    patterns: [
      /export/i,
      /download/i,
    ],
    action: 'EXPORT',
  },
};

// Command patterns for Tamil
const TAMIL_COMMANDS: Record<string, { patterns: RegExp[]; action: string }> = {
  addRoom: {
    patterns: [
      /அறை\s+சேர்/i,
      /(\w+)\s+சேர்/i,
    ],
    action: 'ADD_ROOM',
  },
  show3D: {
    patterns: [
      /3d\s+காட்டு/i,
      /முப்பரிமாண\s+காட்சி/i,
    ],
    action: 'SHOW_3D',
  },
  save: {
    patterns: [
      /சேமி/i,
    ],
    action: 'SAVE',
  },
  help: {
    patterns: [
      /உதவி/i,
    ],
    action: 'HELP',
  },
};

export class VoiceAssistant {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private language: string = 'en-US';
  private onCommand: ((command: VoiceCommand) => void) | null = null;
  private onStateChange: ((state: 'listening' | 'processing' | 'idle') => void) | null = null;
  private onTranscript: ((text: string) => void) | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition!.continuous = false;
    this.recognition!.interimResults = true;
    this.recognition!.lang = this.language;

    this.recognition!.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (this.onTranscript) {
        this.onTranscript(transcript);
      }

      // Process final result
      if (event.results[event.results.length - 1].isFinal) {
        this.processCommand(transcript);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChange) {
        this.onStateChange('listening');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChange) {
        this.onStateChange('idle');
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (this.onStateChange) {
        this.onStateChange('idle');
      }
    };
  }

  public setLanguage(lang: 'en' | 'ta') {
    this.language = lang === 'ta' ? 'ta-IN' : 'en-US';
    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  public onCommandReceived(callback: (command: VoiceCommand) => void) {
    this.onCommand = callback;
  }

  public onStateChanged(callback: (state: 'listening' | 'processing' | 'idle') => void) {
    this.onStateChange = callback;
  }

  public onTranscriptReceived(callback: (text: string) => void) {
    this.onTranscript = callback;
  }

  public startListening() {
    if (!this.recognition) {
      console.warn('Speech Recognition not available');
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private processCommand(transcript: string) {
    if (this.onStateChange) {
      this.onStateChange('processing');
    }

    const commands = this.language.startsWith('ta') ? TAMIL_COMMANDS : ENGLISH_COMMANDS;
    
    for (const [key, config] of Object.entries(commands)) {
      for (const pattern of config.patterns) {
        const match = transcript.match(pattern);
        if (match) {
          const command: VoiceCommand = {
            command: transcript,
            action: config.action,
            params: {},
          };

          // Extract parameters based on capture groups
          if (match.length > 1) {
            if (config.action === 'ADD_ROOM' || config.action === 'DELETE_ROOM') {
              command.params = { roomType: match[match.length - 1].toLowerCase() };
            } else if (config.action === 'CHANGE_LANGUAGE') {
              command.params = { language: match[1].toLowerCase() };
            }
          }

          if (this.onCommand) {
            this.onCommand(command);
          }

          // Provide audio feedback
          this.speak(this.getResponseMessage(config.action));
          return;
        }
      }
    }

    // Command not recognized
    this.speak(this.language.startsWith('ta') 
      ? 'மன்னிக்கவும், கட்டளை புரியவில்லை' 
      : "Sorry, I didn't understand that command");
  }

  private getResponseMessage(action: string): string {
    const isEnglish = this.language.startsWith('en');
    
    const messages: Record<string, { en: string; ta: string }> = {
      ADD_ROOM: { en: 'Adding room', ta: 'அறை சேர்க்கப்படுகிறது' },
      DELETE_ROOM: { en: 'Removing room', ta: 'அறை நீக்கப்படுகிறது' },
      SHOW_3D: { en: 'Opening 3D view', ta: '3D காட்சி திறக்கப்படுகிறது' },
      SAVE: { en: 'Saving project', ta: 'திட்டம் சேமிக்கப்படுகிறது' },
      UNDO: { en: 'Undoing last action', ta: 'கடைசி செயல் செயல்தவிர்க்கப்படுகிறது' },
      REDO: { en: 'Redoing', ta: 'மீண்டும் செய்கிறது' },
      HELP: { en: 'You can say commands like add bedroom, show 3D, save project, or change language', ta: 'படுக்கையறை சேர், 3D காட்டு, சேமி போன்ற கட்டளைகளை சொல்லலாம்' },
      NEW_PROJECT: { en: 'Creating new project', ta: 'புதிய திட்டம் உருவாக்கப்படுகிறது' },
      GO_DASHBOARD: { en: 'Going to dashboard', ta: 'டாஷ்போர்டுக்கு செல்கிறது' },
      EXPORT: { en: 'Exporting blueprint', ta: 'வரைபடம் ஏற்றுமதி செய்யப்படுகிறது' },
      CHANGE_LANGUAGE: { en: 'Changing language', ta: 'மொழி மாற்றப்படுகிறது' },
    };

    const message = messages[action];
    return message ? (isEnglish ? message.en : message.ta) : (isEnglish ? 'Command received' : 'கட்டளை பெறப்பட்டது');
  }

  public speak(text: string) {
    if (!this.synthesis) {
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language;
    utterance.rate = 1;
    utterance.pitch = 1;

    // Try to find a voice for the language
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(this.language.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    this.synthesis.speak(utterance);
  }

  public isSupported(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}

// Singleton instance
export const voiceAssistant = new VoiceAssistant();

// Type declarations for Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
