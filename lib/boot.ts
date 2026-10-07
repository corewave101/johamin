// What the intro screen waits for: the background video, pictures, fonts and the card database.
// Each part reports its own progress; the intro shows the average and opens when nothing is pending.
type Task = { progress: number; done: boolean };
const tasks = new Map<string, Task>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

export type LoadHandle = { progress(value: number): void; done(): void };

export function trackLoad(name: string): LoadHandle {
  const task: Task = { progress: 0, done: false };
  tasks.set(name, task);
  notify();
  return {
    progress(value) {
      if (task.done || !(value > task.progress)) return;
      task.progress = Math.min(1, value);
      notify();
    },
    done() {
      if (task.done) return;
      task.done = true;
      task.progress = 1;
      notify();
    },
  };
}

/** Tracks a promise; success or failure both count as finished (the app works without any one part). */
export function trackPromise(name: string, promise: Promise<unknown>) {
  const task = trackLoad(name);
  promise.then(task.done, task.done);
  return promise;
}

/** Loads a picture into the browser cache. Never rejects. */
export function preloadImage(src: string) {
  return new Promise<void>(resolve => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = src;
  });
}

export function loadState() {
  let sum = 0, pending = 0;
  for (const task of tasks.values()) {
    sum += task.progress;
    if (!task.done) pending++;
  }
  return { progress: tasks.size ? sum / tasks.size : 1, pending, total: tasks.size };
}

export function onLoadChange(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** For tests. */
export function resetLoads() { tasks.clear(); notify(); }
