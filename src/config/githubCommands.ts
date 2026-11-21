export const DEFAULT_GITHUB_BASE_URL =
  'https://raw.githubusercontent.com/Merthyl/thedunceoffice/main/';

export const COMMANDS: Record<string, string> = {
  '/transfer': 'transfer.txt',
  '/recap': 'recap.txt',
};

export interface SlashCommandMeta {
  command: string;
  filename?: string;
  label: string;
  description: string;
  kind: 'github-raw' | 'map';
}

export const SLASH_COMMAND_LIST: SlashCommandMeta[] = [
  {
    command: '/transfer',
    filename: COMMANDS['/transfer'],
    label: 'Transfer Pack',
    description: 'Tải nguyên văn transfer.txt từ GitHub Raw (0 token)',
    kind: 'github-raw',
  },
  {
    command: '/recap',
    filename: COMMANDS['/recap'],
    label: 'Recap Diễn Biến',
    description: 'Tải nguyên văn recap.txt từ GitHub Raw (0 token)',
    kind: 'github-raw',
  },
  {
    command: '/map',
    label: 'Định vị Bản đồ',
    description: 'Phóng vào vị trí đứng hiện tại trên bản đồ Valeroth',
    kind: 'map',
  },
];

export function normalizeBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return DEFAULT_GITHUB_BASE_URL;
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

export function normalizeCommandInput(input: string): string {
  return input.trim().toLowerCase();
}

export function resolveGithubCommandFilename(input: string): string | null {
  const normalized = normalizeCommandInput(input);
  return Object.prototype.hasOwnProperty.call(COMMANDS, normalized)
    ? COMMANDS[normalized]
    : null;
}

export async function fetchGithubRawCommand(
  baseUrl: string,
  filename: string
): Promise<{ text: string; url: string }> {
  const safeBase = normalizeBaseUrl(baseUrl);
  const url = `${safeBase}${filename}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Không tìm thấy tệp "${filename}" tại ${url} (HTTP 404). Hãy kiểm tra tên repo Public hoặc đảm bảo đã commit tệp này lên nhánh main.`
      );
    }
    throw new Error(`Không thể tải tệp từ GitHub Raw (HTTP ${response.status}).`);
  }

  const text = await response.text();
  return { text, url };
}
