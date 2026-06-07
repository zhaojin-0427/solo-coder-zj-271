import { useDailyStore } from '../../store/dailyStore';
import { weekDayConfigs } from '../config/dayConfigs';
import { businessEventConfigs } from '../config/businessEvents';

export class WeekEventSystem {
  private lastEventTime = 0;
  private lastSpawnTime = 0;
  private lastStaffActionTime = 0;
  private running = false;
  private rafId: number | null = null;
  private lastFrameTime = 0;

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.lastEventTime = performance.now();
    this.lastSpawnTime = performance.now();
    this.lastStaffActionTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  reset() {
    this.lastEventTime = performance.now();
    this.lastSpawnTime = performance.now();
    this.lastStaffActionTime = performance.now();
  }

  private loop = () => {
    if (!this.running) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const state = useDailyStore.getState();

    if (!state.isPaused && state.timeRemaining > 0) {
      useDailyStore.getState().tick(delta);

      const dayIndex = Math.min(state.day - 1, weekDayConfigs.length - 1);
      const dayConfig = weekDayConfigs[dayIndex];
      const eventCfg = businessEventConfigs[state.businessEvent];
      const spawnRate = dayConfig.customerSpawnRate / eventCfg.customerSpawnMultiplier;

      if (now - this.lastSpawnTime > spawnRate) {
        useDailyStore.getState().spawnCustomer();
        this.lastSpawnTime = now;
      }

      if (now - this.lastEventTime > 10000 && Math.random() < dayConfig.eventFrequency) {
        this.triggerRandomEvent();
        this.lastEventTime = now;
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private triggerRandomEvent() {
    const events = [
      { type: 'catSick' as const, msg: '😿 有只猫咪生病了!快给它治疗吧~' },
      { type: 'customerComplaint' as const, msg: '😤 有顾客投诉了!满意度下降...' },
      { type: 'machineBreak' as const, msg: '🔧 咖啡机坏了!快修好吧~' },
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    useDailyStore.getState().triggerEvent(randomEvent.type, randomEvent.msg);
  }
}

export const weekEventSystem = new WeekEventSystem();
