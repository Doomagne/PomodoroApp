import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private timer: any;
  private totalSeconds: number = 0;

  startTimer(duration: number, onTick: (time: string) => void, onComplete: () => void) {
    this.totalSeconds = duration;
    this.updateDisplay(onTick);

    this.timer = setInterval(async () => {
      this.totalSeconds--;
      this.updateDisplay(onTick);

      if (this.totalSeconds <= 0) {
        clearInterval(this.timer);
        onComplete();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  async sendNotification(message: string) {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Pomodoro App',
          body: message,
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 100) }
        }
      ]
    });

    await Haptics.vibrate();
  }

  private updateDisplay(callback: (time: string) => void) {
    const minutes = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.totalSeconds % 60).toString().padStart(2, '0');
    callback(`${minutes}:${seconds}`);
  }
}
