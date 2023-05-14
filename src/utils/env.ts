export type EnvValidateOptions<K extends keyof NodeJS.ProcessEnv> = Partial<{
  pattern: RegExp,
  loadErrorMessageCreator: (name: K) => string,
  patternMatchErrorMessageCreator: (name: K, pattern: RegExp) => string
}>;

export const env = <K extends keyof NodeJS.ProcessEnv>(
  name: K,
  {
    pattern,
    loadErrorMessageCreator = name => `Environment variable "${name}" has no value set`,
    patternMatchErrorMessageCreator = (name, pattern) => `The value of the environment variable "${name}" does not match the pattern ${pattern}`
  }: EnvValidateOptions<K> = {}
): NodeJS.ProcessEnv[K] => {
  const value = process.env[name];

  if (typeof value === 'undefined') {
    throw new TypeError(loadErrorMessageCreator(name));
  }

  if (pattern?.test(value)) {
    throw new TypeError(patternMatchErrorMessageCreator(name, pattern));
  }

  return value;
};
