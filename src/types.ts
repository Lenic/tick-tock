export interface TaskInfo {
  taskId: number | null;
  batchCount: number;
  macroId: ReturnType<typeof setTimeout> | null;
}

export interface RelativeTimeTask {
  next: number;
  action: (now: number) => number;
}
