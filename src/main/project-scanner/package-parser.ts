import type { PackageJsonInfo } from './types.js';

export function parsePackageJson(content: string): PackageJsonInfo | null {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!isPackageJsonObject(parsed)) {
      return null;
    }

    return {
      name: readString(parsed.name),
      version: readString(parsed.version),
      description: readString(parsed.description),
      main: readString(parsed.main),
      scripts: readStringRecord(parsed.scripts),
      dependencies: readStringRecord(parsed.dependencies),
      devDependencies: readStringRecord(parsed.devDependencies),
      peerDependencies: readStringRecord(parsed.peerDependencies),
      workspaces: readStringArray(parsed.workspaces),
      engines: readStringRecord(parsed.engines),
      license: readString(parsed.license),
      repository: readRepository(parsed.repository),
      author: readAuthor(parsed.author),
    };
  } catch {
    return null;
  }
}

function isPackageJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readStringRecord(value: unknown): Record<string, string> {
  if (!isPackageJsonObject(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
}

function readStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;
}

function readRepository(value: unknown): PackageJsonInfo['repository'] {
  if (typeof value === 'string') {
    return value;
  }

  if (isPackageJsonObject(value) && typeof value.type === 'string' && typeof value.url === 'string') {
    return { type: value.type, url: value.url };
  }

  return undefined;
}

function readAuthor(value: unknown): PackageJsonInfo['author'] {
  if (typeof value === 'string') {
    return value;
  }

  if (!isPackageJsonObject(value) || typeof value.name !== 'string') {
    return undefined;
  }

  return {
    name: value.name,
    email: readString(value.email) ?? '',
    url: readString(value.url) ?? '',
  };
}

export function getAllDependencies(pkg: PackageJsonInfo): Record<string, string> {
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };
}

export function getDependencyNames(pkg: PackageJsonInfo): string[] {
  return Object.keys(getAllDependencies(pkg));
}

export function hasDependency(pkg: PackageJsonInfo, name: string): boolean {
  const allDeps = getAllDependencies(pkg);
  return name in allDeps;
}

export function getScripts(pkg: PackageJsonInfo): Record<string, string> {
  return pkg.scripts || {};
}

export function getScriptNames(pkg: PackageJsonInfo): string[] {
  return Object.keys(getScripts(pkg));
}
