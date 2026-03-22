export class Logger {
  context: string
  isEnabled = false

  constructor(context: 'api' | 'comment' | 'cli') {
    this.context = context
  }

  enable(value = true) {
    this.isEnabled = value
  }

  getMessage(...messages: unknown[]) {
    return [
      `[changesets-gitlab:${this.context}]`,
      ...messages.map((w) =>
        w instanceof Error ? `${w.name}: ${w.message}` : w
      ),
    ]
  }

  print(...message: unknown[]) {
    if (this.isEnabled) {
      console.log(...this.getMessage(...message))
    }
  }
}
