import 'reflect-metadata';
import { Service } from 'typedi';

import { TimeOutFn } from 'src/models/close-tab.interface';

@Service()
export class TimeOutFnService {
  public async getAll(): Promise<TimeOutFn[]> {
    const timeOutFnsResult = await chrome.storage.local.get('timeOutFns');
    return (timeOutFnsResult.timeOutFns as TimeOutFn[]) || [];
  }

  public async getOne(key: string): Promise<TimeOutFn | null> {
    const timeOutFns = await this.getAll();
    return timeOutFns.find((timeOutFn) => timeOutFn.key === key) || null;
  }

  public async save(timeOutFns: TimeOutFn[]): Promise<TimeOutFn[]> {
    await chrome.storage.local.set({ timeOutFns });
    return timeOutFns;
  }

  public async add(timeOutFnInput: TimeOutFn): Promise<TimeOutFn | null> {
    const timeOutFns = await this.getAll();
    if (timeOutFns.some((timeOutFn) => timeOutFnInput.key === timeOutFn.key)) {
      return null;
    }
    timeOutFns.push(timeOutFnInput);
    await this.save(timeOutFns);
    return timeOutFnInput;
  }

  public async delete(key: string) {
    let timeOutFns = await this.getAll();
    timeOutFns = timeOutFns.filter((timeOutFn) => !(timeOutFn.key === key));
    await this.save(timeOutFns);
  }
}
