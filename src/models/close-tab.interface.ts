export interface CloseTab {
  name: string;
  description?: string;
  url: string;
  duration: number;
  isActive?: boolean;
}

export interface TabRemainTime {
  tabId?: number;
  name?: string;
  startTime?: Date;
  duration?: number;
}
