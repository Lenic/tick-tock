import type { RelativeTimeTask, TaskInfo } from './types';

import { unstable_batchedUpdates } from 'react-dom';

import { PriorityQueue } from './heap';

const config: TaskInfo = { taskId: null, macroId: null, batchCount: 10 };
const pq = new PriorityQueue<RelativeTimeTask>((x, y) => x.next - y.next);

const refreshComponent = () => {
  config.taskId = null;
  config.macroId = null;
  if (pq.isEmpty()) return;

  let isChanged = false;

  const min = Math.min(config.batchCount, pq.size());
  unstable_batchedUpdates(() => {
    for (let i = 0; i < min; i++) {
      const value = pq.peek();
      if (value) {
        const now = Date.now();
        if (value.next > now) break;

        isChanged = true;
        value.next = value.action(now);

        pq.heap.down(0);
      }
    }
  });

  if (isChanged) {
    config.taskId = requestIdleCallback(refreshComponent);
  } else {
    const minTime = pq.list.reduce((acc, x) => Math.min(acc, x.next), Infinity);
    config.macroId = setTimeout(refreshComponent, minTime - Date.now());
  }
};

const getNextTime = (time: number, now: number) => {
  let interval = now - time;

  if (interval < 1000 * 60) {
    interval = 1000;
  } else if (interval >= 1000 * 60 && interval < 1000 * 60 * 60) {
    interval = 1000 * 60;
  } else if (interval >= 1000 * 60 * 60) {
    interval = 1000 * 60 * 60;
  }

  return interval + now;
};

export const resigter = (time: number, updateAction: () => void) => {
  const task: RelativeTimeTask = {
    next: getNextTime(time, Date.now()),
    action: (now) => {
      updateAction();
      return getNextTime(time, now);
    },
  };
  pq.offer(task);

  // start
  if (config.macroId !== null) {
    clearTimeout(config.macroId);
    refreshComponent();
  } else if (config.taskId === null) {
    refreshComponent();
  }

  return () => {
    const index = pq.list.findIndex((v) => v === task);
    if (index < 0) return;

    pq.poll(index);
  };
};
