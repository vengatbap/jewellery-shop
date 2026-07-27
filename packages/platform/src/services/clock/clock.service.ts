export class ClockService {
      private static simulatedTime: Date | null = null;

      static now(): Date {
          if (this.simulatedTime) {
              return new Date(this.simulatedTime);
          }
          return new Date();
      }

      static setSimulatedTime(time: Date | null): void {
          this.simulatedTime = time;
      }
  }
