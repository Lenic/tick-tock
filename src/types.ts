export interface TaskInfo {
  taskId: number | null;
  macroId: ReturnType<typeof setTimeout> | null;
}

export interface RelativeTimeTask {
  next: number;
  action: (now: number) => number;
}
