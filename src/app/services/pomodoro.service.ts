import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private timerInterval: any;
  private isWorkTime = true;
  private isRunning = false;

  public remainingSeconds: number = 0;

  // Exposed getters for component access
  public get running() {
    return this.isRunning;
  }

  public get workMode() {
    return this.isWorkTime;
  }

  startTimer(duration: number, onTick: (seconds: number) => void, onDone: () => void) {
    this.remainingSeconds = duration;
    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      onTick(this.remainingSeconds);

      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        onDone();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
  }

  reset(duration: number) {
    this.stopTimer();
    this.remainingSeconds = duration;
    this.isWorkTime = true;
  }

  switchToBreak(breakDuration: number, onTick: (seconds: number) => void, onDone: () => void) {
    this.isWorkTime = false;
    this.startTimer(breakDuration, onTick, onDone);
  }

  switchToWork(workDuration: number, onTick: (seconds: number) => void, onDone: () => void) {
    this.isWorkTime = true;
    this.startTimer(workDuration, onTick, onDone);
  }

  async notify(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [{
        title,
        body,
        id: Date.now(),
      }]
    });

    await Haptics.vibrate({ duration: 500 });
  }
}
