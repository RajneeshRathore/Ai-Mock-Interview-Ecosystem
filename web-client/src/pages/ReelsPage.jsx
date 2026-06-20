import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { ReelCard } from '../features/reels/components/ReelCard';

// ─── 28 Curated Learning Reels ──────────────────────────────────────────────
const ALL_REELS = [
  // ── DSA ────────────────────────────────────────────────────────────────────
  {
    id: 1, category: 'dsa',
    title: 'Two Pointers',
    subtitle: 'Solve pair problems in O(n)',
    type: 'code',
    explanation: 'Use two pointers moving toward each other on a sorted array. Eliminates the O(n²) brute-force nested loop.',
    code: `function hasPairSum(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return true;
    else if (sum < target) left++;
    else right--;
  }
  return false;
}`,
    tags: ['O(n) time', 'O(1) space', 'Sorted Arrays'],
    likes: 284,
  },
  {
    id: 2, category: 'dsa',
    title: 'Sliding Window',
    subtitle: 'Subarray & substring problems',
    type: 'code',
    explanation: 'Maintain a window of elements as you traverse. Expand from the right, shrink from the left when a condition breaks.',
    code: `function maxSumSubarray(arr, k) {
  let windowSum = 0, maxSum = 0;

  for (let i = 0; i < k; i++)
    windowSum += arr[i];
  maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
    tags: ['O(n) time', 'O(1) space', 'Subarrays'],
    likes: 312,
  },
  {
    id: 3, category: 'dsa',
    title: 'Binary Search',
    subtitle: 'O(log n) searching on sorted arrays',
    type: 'code',
    explanation: 'Divide and conquer — cut the search space in half every iteration. Always ask: can I sort this first?',
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // not found
}`,
    tags: ['O(log n) time', 'O(1) space', 'Sorted Arrays'],
    likes: 401,
  },
  {
    id: 4, category: 'dsa',
    title: 'BFS — Level-Order Traversal',
    subtitle: 'Explore graphs layer by layer',
    type: 'code',
    explanation: 'BFS uses a queue to visit nodes level by level. Best for: shortest path, nearest node, level-order output.',
    code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`,
    tags: ['O(V+E)', 'Queue', 'Shortest Path'],
    likes: 356,
  },
  {
    id: 5, category: 'dsa',
    title: 'Dynamic Programming',
    subtitle: 'Break problems into overlapping subproblems',
    type: 'code',
    explanation: 'DP = recursion + memoization. If a problem has overlapping subproblems and optimal substructure, DP applies.',
    code: `// Fibonacci with memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

// Bottom-up tabulation (faster)
function fibDP(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}`,
    tags: ['Memoization', 'Tabulation', 'Optimization'],
    likes: 489,
  },
  {
    id: 6, category: 'dsa',
    title: 'Hash Map Pattern',
    subtitle: 'O(1) lookup — the universal tool',
    type: 'code',
    explanation: 'When you need fast lookup, use a Hash Map. Trade O(n²) loops for O(n) traversal with O(n) extra space.',
    code: `// Two-sum problem → O(n) with hash map
function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    tags: ['O(n) time', 'O(n) space', 'Lookup'],
    likes: 523,
  },
  {
    id: 7, category: 'dsa',
    title: 'Stack — LIFO Patterns',
    subtitle: 'Matching, undo, and monotonic stacks',
    type: 'code',
    explanation: 'Use a stack when you need to "remember" previous elements, especially for matching problems like parentheses.',
    code: `// Valid parentheses checker
function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    tags: ['O(n) time', 'LIFO', 'Matching'],
    likes: 267,
  },
  {
    id: 8, category: 'dsa',
    title: 'DFS on Trees',
    subtitle: 'Recursive depth-first traversal',
    type: 'code',
    explanation: 'DFS explores as deep as possible before backtracking. The call stack IS the data structure — elegant recursion.',
    code: `// Inorder: Left → Node → Right
function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

// Max depth of a binary tree
function maxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(
    maxDepth(node.left),
    maxDepth(node.right)
  );
}`,
    tags: ['O(n) time', 'Recursion', 'Trees'],
    likes: 344,
  },
  {
    id: 9, category: 'dsa',
    title: 'Merge Sort',
    subtitle: 'Stable O(n log n) sorting',
    type: 'code',
    explanation: 'Divide the array in half recursively, sort each half, then merge them together. Best for linked lists and stable sorting.',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    tags: ['O(n log n)', 'Stable', 'Divide & Conquer'],
    likes: 198,
  },
  {
    id: 10, category: 'dsa',
    title: 'Recursion Blueprint',
    subtitle: '3 steps to any recursive solution',
    type: 'bullets',
    explanation: 'Every recursive function follows the same blueprint. Master these 3 steps and recursion becomes intuitive.',
    points: [
      '① Base Case — When does the recursion stop? (e.g., n === 0, node === null). Always define this first.',
      '② Recursive Case — Call the function with a smaller input, moving toward the base case.',
      '③ Trust the function — Assume the recursive call returns the correct result and build on it.',
      'Tip: Draw the call tree for small inputs (n=3 or n=4) to visualize the recursion before coding.',
    ],
    tags: ['Base Case', 'Call Stack', 'Inductive Thinking'],
    likes: 376,
  },

  // ── BEHAVIORAL ─────────────────────────────────────────────────────────────
  {
    id: 11, category: 'behavioral',
    title: 'STAR Method',
    subtitle: 'Structure every behavioral answer',
    type: 'concept',
    explanation: 'Interviewers want specific stories, not generic opinions. STAR gives your answer a narrative arc that\'s easy to follow.',
    points: [
      '⭐ Situation — Set the context briefly. Where were you, what was the team, what project?',
      '🎯 Task — What was YOUR specific responsibility? Make it clear you had ownership.',
      '⚡ Action — This is the meat. Detail the exact steps YOU took. Use "I", not "we".',
      '📈 Result — Quantify the outcome. "Reduced load time by 40%", "shipped 2 weeks early".',
    ],
    tags: ['Story Structure', 'Interview Gold', 'Must Know'],
    likes: 612,
  },
  {
    id: 12, category: 'behavioral',
    title: '"Tell Me About Yourself"',
    subtitle: 'The 60-second elevator pitch',
    type: 'bullets',
    explanation: 'This is your opening. Don\'t recite your resume — tell a story that explains why you\'re in THIS interview room.',
    points: [
      '① Present: "I\'m a [role] with X years building [type of products]." One crisp sentence.',
      '② Past: Name your most relevant experience. One strong example, not a life story.',
      '③ Future: "I\'m excited about [company] because..." Show you did your research.',
      '④ Bridge: Connect your story to why you\'re perfect for THIS role specifically.',
    ],
    tags: ['Opening', '< 90 seconds', 'First Impression'],
    likes: 534,
  },
  {
    id: 13, category: 'behavioral',
    title: 'Handling Conflict',
    subtitle: 'Turn friction into a leadership story',
    type: 'bullets',
    explanation: 'Every engineer has disagreed with a colleague or decision. Interviewers want to see maturity, not avoidance.',
    points: [
      '① Pick a REAL example where you disagreed on something technical or directional.',
      '② Show empathy first — "I listened to understand their perspective before responding."',
      '③ Describe the data/logic you used to build your case. Keep it objective, not personal.',
      '④ End with resolution and what you both learned. Bonus: mention if you were wrong.',
    ],
    tags: ['Conflict Resolution', 'Maturity', 'EQ'],
    likes: 287,
  },
  {
    id: 14, category: 'behavioral',
    title: 'The Weakness Question',
    subtitle: 'Be honest, but show growth',
    type: 'bullets',
    explanation: 'Saying "I work too hard" is a red flag. Interviewers want self-awareness and evidence of improvement.',
    points: [
      '❌ Avoid: Fake weaknesses ("I\'m a perfectionist!") — interviewers see right through it.',
      '✅ Pick a genuine skill gap that is NOT core to the job you\'re applying for.',
      '✅ Explain what concrete steps you\'ve taken to improve it (courses, projects, habits).',
      '✅ Show progress: "I\'ve improved significantly — here\'s an example of the change."',
    ],
    tags: ['Self-Awareness', 'Growth Mindset', 'Authenticity'],
    likes: 445,
  },
  {
    id: 15, category: 'behavioral',
    title: 'Leadership Without a Title',
    subtitle: 'Show you lead through influence',
    type: 'bullets',
    explanation: 'You don\'t need a manager title to demonstrate leadership. Interviewers look for initiative and influence.',
    points: [
      '① Mentored a junior teammate — walk through a specific situation where you guided someone.',
      '② Drove a decision — describe a time you pushed a technical direction and got buy-in.',
      '③ Stepped up in a crisis — "The deploy was failing at 2am. I took ownership and..."',
      '④ Built a process — introduced a practice (code reviews, retros, docs) that the team adopted.',
    ],
    tags: ['Leadership', 'Initiative', 'Influence'],
    likes: 391,
  },
  {
    id: 16, category: 'behavioral',
    title: 'Why This Company?',
    subtitle: 'Research-backed, not generic',
    type: 'checklist',
    explanation: 'Generic answers like "great culture" hurt you. Research signals genuine interest and sets you apart from other candidates.',
    points: [
      'Read the company\'s engineering blog — mention a specific post that impressed you.',
      'Understand their product deeply — show you\'re a real user or have studied it.',
      'Know a recent launch, pivot, or challenge the company faced.',
      'Connect their mission to YOUR career goals authentically.',
      'Mention a specific team or technology stack you\'re excited to work with.',
    ],
    tags: ['Research', 'Genuine Interest', 'Differentiation'],
    likes: 503,
  },
  {
    id: 17, category: 'behavioral',
    title: 'Questions to Ask',
    subtitle: 'End every interview strong',
    type: 'checklist',
    explanation: 'Not asking questions signals low interest. Great questions show curiosity and help YOU evaluate the company too.',
    points: [
      '"What does success look like in the first 90 days for this role?"',
      '"What\'s the biggest technical challenge the team is facing right now?"',
      '"How does the team handle technical debt vs. new feature work?"',
      '"What does career growth look like for engineers here?"',
      '"What do YOU love most about working at this company?"',
    ],
    tags: ['Curiosity', 'Engagement', 'Two-Way Interview'],
    likes: 418,
  },

  // ── SYSTEM DESIGN ──────────────────────────────────────────────────────────
  {
    id: 18, category: 'system',
    title: 'CAP Theorem',
    subtitle: 'The distributed systems trade-off',
    type: 'concept',
    explanation: 'In a distributed system, you can only guarantee 2 of 3 properties. Network partitions are inevitable — so you choose CP or AP.',
    points: [
      '🔒 Consistency — Every read returns the most recent write. All nodes see the same data.',
      '✅ Availability — Every request gets a response (not necessarily the latest data).',
      '🌐 Partition Tolerance — System keeps running even when network messages are lost.',
      '⚡ CP Systems (e.g., HBase, Zookeeper) — Sacrifice availability for correctness.',
      '⚡ AP Systems (e.g., Cassandra, CouchDB) — Sacrifice consistency for uptime.',
    ],
    tags: ['Distributed Systems', 'Trade-offs', 'Must Know'],
    likes: 467,
  },
  {
    id: 19, category: 'system',
    title: 'Load Balancing',
    subtitle: 'Scale horizontally with confidence',
    type: 'bullets',
    explanation: 'A load balancer distributes incoming requests across multiple servers, preventing any single server from becoming a bottleneck.',
    points: [
      '⚖️ Round Robin — Requests distributed in order. Simple, but ignores server capacity.',
      '🧠 Least Connections — Route to the server with fewest active requests. More intelligent.',
      '🔑 Sticky Sessions — Same user always hits same server. Needed for stateful apps.',
      '🌍 Geo-based — Route users to nearest data center. Reduces latency significantly.',
      'Tools: Nginx, HAProxy, AWS ALB, Cloudflare. Always have health checks configured.',
    ],
    tags: ['Scalability', 'High Availability', 'Infrastructure'],
    likes: 389,
  },
  {
    id: 20, category: 'system',
    title: 'Caching Strategies',
    subtitle: 'Speed up reads, reduce DB load',
    type: 'bullets',
    explanation: 'Caching stores frequently accessed data in fast memory. A 10ms DB query becomes a 1ms cache hit. Know the trade-offs.',
    points: [
      '📦 Cache-Aside (Lazy): App checks cache → miss → reads DB → writes to cache. Most flexible.',
      '✍️ Write-Through: Write to cache AND DB simultaneously. Consistent but slower writes.',
      '🔄 Write-Back: Write to cache first, async sync to DB. Fast writes, risk of data loss.',
      '⏰ TTL (Time-to-Live): Set expiry on cached items to prevent stale data.',
      'Tools: Redis (in-memory, pub/sub), Memcached (simpler), CDN for static assets.',
    ],
    tags: ['Redis', 'Performance', 'Read Heavy Systems'],
    likes: 512,
  },
  {
    id: 21, category: 'system',
    title: 'SQL vs NoSQL',
    subtitle: 'Choose the right database',
    type: 'concept',
    explanation: 'No database is universally better. The choice depends on your data model, query patterns, and scale requirements.',
    points: [
      '🗃️ SQL (PostgreSQL, MySQL) — ACID transactions, complex joins, structured schema. Best for financial data, user accounts, inventory.',
      '📄 Document (MongoDB) — Flexible schema, nested JSON. Best for content, product catalogs, user profiles.',
      '⚡ Key-Value (Redis, DynamoDB) — Blazing fast lookups. Best for sessions, caches, leaderboards.',
      '📊 Column (Cassandra) — Massive write throughput, time-series. Best for IoT, analytics, event logs.',
      '🕸️ Graph (Neo4j) — Relationships are first-class. Best for social networks, recommendations.',
    ],
    tags: ['Database Design', 'Trade-offs', 'Architecture'],
    likes: 478,
  },
  {
    id: 22, category: 'system',
    title: 'Microservices vs Monolith',
    subtitle: 'When to split, when to stay together',
    type: 'bullets',
    explanation: 'Microservices are not always the answer. Start with a monolith; extract services when you hit specific scaling pain points.',
    points: [
      '🏗️ Monolith: Simple to develop, test, and deploy initially. Single codebase, no network calls.',
      '🔧 Microservices: Each service independently deployable, scalable. Teams own their services.',
      '🚫 Microservices pitfalls: Distributed tracing complexity, network latency, data consistency across services.',
      '✅ Split when: a service has dramatically different scaling needs, or team ownership is unclear.',
      '💡 "Start monolith, extract microservice" — Martin Fowler\'s Strangler Fig Pattern.',
    ],
    tags: ['Architecture', 'Scalability', 'Trade-offs'],
    likes: 433,
  },
  {
    id: 23, category: 'system',
    title: 'REST API Best Practices',
    subtitle: 'Design APIs your team will love',
    type: 'checklist',
    explanation: 'A well-designed API is intuitive, consistent, and resilient to change. These principles are tested in system design rounds.',
    points: [
      'Use nouns, not verbs: GET /users/42 not GET /getUser?id=42',
      'Use HTTP methods correctly: GET (read), POST (create), PUT (update), DELETE (remove).',
      'Return meaningful status codes: 200, 201, 400, 401, 404, 500.',
      'Version your API: /v1/users — prevents breaking changes for existing clients.',
      'Paginate large responses: ?page=2&limit=20 or cursor-based pagination.',
    ],
    tags: ['REST', 'API Design', 'Best Practices'],
    likes: 356,
  },

  // ── QUICK TIPS ──────────────────────────────────────────────────────────────
  {
    id: 24, category: 'tips',
    title: 'Before the Interview',
    subtitle: '5 things to do the night before',
    type: 'checklist',
    explanation: 'Preparation the night before dramatically reduces anxiety and sharpens performance. Don\'t wing it.',
    points: [
      'Review your own resume — you\'ll be asked about everything on it.',
      'Practice 2-3 STAR stories covering leadership, conflict, and failure.',
      'Re-read the job description — align your talking points to their needs.',
      'Research the interviewer on LinkedIn — find common ground.',
      'Sleep 7+ hours. Cognitive performance drops 30% on poor sleep.',
    ],
    tags: ['Preparation', 'Mindset', 'Strategy'],
    likes: 621,
  },
  {
    id: 25, category: 'tips',
    title: 'During Coding Interviews',
    subtitle: 'What separates good from great',
    type: 'checklist',
    explanation: 'Interviewers evaluate your thinking process, not just your final solution. Talk out loud, even if you\'re unsure.',
    points: [
      'Clarify requirements first — ask about constraints, edge cases, and expected input size.',
      'Think out loud — narrate your thought process, even when stuck.',
      'Start with a brute-force solution, then optimize.',
      'Trace through your code with a small example before claiming it\'s correct.',
      'Analyze time and space complexity unprompted — it shows experience.',
    ],
    tags: ['Coding Interview', 'Process', 'Communication'],
    likes: 587,
  },
  {
    id: 26, category: 'tips',
    title: 'When You\'re Stuck',
    subtitle: 'The 4-step unstuck framework',
    type: 'bullets',
    explanation: 'Getting stuck is normal. How you handle it separates junior from senior candidates. Never go silent.',
    points: [
      '① Restate the problem — "Let me re-read this to make sure I understand it correctly."',
      '② Reduce to a simpler case — "What if the input was just [1, 2]? How would I solve that?"',
      '③ Name what you know — "I know I need some kind of lookup... maybe a hash map could work here."',
      '④ Ask a targeted question — "Is it acceptable if I use O(n) extra space?" shows structured thinking.',
    ],
    tags: ['Problem Solving', 'Recovery', 'Communication'],
    likes: 498,
  },
  {
    id: 27, category: 'tips',
    title: 'Big-O Cheat Sheet',
    subtitle: 'The complexity rankings to memorize',
    type: 'concept',
    explanation: 'Always analyze your algorithm\'s time and space complexity. Interviewers expect this without being asked.',
    points: [
      'O(1) — Constant: Array index access, hash map lookup. Instant.',
      'O(log n) — Logarithmic: Binary search, balanced BST. Extremely fast.',
      'O(n) — Linear: Single loop, linear scan. Very common target.',
      'O(n log n) — Linearithmic: Merge sort, heap sort. Acceptable for sorting.',
      'O(n²) — Quadratic: Nested loops. Avoid for n > 1000. Often improvable.',
    ],
    tags: ['Big-O', 'Time Complexity', 'Must Memorize'],
    likes: 734,
  },
  {
    id: 28, category: 'tips',
    title: 'After the Interview',
    subtitle: 'The follow-up that sets you apart',
    type: 'checklist',
    explanation: 'Most candidates vanish after the interview. A professional follow-up keeps you top-of-mind and shows genuine interest.',
    points: [
      'Send a thank-you email within 24 hours — brief, warm, and specific.',
      'Reference something specific you discussed — shows you were engaged.',
      'Ask about next steps and timeline if the recruiter didn\'t mention them.',
      'Debrief yourself: what went well, what to improve for next time.',
      'Connect on LinkedIn with your interviewers (optional but memorable).',
    ],
    tags: ['Follow-Up', 'Professionalism', 'Relationship Building'],
    likes: 445,
  },
];

const CATEGORIES = [
  { key: 'all', label: '✨ All' },
  { key: 'dsa', label: '🧩 DSA' },
  { key: 'behavioral', label: '💬 Behavioral' },
  { key: 'system', label: '⚙️ System Design' },
  { key: 'tips', label: '💡 Quick Tips' },
];

export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const filteredReels = activeCategory === 'all'
    ? ALL_REELS
    : ALL_REELS.filter(r => r.category === activeCategory);

  // Reset to first card when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeCategory]);

  // Track which card is visible via scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / cardHeight);
    setCurrentIndex(Math.min(newIndex, filteredReels.length - 1));
  }, [filteredReels.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const cardHeight = container.clientHeight;

      if (e.key === 'ArrowDown' && currentIndex < filteredReels.length - 1) {
        e.preventDefault();
        container.scrollTo({ top: (currentIndex + 1) * cardHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        container.scrollTo({ top: (currentIndex - 1) * cardHeight, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, filteredReels.length]);

  const scrollTo = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardHeight = container.clientHeight;
    const newIndex = direction === 'up'
      ? Math.max(0, currentIndex - 1)
      : Math.min(filteredReels.length - 1, currentIndex + 1);
    container.scrollTo({ top: newIndex * cardHeight, behavior: 'smooth' });
  };

  return (
    // -m-8 removes the parent's p-8 so we can go edge-to-edge
    <div className="-m-8 h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-slate-950">

      {/* ── Category Filter Tabs ────────────────────────────────── */}
      <div className="flex-shrink-0 h-14 flex items-center gap-2 px-6 border-b border-white/8 bg-slate-950/90 backdrop-blur-xl overflow-x-auto [scrollbar-width:none] z-30">
        <div className="flex items-center gap-1.5 mr-3">
          <Zap size={14} className="text-indigo-400" />
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Reels</span>
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-white text-slate-900 shadow-lg shadow-white/10'
                : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="ml-auto text-xs text-white/25 whitespace-nowrap pl-4">
          ↑ ↓ to navigate
        </div>
      </div>

      {/* ── Snap Scroll Container ────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {filteredReels.map((reel, i) => (
          <div
            key={reel.id}
            ref={el => cardRefs.current[i] = el}
            style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always', height: '100%' }}
          >
            <ReelCard
              reel={reel}
              index={i}
              total={filteredReels.length}
              isActive={i === currentIndex}
            />
          </div>
        ))}
      </div>

      {/* ── Navigation Arrows (bottom-right) ─────────────────────── */}
      <div className="absolute bottom-6 right-12 flex flex-col gap-2 z-30">
        <button
          onClick={() => scrollTo('up')}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-90"
        >
          <ChevronUp size={18} />
        </button>
        <button
          onClick={() => scrollTo('down')}
          disabled={currentIndex === filteredReels.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:translate-y-0.5 active:scale-90"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
