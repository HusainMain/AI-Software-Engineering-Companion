export interface ProviderManager {
  complete(prompt: string): Promise<string>;
}

export function createProviderManager(): ProviderManager {
  function complete(prompt: string): Promise<string> {
    const firstLine = prompt.split('\n').find((line) => line.trim().length > 0) ?? 'Ready.';
    return Promise.resolve(`Foundation response prepared. ${firstLine}`);
  }

  return { complete };
}
