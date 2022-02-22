export interface CloseTab {
  name: string;
  description?: string;
  url: string;
  duration: number;
  isActive?: boolean;
}

export interface TabRemainTime {
  tabId: number;
  windowId: number;
  name: string;
  startTime: number;
  duration: number;
}

export interface TimeOutFn {
  key: string;
  value: NodeJS.Timeout;
}
