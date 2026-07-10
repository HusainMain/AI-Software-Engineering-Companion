import type { TechnologyInfo, PackageJsonInfo } from './types.js';

interface TechnologyDetector {
  name: string;
  category: TechnologyInfo['category'];
  detect: (pkg: PackageJsonInfo | null, files: string[], rootPath: string) => TechnologyInfo | null;
}

function hasAnyDependency(pkg: PackageJsonInfo, names: string[]): boolean {
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };
  for (const name of names) {
    if (name.includes('*')) {
      const prefix = name.replace('*', '');
      for (const depName of Object.keys(allDeps)) {
        if (depName.startsWith(prefix)) return true;
      }
    } else if (name in allDeps) {
      return true;
    }
  }
  return false;
}

function hasFile(files: string[], patterns: string[]): boolean {
  for (const file of files) {
    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        if (regex.test(file)) return true;
      } else if (file === pattern || file.endsWith('/' + pattern)) {
        return true;
      }
    }
  }
  return false;
}

const DETECTORS: TechnologyDetector[] = [
  {
    name: 'Electron',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['electron', 'electron-builder', '@electron-forge/*', 'electron-updater'])) {
        return { name: 'Electron', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['main.ts', 'main.js', 'main/index.ts', 'main/index.js'])) {
        return { name: 'Electron', category: 'framework', confidence: 'medium', source: 'file-extension' };
      }
      return null;
    },
  },
  {
    name: 'React',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['react', '@types/react', 'react-dom', '@types/react-dom'])) {
        return { name: 'React', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['*.tsx', '*.jsx'])) {
        return { name: 'React', category: 'framework', confidence: 'medium', source: 'file-extension' };
      }
      return null;
    },
  },
  {
    name: 'TypeScript',
    category: 'language',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['typescript', '@types/node', '@types/react'])) {
        return { name: 'TypeScript', category: 'language', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['*.ts', '*.tsx', 'tsconfig.json'])) {
        return { name: 'TypeScript', category: 'language', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'JavaScript',
    category: 'language',
    detect: (_, files) => {
      if (hasFile(files, ['*.js', '*.jsx', '*.mjs', '*.cjs'])) {
        return { name: 'JavaScript', category: 'language', confidence: 'high', source: 'file-extension' };
      }
      return null;
    },
  },
  {
    name: 'Vite',
    category: 'build',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['vite', '@vitejs/plugin-*', '@vitejs/plugin-react', '@vitejs/plugin-vue', '@vitejs/plugin-react-swc'])) {
        return { name: 'Vite', category: 'build', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.cjs'])) {
        return { name: 'Vite', category: 'build', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Node.js',
    category: 'runtime',
    detect: (_, files) => {
      if (hasFile(files, ['package.json'])) {
        return { name: 'Node.js', category: 'runtime', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Bun',
    category: 'runtime',
    detect: (pkg, files) => {
      if (hasFile(files, ['bun.lockb', 'bun.lock'])) {
        return { name: 'Bun', category: 'runtime', confidence: 'high', source: 'config-file' };
      }
      if (pkg && pkg.engines?.bun) {
        return { name: 'Bun', category: 'runtime', confidence: 'high', source: 'package.json' };
      }
      return null;
    },
  },
  {
    name: 'Deno',
    category: 'runtime',
    detect: (_, files) => {
      if (hasFile(files, ['deno.json', 'deno.jsonc', 'import_map.json'])) {
        return { name: 'Deno', category: 'runtime', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Next.js',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['next', '@next/*'])) {
        return { name: 'Next.js', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['next.config.js', 'next.config.ts', 'next.config.mjs'])) {
        return { name: 'Next.js', category: 'framework', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Express',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['express', '@types/express'])) {
        return { name: 'Express', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['server.ts', 'server.js', 'app.ts', 'app.js', 'src/server.ts', 'src/server.js'])) {
        return { name: 'Express', category: 'framework', confidence: 'low', source: 'folder-structure' };
      }
      return null;
    },
  },
  {
    name: 'Vue.js',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['vue', '@vue/*', 'vue-router', 'pinia', 'vuex', 'nuxt'])) {
        return { name: 'Vue.js', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['*.vue'])) {
        return { name: 'Vue.js', category: 'framework', confidence: 'high', source: 'file-extension' };
      }
      return null;
    },
  },
  {
    name: 'Svelte',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['svelte', '@sveltejs/*', 'sveltekit'])) {
        return { name: 'Svelte', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['*.svelte'])) {
        return { name: 'Svelte', category: 'framework', confidence: 'high', source: 'file-extension' };
      }
      return null;
    },
  },
  {
    name: 'Angular',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['@angular/*', 'angular'])) {
        return { name: 'Angular', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['angular.json', '.angular-cli.json'])) {
        return { name: 'Angular', category: 'framework', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Astro',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['astro', '@astrojs/*'])) {
        return { name: 'Astro', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'])) {
        return { name: 'Astro', category: 'framework', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Remix',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['@remix-run/*', 'remix'])) {
        return { name: 'Remix', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['remix.config.js', 'remix.config.ts'])) {
        return { name: 'Remix', category: 'framework', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Tailwind CSS',
    category: 'framework',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['tailwindcss', '@tailwindcss/*', 'tailwind-merge', 'tailwind-variants'])) {
        return { name: 'Tailwind CSS', category: 'framework', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs'])) {
        return { name: 'Tailwind CSS', category: 'framework', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'ESLint',
    category: 'tool',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['eslint', '@eslint/*', 'eslint-plugin-*', 'eslint-config-*'])) {
        return { name: 'ESLint', category: 'tool', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['.eslintrc', '.eslintrc.js', '.eslintrc.ts', '.eslintrc.json', '.eslintrc.yaml', '.eslintrc.yml', 'eslint.config.js', 'eslint.config.ts'])) {
        return { name: 'ESLint', category: 'tool', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Prettier',
    category: 'tool',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['prettier', '@prettier/*', 'prettier-plugin-*'])) {
        return { name: 'Prettier', category: 'tool', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['.prettierrc', '.prettierrc.js', '.prettierrc.ts', '.prettierrc.json', '.prettierrc.yaml', '.prettierrc.yml', 'prettier.config.js', 'prettier.config.ts'])) {
        return { name: 'Prettier', category: 'tool', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Vitest',
    category: 'testing',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['vitest', '@vitest/*', '@vitest/coverage-*'])) {
        return { name: 'Vitest', category: 'testing', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mts', 'vitest.config.mjs'])) {
        return { name: 'Vitest', category: 'testing', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Jest',
    category: 'testing',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['jest', '@jest/*', 'jest-environment-*', 'jest-preset-*', 'ts-jest'])) {
        return { name: 'Jest', category: 'testing', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['jest.config.js', 'jest.config.ts', 'jest.config.mjs', 'jest.config.cjs', 'jest.config.json'])) {
        return { name: 'Jest', category: 'testing', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Playwright',
    category: 'testing',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['@playwright/test', 'playwright', '@playwright/*'])) {
        return { name: 'Playwright', category: 'testing', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['playwright.config.ts', 'playwright.config.js', 'playwright.config.mts'])) {
        return { name: 'Playwright', category: 'testing', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Cypress',
    category: 'testing',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['cypress', '@cypress/*', 'cypress-*'])) {
        return { name: 'Cypress', category: 'testing', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['cypress.config.ts', 'cypress.config.js', 'cypress.json'])) {
        return { name: 'Cypress', category: 'testing', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Storybook',
    category: 'tool',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['@storybook/*', 'storybook', 'storybook-*'])) {
        return { name: 'Storybook', category: 'tool', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['.storybook/main.ts', '.storybook/main.js', '.storybook/main.mts'])) {
        return { name: 'Storybook', category: 'tool', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Turborepo',
    category: 'tool',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['turbo', '@turbo/*'])) {
        return { name: 'Turborepo', category: 'tool', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['turbo.json', 'turbo.jsonc'])) {
        return { name: 'Turborepo', category: 'tool', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Nx',
    category: 'tool',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['nx', '@nx/*', '@nrwl/*'])) {
        return { name: 'Nx', category: 'tool', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['nx.json', 'nx.jsonc', 'workspace.json', 'workspace.jsonc'])) {
        return { name: 'Nx', category: 'tool', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'ESBuild',
    category: 'build',
    detect: (pkg) => {
      if (pkg && hasAnyDependency(pkg, ['esbuild', '@esbuild/*'])) {
        return { name: 'ESBuild', category: 'build', confidence: 'high', source: 'package.json' };
      }
      return null;
    },
  },
  {
    name: 'Webpack',
    category: 'build',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['webpack', 'webpack-*', '@webpack/*'])) {
        return { name: 'Webpack', category: 'build', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['webpack.config.js', 'webpack.config.ts', 'webpack.config.mjs'])) {
        return { name: 'Webpack', category: 'build', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Rollup',
    category: 'build',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['rollup', '@rollup/*', 'rollup-plugin-*'])) {
        return { name: 'Rollup', category: 'build', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['rollup.config.js', 'rollup.config.ts', 'rollup.config.mjs'])) {
        return { name: 'Rollup', category: 'build', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'SWC',
    category: 'build',
    detect: (pkg, files) => {
      if (pkg && hasAnyDependency(pkg, ['@swc/*', 'swc'])) {
        return { name: 'SWC', category: 'build', confidence: 'high', source: 'package.json' };
      }
      if (hasFile(files, ['.swcrc', '.swcrc.json', 'swc.config.js', 'swc.config.ts'])) {
        return { name: 'SWC', category: 'build', confidence: 'high', source: 'config-file' };
      }
      return null;
    },
  },
  {
    name: 'Bun',
    category: 'runtime',
    detect: (pkg) => {
      if (pkg && hasAnyDependency(pkg, ['bun-types', 'bun'])) {
        return { name: 'Bun', category: 'runtime', confidence: 'high', source: 'package.json' };
      }
      return null;
    },
  },
];

export function detectTechnologies(
  packageInfo: PackageJsonInfo | null,
  files: string[],
  rootPath: string
): TechnologyInfo[] {
  const technologies: TechnologyInfo[] = [];
  const seen = new Set<string>();

  for (const detector of DETECTORS) {
    const result = detector.detect(packageInfo, files, rootPath);
    if (result && !seen.has(result.name)) {
      technologies.push(result);
      seen.add(result.name);
    }
  }

  const confidenceOrder = { high: 3, medium: 2, low: 1 };
  return technologies.sort((a, b) => confidenceOrder[b.confidence] - confidenceOrder[a.confidence]);
}
