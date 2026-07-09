export interface SelectedFile {
  path: string;
  reason: 'package-json' | 'tsconfig' | 'recently-modified' | 'user-referenced';
  content: string;
  modifiedAt?: string;
}

export interface RelevantFileSelection {
  files: SelectedFile[];
}
