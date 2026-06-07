import { useGameStore } from '../../store/gameStore';
import type { EventType } from '../types/game';
import { dayConfigs } from '../config/dayConfigs';

const eventMessages: Record<Exclude<EventType, null>, string> = {
  catSick: '😿 有只猫咪生病了!快给它治疗吧~',
  customerComplaint: '😤 有顾客投诉了!满意度下降...',
  machineBreak: '🔧 咖啡机坏了!快修好吧~',
  holiday: '🎉 节假日客流高峰!收入增加30%!',
};

export class EventSystem {
  private lastEventTime = 0;
  private lastSpawnTime = 0;
  private running = false;
  private rafId: number | null = null;
  private lastFrameTime = 0;

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.lastEventTime = performance.now();
    this.lastSpawnTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = () => {
    if (!this.running) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const state = useGameStore.getState();
    
    if (!state.isPaused && state.timeRemaining > 0) {
      useGameStore.getState().tick(delta);

      const config = dayConfigs[state.difficulty];
      const spawnRate = state.isHoliday ? config.customerSpawnRate * 0.6 : config.customerSpawnRate;
      
      if (now - this.lastSpawnTime > spawnRate) {
        useGameStore.getState().spawnCustomer();
        this.lastSpawnTime = now;
      }

      if (now - this.lastEventTime > 10000 && Math.random() < config.eventFrequency) {
        this.triggerRandomEvent();
        this.lastEventTime = now;
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private triggerRandomEvent() {
    const events: Exclude<EventType, null>[] = ['catSick', 'customerComplaint', 'machineBreak'];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    useGameStore.getState().triggerEvent(randomEvent, eventMessages[randomEvent]);
  }

  reset() {
    this.lastEventTime = performance.now();
    this.lastSpawnTime = performance.now();
  }
}

export const eventSystem = new EventSystem();
