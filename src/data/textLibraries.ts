export const COMMON_WORDS: string[] = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I',
  'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'by',
  'from', 'they', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
  'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most',
  'us', 'great', 'world', 'here', 'life', 'never', 'much', 'should', 'need', 'feel', 'high',
  'system', 'program', 'code', 'speed', 'focus', 'flow', 'finger', 'rhythm', 'key', 'type',
  'practice', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'sound', 'light', 'dark',
  'screen', 'mind', 'power', 'future', 'skill', 'learn', 'stream', 'pulse', 'spark', 'shift',
  'energy', 'build', 'create', 'reach', 'climb', 'quiet', 'swift', 'sharp', 'steady', 'drive',
  'matrix', 'signal', 'memory', 'future', 'vision', 'simple', 'clean', 'nature', 'water', 'stone',
  'mountain', 'breeze', 'cloud', 'silver', 'golden', 'shadow', 'echo', 'bright', 'calm', 'depth',
  'journey', 'wonder', 'curious', 'action', 'result', 'target', 'motion', 'orbit', 'zenith', 'tempo'
];

export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  length: 'short' | 'medium' | 'long';
}

export const FAMOUS_QUOTES: QuoteItem[] = [
  {
    id: 'q1',
    quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
    length: "short"
  },
  {
    id: 'q2',
    quote: "Simplicity is prerequisite for reliability. Premature optimization is the root of all evil in software engineering.",
    author: "Donald Knuth",
    length: "medium"
  },
  {
    id: 'q3',
    quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
    length: "medium"
  },
  {
    id: 'q4',
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    length: "medium"
  },
  {
    id: 'q5',
    quote: "It does not matter how slowly you go as long as you do not stop. Persistence overcomes the hardest barriers.",
    author: "Confucius",
    length: "short"
  },
  {
    id: 'q6',
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall. Strength is forged through adversity.",
    author: "Nelson Mandela",
    length: "medium"
  },
  {
    id: 'q7',
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    length: "short"
  },
  {
    id: 'q8',
    quote: "First, solve the problem. Then, write the code. Clear thinking is the foundation of elegant design.",
    author: "John Johnson",
    length: "short"
  },
  {
    id: 'q9',
    quote: "In the middle of difficulty lies opportunity. Keep your attention centered on what is within your control.",
    author: "Albert Einstein",
    length: "short"
  },
  {
    id: 'q10',
    quote: "Knowledge is of no value unless you put it into practice. Repetition builds effortless mastery in any craft.",
    author: "Anton Chekhov",
    length: "short"
  }
];

export interface CodeSnippetItem {
  id: string;
  title: string;
  language: string;
  code: string;
}

export const CODE_SNIPPETS: CodeSnippetItem[] = [
  {
    id: 'c1',
    title: 'TypeScript Binary Search',
    language: 'TypeScript',
    code: "function binarySearch(arr: number[], target: number): number {\n  let low = 0;\n  let high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}"
  },
  {
    id: 'c2',
    title: 'React Custom Hook',
    language: 'React',
    code: "function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState<T>(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}"
  },
  {
    id: 'c3',
    title: 'Python QuickSort',
    language: 'Python',
    code: "def quicksort(items):\n    if len(items) <= 1:\n        return items\n    pivot = items[len(items) // 2]\n    left = [x for x in items if x < pivot]\n    middle = [x for x in items if x == pivot]\n    right = [x for x in items if x > pivot]\n    return quicksort(left) + middle + quicksort(right)"
  },
  {
    id: 'c4',
    title: 'JavaScript Array Pipeline',
    language: 'JavaScript',
    code: "const results = items\n  .filter(item => item.isActive && item.score > 80)\n  .map(item => ({ ...item, formattedScore: `${item.score}%` }))\n  .sort((a, b) => b.score - a.score);"
  }
];

export const PUNCTUATION_TEXTS: string[] = [
  "Wait! Did you hear that? The frequency was 14.5 Hz, exactly 3.2% above baseline: [Alpha-09]. Let's verify: (x + y) * (z - 4) = 1,024!",
  "In 2026, over 94.7% of engineers said: \"Clean architecture + strong typing = peace of mind.\" Isn't that 100% true? Check #docs @v2.4!",
  "Warning: file_path = \"/usr/local/bin/run.sh\"; exit_code: -1 (ERR_TIMEOUT). Please retry with flags: [--force, --verbose=true]!",
  "The quick, brown fox—jumping swiftly—cleared 10-foot fences; while 42 lazy dogs lay under the 90° shade. Are you ready?"
];

export function generateRandomWords(count: number): string {
  const words: string[] = [];
  let prevWord = '';
  for (let i = 0; i < count; i++) {
    let rand = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    while (rand === prevWord) {
      rand = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    }
    words.push(rand);
    prevWord = rand;
  }
  return words.join(' ');
}

export function getRandomQuote(): QuoteItem {
  const index = Math.floor(Math.random() * FAMOUS_QUOTES.length);
  return FAMOUS_QUOTES[index];
}

export function getRandomCode(): CodeSnippetItem {
  const index = Math.floor(Math.random() * CODE_SNIPPETS.length);
  return CODE_SNIPPETS[index];
}

export function getRandomPunctuation(): string {
  const index = Math.floor(Math.random() * PUNCTUATION_TEXTS.length);
  return PUNCTUATION_TEXTS[index];
}
