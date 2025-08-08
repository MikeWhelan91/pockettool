export function generatePassword(
  length = 12,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {}
): string {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
  } = options;

  let chars = '';
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) chars += '0123456789';
  if (includeSymbols) chars += '!@#$%^&*()_+';

  if (!chars.length) return ''; // avoid division by zero

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

export function generateRGBColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

export function generateSlug(): string {
  const adjectives = ['quick', 'lazy', 'funny', 'sharp', 'brave'];
  const nouns = ['fox', 'dog', 'cat', 'bear', 'lion'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}-${noun}-${number}`;
}

export function generateLorem({
  type = 'words',
  count = 1,
}: {
  type?: 'words' | 'sentences' | 'paragraphs';
  count?: number;
}): string {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
    'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua',
  ];

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  if (type === 'words') {
    return Array.from({ length: count }, getRandomWord).join(' ');
  }

  if (type === 'sentences') {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      const len = 4 + Math.floor(Math.random() * 8); // 4–11 words
      let sentence = Array.from({ length: len }, getRandomWord).join(' ');
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    return sentences.join(' ');
  }

  if (type === 'paragraphs') {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
      const len = 3 + Math.floor(Math.random() * 3); // 3–5 sentences
      paragraphs.push(generateLorem({ type: 'sentences', count: len }));
    }
    return paragraphs.join('\n\n');
  }

  return '';
}
