import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Code, Layers, Network, GitBranch, Database, 
  Hash, Binary, Workflow, ArrowRight, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Flame, Star, Filter
} from 'lucide-react';

const dsaTopics = [
  {
    id: 'arrays',
    category: 'Arrays & Strings',
    icon: <Layers size={22} />,
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    description: 'Master array manipulation, sliding window, two pointers, and string algorithms.',
    totalProblems: 45,
    completedProblems: 0,
    subtopics: [
      { name: 'Two Pointers', difficulty: 'Easy', problems: 8, description: 'Solve problems using the two-pointer technique for sorted arrays and linked lists.' },
      { name: 'Sliding Window', difficulty: 'Medium', problems: 7, description: 'Find subarrays or substrings with specific properties using the sliding window pattern.' },
      { name: 'Kadane\'s Algorithm', difficulty: 'Medium', problems: 5, description: 'Find maximum subarray sum and its variants using dynamic programming.' },
      { name: 'Prefix Sum', difficulty: 'Easy', problems: 6, description: 'Precompute cumulative sums for efficient range queries.' },
      { name: 'Matrix Traversal', difficulty: 'Medium', problems: 8, description: 'Navigate 2D matrices with spiral order, diagonal traversal, and rotation.' },
      { name: 'String Matching', difficulty: 'Hard', problems: 6, description: 'KMP, Rabin-Karp, and Z-algorithm for pattern matching.' },
      { name: 'Sorting Algorithms', difficulty: 'Medium', problems: 5, description: 'Merge sort, quick sort, counting sort, and their applications.' },
    ]
  },
  {
    id: 'linked-lists',
    category: 'Linked Lists',
    icon: <GitBranch size={22} />,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    description: 'Learn singly, doubly, and circular linked list operations and reversal techniques.',
    totalProblems: 30,
    completedProblems: 0,
    subtopics: [
      { name: 'Singly Linked List', difficulty: 'Easy', problems: 6, description: 'Basic operations: insertion, deletion, traversal, and search.' },
      { name: 'Doubly Linked List', difficulty: 'Easy', problems: 5, description: 'Bidirectional traversal and node manipulation.' },
      { name: 'Fast & Slow Pointers', difficulty: 'Medium', problems: 6, description: 'Floyd\'s cycle detection, find middle, and nth node from end.' },
      { name: 'Reversal Techniques', difficulty: 'Medium', problems: 7, description: 'Reverse entire list, reverse in groups, and palindrome checks.' },
      { name: 'Merge & Sort', difficulty: 'Hard', problems: 6, description: 'Merge sorted lists, sort linked lists, and intersection points.' },
    ]
  },
  {
    id: 'stacks-queues',
    category: 'Stacks & Queues',
    icon: <Database size={22} />,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50',
    description: 'LIFO/FIFO data structures, monotonic stacks, and priority queues.',
    totalProblems: 35,
    completedProblems: 0,
    subtopics: [
      { name: 'Stack Basics', difficulty: 'Easy', problems: 5, description: 'Implement stack, balanced parentheses, and min stack.' },
      { name: 'Monotonic Stack', difficulty: 'Medium', problems: 7, description: 'Next greater element, largest rectangle, and stock span problems.' },
      { name: 'Queue & Deque', difficulty: 'Easy', problems: 5, description: 'Queue operations, circular queue, and sliding window maximum.' },
      { name: 'Priority Queue / Heap', difficulty: 'Medium', problems: 8, description: 'Min/max heap, top-K elements, and median finding.' },
      { name: 'Stack Applications', difficulty: 'Hard', problems: 5, description: 'Expression evaluation, infix to postfix, and recursive stack simulation.' },
      { name: 'Design Problems', difficulty: 'Hard', problems: 5, description: 'LRU Cache, LFU Cache, and custom data structure design.' },
    ]
  },
  {
    id: 'trees',
    category: 'Trees & BST',
    icon: <Network size={22} />,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    description: 'Binary trees, BST, AVL trees, traversals, and tree construction problems.',
    totalProblems: 50,
    completedProblems: 0,
    subtopics: [
      { name: 'Tree Traversals', difficulty: 'Easy', problems: 6, description: 'Inorder, preorder, postorder, level-order, and Morris traversal.' },
      { name: 'Binary Search Tree', difficulty: 'Medium', problems: 8, description: 'Search, insert, delete, validate BST, and floor/ceil.' },
      { name: 'Tree Construction', difficulty: 'Medium', problems: 7, description: 'Build tree from traversals, serialize/deserialize trees.' },
      { name: 'Path Problems', difficulty: 'Medium', problems: 8, description: 'Root to leaf paths, max path sum, and diameter of tree.' },
      { name: 'Lowest Common Ancestor', difficulty: 'Medium', problems: 6, description: 'LCA in binary tree and BST with various approaches.' },
      { name: 'Balanced Trees', difficulty: 'Hard', problems: 5, description: 'AVL trees, Red-Black trees, and self-balancing BST concepts.' },
      { name: 'Segment Trees', difficulty: 'Hard', problems: 5, description: 'Range queries, lazy propagation, and interval updates.' },
      { name: 'Trie', difficulty: 'Medium', problems: 5, description: 'Prefix tree, autocomplete, and word search problems.' },
    ]
  },
  {
    id: 'graphs',
    category: 'Graphs',
    icon: <Workflow size={22} />,
    color: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50',
    description: 'BFS, DFS, shortest paths, MST, topological sort, and union-find.',
    totalProblems: 55,
    completedProblems: 0,
    subtopics: [
      { name: 'Graph Representation', difficulty: 'Easy', problems: 4, description: 'Adjacency list, matrix, and edge list representations.' },
      { name: 'BFS & DFS', difficulty: 'Medium', problems: 10, description: 'Breadth-first and depth-first search with connected components.' },
      { name: 'Shortest Path', difficulty: 'Medium', problems: 8, description: 'Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms.' },
      { name: 'Topological Sort', difficulty: 'Medium', problems: 6, description: 'Kahn\'s algorithm and DFS-based topological ordering.' },
      { name: 'Minimum Spanning Tree', difficulty: 'Medium', problems: 5, description: 'Prim\'s and Kruskal\'s algorithms for MST.' },
      { name: 'Union-Find / DSU', difficulty: 'Medium', problems: 7, description: 'Disjoint set union with path compression and rank.' },
      { name: 'Cycle Detection', difficulty: 'Medium', problems: 5, description: 'Detect cycles in directed and undirected graphs.' },
      { name: 'Advanced Graphs', difficulty: 'Hard', problems: 10, description: 'Bridges, articulation points, strongly connected components, and network flow.' },
    ]
  },
  {
    id: 'dp',
    category: 'Dynamic Programming',
    icon: <Hash size={22} />,
    color: 'from-indigo-500 to-violet-500',
    bgLight: 'bg-indigo-50',
    description: 'Memoization, tabulation, 1D/2D DP, knapsack, LCS, and DP on trees.',
    totalProblems: 60,
    completedProblems: 0,
    subtopics: [
      { name: '1D DP Basics', difficulty: 'Easy', problems: 8, description: 'Fibonacci, climbing stairs, house robber, and coin change.' },
      { name: '2D DP / Grid', difficulty: 'Medium', problems: 8, description: 'Unique paths, minimum path sum, and grid traversal problems.' },
      { name: 'Knapsack Patterns', difficulty: 'Medium', problems: 8, description: '0/1 knapsack, unbounded knapsack, and subset sum.' },
      { name: 'LCS & LIS', difficulty: 'Medium', problems: 7, description: 'Longest common subsequence, longest increasing subsequence.' },
      { name: 'String DP', difficulty: 'Hard', problems: 7, description: 'Edit distance, palindrome partitioning, and regex matching.' },
      { name: 'Interval DP', difficulty: 'Hard', problems: 6, description: 'Matrix chain multiplication, burst balloons, and merge stones.' },
      { name: 'DP on Trees', difficulty: 'Hard', problems: 6, description: 'Tree DP, rerooting technique, and vertex cover.' },
      { name: 'Bitmask DP', difficulty: 'Hard', problems: 5, description: 'Traveling salesman, assignment problem, and state compression.' },
      { name: 'Digit DP', difficulty: 'Hard', problems: 5, description: 'Count numbers with specific digit properties.' },
    ]
  },
  {
    id: 'recursion',
    category: 'Recursion & Backtracking',
    icon: <Binary size={22} />,
    color: 'from-cyan-500 to-blue-500',
    bgLight: 'bg-cyan-50',
    description: 'Divide & conquer, permutations, combinations, and constraint satisfaction.',
    totalProblems: 30,
    completedProblems: 0,
    subtopics: [
      { name: 'Recursion Basics', difficulty: 'Easy', problems: 6, description: 'Factorial, power, subsets generation, and Tower of Hanoi.' },
      { name: 'Backtracking', difficulty: 'Medium', problems: 8, description: 'N-Queens, Sudoku solver, permutations, and combinations.' },
      { name: 'Divide & Conquer', difficulty: 'Medium', problems: 6, description: 'Merge sort, quick select, and closest pair of points.' },
      { name: 'Advanced Backtracking', difficulty: 'Hard', problems: 5, description: 'Word search, palindrome partitioning, and graph coloring.' },
      { name: 'Combinatorics', difficulty: 'Hard', problems: 5, description: 'Catalan numbers, Bell numbers, and counting problems.' },
    ]
  },
  {
    id: 'binary-search',
    category: 'Binary Search',
    icon: <Code size={22} />,
    color: 'from-teal-500 to-emerald-500',
    bgLight: 'bg-teal-50',
    description: 'Search on sorted arrays, answer space, and advanced binary search patterns.',
    totalProblems: 25,
    completedProblems: 0,
    subtopics: [
      { name: 'Basic Binary Search', difficulty: 'Easy', problems: 5, description: 'Standard binary search, lower/upper bound, and search insert position.' },
      { name: 'Search on Answer', difficulty: 'Medium', problems: 7, description: 'Binary search on answer space: book allocation, painter partition.' },
      { name: 'Rotated Arrays', difficulty: 'Medium', problems: 5, description: 'Search in rotated sorted array, find minimum, and rotation count.' },
      { name: 'Matrix Binary Search', difficulty: 'Medium', problems: 4, description: 'Search in row-sorted and fully-sorted 2D matrices.' },
      { name: 'Advanced Patterns', difficulty: 'Hard', problems: 4, description: 'Median of two sorted arrays, Kth element, and aggressive cows.' },
    ]
  },
];

const difficultyConfig = {
  Easy: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800', icon: '🟢' },
  Medium: { color: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800', icon: '🟡' },
  Hard: { color: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800', icon: '🔴' },
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const totalProblems = dsaTopics.reduce((sum, t) => sum + t.totalProblems, 0);

  const filteredTopics = dsaTopics.filter(topic => {
    const matchesSearch = topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtopics.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getFilteredSubtopics = (subtopics) => {
    if (filterDifficulty === 'All') return subtopics;
    return subtopics.filter(s => s.difficulty === filterDifficulty);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Learn DSA</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Master Data Structures & Algorithms — {totalProblems}+ curated problems</p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics... (e.g. Binary Search, Trees, DP)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filterDifficulty === diff
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress Overview Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/80">Total Topics</div>
          <div className="text-3xl font-display font-bold mt-1">{dsaTopics.length}</div>
          <div className="text-xs text-white/60 mt-1">Categories to explore</div>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/80">Total Problems</div>
          <div className="text-3xl font-display font-bold mt-1">{totalProblems}+</div>
          <div className="text-xs text-white/60 mt-1">Curated for interviews</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/80">Difficulty Mix</div>
          <div className="text-3xl font-display font-bold mt-1">3 Levels</div>
          <div className="text-xs text-white/60 mt-1">Easy • Medium • Hard</div>
        </div>
      </motion.div>

      {/* Topic Cards */}
      <div className="space-y-5">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No topics found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredTopics.map((topic, i) => {
            const isExpanded = expandedTopic === topic.id;
            const filteredSubs = getFilteredSubtopics(topic.subtopics);
            
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Topic Header */}
                <button
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  className="w-full px-6 py-5 flex items-center gap-5 text-left group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{topic.category}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{topic.totalProblems}</div>
                      <div className="text-xs text-slate-400">problems</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{topic.subtopics.length}</div>
                      <div className="text-xs text-slate-400">modules</div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} className="text-slate-500" />
                    </div>
                  </div>
                </button>

                {/* Expanded Subtopics */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                        {filteredSubs.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">No subtopics match the selected difficulty filter.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredSubs.map((sub, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: j * 0.05 }}
                                className="group/sub flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-default"
                              >
                                <div className={`w-8 h-8 rounded-lg ${topic.bgLight} dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                  <BookOpen size={14} className="text-slate-600 dark:text-slate-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{sub.name}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyConfig[sub.difficulty].color}`}>
                                      {sub.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{sub.description}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                      <Code size={10} /> {sub.problems} problems
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-600 via-violet-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl"
      >
        <h3 className="font-display font-bold text-2xl mb-3">Ready to test your knowledge?</h3>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">Practice what you've learned with AI-powered technical interviews tailored to your skill level.</p>
        <Link
          to="/dashboard/interviews/new"
          className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
        >
          Start a Technical Interview
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}
