import { Component } from '@angular/core';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false,
})
export class HomePage {
  timerDisplay = '';
  isRunning = false;

  constructor(private pomodoroService: PomodoroService) {}

  async startPomodoro() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.pomodoroService.startTimer(25 * 60, (time) => {
      this.timerDisplay = time;
    }, async () => {
      await this.pomodoroService.sendNotification('Pomodoro finished! Time for a break.');
      this.startBreak();
    });
  }

  async startBreak() {
    this.pomodoroService.startTimer(5 * 60, (time) => {
      this.timerDisplay = time;
    }, async () => {
      await this.pomodoroService.sendNotification('Break finished! Ready for another Pomodoro.');
      this.reset();
    });
  }

  reset() {
    this.isRunning = false;
    this.timerDisplay = '';
  }
}
