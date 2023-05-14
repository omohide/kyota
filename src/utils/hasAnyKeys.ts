import { Collection } from 'discord.js';
import { DataManager } from 'discord.js';

export const hasAnyKeys = <T>(target: Array<T> | Collection<T, unknown> | DataManager<T, unknown, unknown>, ...elements: readonly T[]): boolean => {
  const keys = (
    target instanceof Collection ? target
      : target instanceof DataManager ? target.cache
        : new Set(target)
  );

  return elements.some(e => keys.has(e));
};
