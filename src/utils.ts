import type { RelativeTimeTask, TaskInfo } from './types';

const list: RelativeTimeTask[] = [];
const config: TaskInfo = { taskId: null, macroId: null };

const refreshComponent = () => {
  config.taskId = null;
  config.macroId = null;
  if (!list.length) return;

  let isChanged = false;
  const now = Date.now();
  for (let index = 0; index < list.length; index++) {
    const value = list.shift()!;
    list.push(value);

    if (value.next <= now) {
      isChanged = true;

      value.next = value.action(now);

      break;
    }
  }

  if (isChanged) {
    config.taskId = requestIdleCallback(refreshComponent);
  } else {
    const minTime = list.reduce((acc, x) => Math.min(acc, x.next), Infinity);
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
  list.push(task);

  // start
  if (config.macroId !== null) {
    clearTimeout(config.macroId);
    refreshComponent();
  } else if (config.taskId === null) {
    refreshComponent();
  }

  return () => {
    const index = list.findIndex((v) => v === task);
    if (index < 0) return;

    list.splice(index, 1);
  };
};
