export interface Author {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string; // rich text represented as HTML string
  coverImage: string;
  authorId: string;
  date: string;
  readTime: string;
  topic: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  views: number;
  status: 'published' | 'draft';
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'publish';
  actorName: string;
  actorAvatar: string;
  articleTitle?: string;
  articleId?: string;
  date: string;
  read: boolean;
}

export interface AnalyticsData {
  viewsOverTime: { date: string; views: number }[];
  followersOverTime: { date: string; followers: number }[];
  likesOverTime: { date: string; likes: number }[];
  topicDistribution: { topic: string; count: number }[];
}

export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    username: 'alexandra_dev',
    name: 'Alexandra Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Software engineer at Vercel. Writing about React, Next.js, TypeScript, and the future of front-end engineering.',
    followers: 1420,
    following: 382,
  },
  {
    id: 'author-2',
    username: 'marcus_design',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Product Designer & Design Systems consultant. Formerly Spotify & Airbnb. Believer in minimal interfaces and micro-interactions.',
    followers: 980,
    following: 215,
  },
  {
    id: 'author-3',
    username: 'elena_ai',
    name: 'Dr. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    bio: 'AI researcher and cognitive scientist. Translating complex neural architectures into human-readable ideas.',
    followers: 3200,
    following: 189,
  },
  {
    id: 'author-4',
    username: 'sarah_growth',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'SaaS founder, bootstrapper, and marketing strategist. Sharing raw experiments in building indie businesses.',
    followers: 2450,
    following: 412,
  },
  {
    id: 'author-5',
    username: 'james_code',
    name: 'James K. Patterson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'Systems engineer. Linux geek. Explaining Rust, assembly, and low-level networking in plain English.',
    followers: 1890,
    following: 504,
  },
  {
    id: 'author-6',
    username: 'lisa_wellness',
    name: 'Lisa Henderson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    bio: 'Wellness advocate, yoga instructor, and writer exploring the intersection of productivity, mental clarity, and slow living.',
    followers: 860,
    following: 220,
  },
  {
    id: 'author-7',
    username: 'david_finance',
    name: 'David Thorne',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    bio: 'Venture partner & macroeconomic researcher. Unpacking global market trends, venture capital mechanics, and crypto networks.',
    followers: 4300,
    following: 112,
  },
  {
    id: 'author-8',
    username: 'sophia_astro',
    name: 'Sophia Alvarez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    bio: 'Science journalist and amateur astronomer. Fascinated by quantum computing, black holes, and the future of space exploration.',
    followers: 1540,
    following: 340,
  },
];

export const mockTopics: string[] = [
  'Technology',
  'Programming',
  'AI',
  'Design',
  'Business',
  'Productivity',
  'Science',
  'Lifestyle',
  'Finance',
  'Venture Capital'
];

export const mockArticles: Article[] = [
  {
    id: 'article-1',
    title: 'The Post-React World: Rethinking Front-End Architecture',
    subtitle: 'Is React still the absolute best choice for modern web apps, or are lightweight, signal-driven frameworks finally claiming the throne?',
    content: `
      <h2>The Shift in Frontend Paradigm</h2>
      <p>For nearly a decade, React has stood as the undisputed king of web interface libraries. Its virtual DOM representation and component-driven model revolutionized how developers think about building views. However, as web applications grow increasingly complex, the overhead of Virtual DOM diffing, runtime rendering, and massive JavaScript bundles has sparked a significant counter-movement.</p>
      
      <blockquote>
        "The best JavaScript code is no JavaScript code at all. When we burden the client with Megabytes of runtime compilation and virtual DOM diffing, the user experiences the cost."
      </blockquote>

      <h2>Enter Signals and Fine-Grained Reactivity</h2>
      <p>Frameworks like SolidJS, Svelte, and Qwik are championing a different approach: compile-time reactivity. Instead of checking the entire component tree for changes on every state transition, these libraries compile components down to specific, targeted DOM modifications. When state changes, only the exact DOM node bound to that state updates. No virtual DOM required.</p>
      
      <p>Let's look at how fine-grained reactivity differs from React's full re-rendering lifecycle:</p>
      <ul>
        <li><strong>React:</strong> State change triggers component re-evaluation -> returns new VDOM -> diffs against old VDOM -> updates changed elements.</li>
        <li><strong>SolidJS:</strong> State change triggers getter/setter function -> directly executes the associated DOM-updating function.</li>
      </ul>

      <h2>Code Comparison</h2>
      <p>Here is a basic counter comparison in a signal-based library like SolidJS:</p>
      <pre><code>import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    &lt;button onClick={() =&gt; setCount(count() + 1)}&gt;
      Clicks: {count()}
    &lt;/button&gt;
  );
}</code></pre>

      <p>Notice how <code>count()</code> is invoked as a function. This registers a dependency, ensuring that only the text node inside the button updates when the signal fires, without running the entire <code>Counter</code> function again.</p>

      <h2>The Resurgence of the Server</h2>
      <p>Coupled with this reactivity shift is the migration back to server-side processing. React Server Components (RSC) and frameworks like Next.js, Remix, and Astro are proving that rendering static parts of pages on the server—and sending only the dynamic bits as minimal JS—is the path forward for optimal performance, especially on low-powered mobile devices.</p>

      <h2>Conclusion: What Should You Build With?</h2>
      <p>React is not going away tomorrow. Its ecosystem is vast, its talent pool is unmatched, and libraries like Next.js are pushing the boundaries of server integration. However, as developers, we must remain critical. For content-rich sites, landing pages, or speed-critical apps, exploring lightweight frameworks like Astro or SolidJS is no longer a niche choice—it is a competitive necessity.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-1',
    date: 'Aug 18, 2026',
    readTime: '6 min read',
    topic: 'Programming',
    tags: ['React', 'JavaScript', 'WebDev', 'Architecture'],
    likes: 342,
    commentsCount: 28,
    views: 4500,
    status: 'published',
  },
  {
    id: 'article-2',
    title: 'Designing with Micro-Animations: Delighting Users Without Distraction',
    subtitle: 'How subtle hover states, spring transitions, and interactive physics make digital products feel organic and premium.',
    content: `
      <h2>The Purpose of Micro-Animations</h2>
      <p>Micro-animations are small, functional animations that guide user interaction, provide immediate feedback, and inject personality into an interface. When done correctly, they are barely noticeable but make the product feel incredibly responsive, tactile, and professional.</p>

      <blockquote>
        "Design is not just what it looks like and feels like. Design is how it works. Animations explain how things relate to each other."
      </blockquote>

      <h2>The Rules of Premium Interface Motion</h2>
      <p>Too many animations can clutter an interface and cause cognitive overload or motion sickness. To keep animations elegant, follow these fundamental principles:</p>
      
      <ol>
        <li><strong>Use organic easing curves:</strong> Avoid linear motion. Use cubic-bezier curves (like <code>cubic-bezier(0.16, 1, 0.3, 1)</code>) or spring physics that mimic real-world friction and inertia.</li>
        <li><strong>Keep durations short:</strong> Most UI transitions should complete within 150ms to 300ms. Anything slower feels sluggish.</li>
        <li><strong>State continuity:</strong> Elements should appear to move from somewhere, not just flash into existence. Use layout morphs to show containment hierarchy.</li>
      </ol>

      <h2>Implementing Spring Easing in CSS</h2>
      <p>While CSS transitions are great, using keyframes or spring-like curves elevates the user experience. For instance, a subtle card pop on hover can be achieved using a fast spring transition:</p>
      <pre><code>.card-hover {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}</code></pre>

      <p>This spring curve causes a slight overshoot, giving the card a bouncy, tangible feel that rewards user curiosity.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-2',
    date: 'Aug 20, 2026',
    readTime: '4 min read',
    topic: 'Design',
    tags: ['Design', 'UIUX', 'CSS', 'FramerMotion'],
    likes: 215,
    commentsCount: 12,
    views: 2800,
    status: 'published',
  },
  {
    id: 'article-3',
    title: 'Beyond Transformers: The Quest for the Next Generation of AI Architectures',
    subtitle: 'While ChatGPT and LLMs rely on the Transformer architecture, researchers are looking at SSMs and Mamba for what comes next.',
    content: `
      <h2>The Limitations of Attention</h2>
      <p>Since the seminal "Attention Is All You Need" paper in 2017, the Transformer architecture has dominated deep learning. Its self-attention mechanism enables massive parallelization during training and models long-range dependencies incredibly well. However, self-attention suffers from a critical flaw: quadratic computational complexity relative to context length.</p>
      
      <blockquote>
        "Quadratic scaling means that doubling the input text quadruples the computational cost. This makes processing entire books, code repositories, or high-definition video in context windows prohibitively expensive."
      </blockquote>

      <h2>Mamba and State Space Models (SSMs)</h2>
      <p>To overcome this limitation, researchers have proposed Structured State Space Sequence Models (S4) and, more recently, Mamba. Unlike Transformers, Mamba scales linearly (<code>O(N)</code>) with context length. It behaves like a hybrid between a Recurrent Neural Network (RNN) and a convolutional network, updating a compact state vector recursively while still allowing highly parallelized training.</p>

      <h2>Why It Matters</h2>
      <p>Linear scaling opens the door to processing millions of tokens in real-time. Imagine an AI model that can ingest a company's entire codebase, financial history, or video logs, and reason over them in a fraction of a second on standard consumer hardware.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-3',
    date: 'Aug 19, 2026',
    readTime: '8 min read',
    topic: 'AI',
    tags: ['AI', 'DeepLearning', 'Transformers', 'Mamba'],
    likes: 512,
    commentsCount: 42,
    views: 8900,
    status: 'published',
  },
  {
    id: 'article-4',
    title: 'The Art of the Solo Bootstrap: Lessons from $20k/mo Micro-SaaS Founders',
    subtitle: 'You do not need venture capital or a team of ten to build a highly profitable SaaS. Here is the blueprint for the solo developer.',
    content: `
      <h2>The Solo Bootstrapper Philosophy</h2>
      <p>The tech industry glorifies venture-backed unicorns, but a quiet revolution is taking place. Individual developers, marketers, and designers are launching micro-products that generate five figures in monthly recurring revenue (MRR) with virtually zero overhead. This is the era of the solo bootstrap.</p>

      <h2>1. Solve Your Own, Highly Specific Problems</h2>
      <p>Do not try to build the next Salesforce or Trello. Find a tiny, painful friction point in your own daily workflow. If you have the problem, it is highly likely that thousands of other businesses do too, and they are willing to pay $9 to $49 a month to make it go away.</p>

      <h2>2. Keep the Tech Stack Boring</h2>
      <p>Do not waste weeks configuring complex microservices, Kubernetes clusters, or state-of-the-art frameworks. Use what you know best. Whether it is Laravel, Rails, Next.js, or Django—your users do not care about your database config; they care about their problem being solved.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-4',
    date: 'Aug 15, 2026',
    readTime: '5 min read',
    topic: 'Business',
    tags: ['SaaS', 'IndieHackers', 'Solopreneur', 'Business'],
    likes: 418,
    commentsCount: 31,
    views: 6200,
    status: 'published',
  },
  {
    id: 'article-5',
    title: 'Why Rust is Moving from Infrastructure to the Core of Consumer Apps',
    subtitle: 'From video editors to collaborative canvas boards, why modern desktop and web platforms are choosing Rust over C++ and JavaScript.',
    content: `
      <h2>The Performance Imperative</h2>
      <p>Rust initially gained notoriety as a replacement for C and C++ in systems programming—operating systems, databases, and network proxies. But in the last three years, Rust has made a dramatic entry into client-side application development. Companies like Figma, Discord, and 1Password are rewriting large parts of their frontend or client applications in Rust.</p>
      
      <h2>Safety Without Garbage Collection</h2>
      <p>JavaScript and Python rely on garbage collection to manage memory, which can lead to random stutters and lag. Rust uses an innovative ownership and borrow-checker system. This guarantees memory safety at compile time without any runtime overhead, leading to smooth, frame-perfect interactions in consumer apps.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-5',
    date: 'Aug 12, 2026',
    readTime: '7 min read',
    topic: 'Programming',
    tags: ['Rust', 'Systems', 'Wasm', 'Performance'],
    likes: 290,
    commentsCount: 19,
    views: 3900,
    status: 'published',
  },
  {
    id: 'article-6',
    title: 'The Slow Productivity Movement: Escaping the Trap of Over-Commitment',
    subtitle: 'Why doing less, focusing on quality, and working at a natural pace is the real key to long-term creative output.',
    content: `
      <h2>The Burnout Epidemic</h2>
      <p>In our hyper-connected world, productivity is often measured by task volume—how many emails you replied to, how many tickets you closed, or how many meetings you attended. But this constant context-switching leads to chronic stress and superficial outputs.</p>

      <h2>What is Slow Productivity?</h2>
      <p>Coined by author Cal Newport, Slow Productivity is built on three core pillars:</p>
      <ol>
        <li>Do fewer things.</li>
        <li>Work at a natural pace.</li>
        <li>Obsess over quality.</li>
      </ol>
      <p>By giving yourself the time and breathing room to work deeply on one project at a time, you build work that actually matters and endures.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-6',
    date: 'Aug 14, 2026',
    readTime: '5 min read',
    topic: 'Productivity',
    tags: ['Productivity', 'Mindfulness', 'Calm', 'Writing'],
    likes: 185,
    commentsCount: 15,
    views: 2400,
    status: 'published',
  },
  {
    id: 'article-7',
    title: 'Understanding Yield Curves: The Macro Signals Every Tech Investor Must Watch',
    subtitle: 'A breakdown of bond yields, interest rates, and why the shape of the yield curve dictates VC valuations and startup budgets.',
    content: `
      <h2>The Bond Market is the Real Boss</h2>
      <p>Tech developers often focus on tech stock prices or crypto tickers, but the true driver of the global financial system is the government bond market. Specifically, the yield curve—the graph plotting interest rates of short-term vs. long-term bonds—serves as the primary indicator of economic health.</p>

      <h2>What is an Inverted Yield Curve?</h2>
      <p>In normal times, long-term bonds offer higher interest rates than short-term ones because locking up money for 10 or 30 years carries more risk. An inverted yield curve happens when short-term interest rates are higher than long-term rates. Historically, this inversion has preceded almost every major recession in the modern era.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-7',
    date: 'Aug 10, 2026',
    readTime: '7 min read',
    topic: 'Finance',
    tags: ['Finance', 'Economy', 'VC', 'Startups'],
    likes: 156,
    commentsCount: 8,
    views: 1900,
    status: 'published',
  },
  {
    id: 'article-8',
    title: 'The James Webb Telescope and the Rewriting of Early Galactic History',
    subtitle: 'Why the discovery of massive, mature galaxies in the early universe has left cosmologists scratching their heads.',
    content: `
      <h2>A Cosmic Puzzle</h2>
      <p>When the James Webb Space Telescope (JWST) launched, astronomers expected to see tiny, chaotic protogalaxies forming in the early stages of the cosmos. Instead, they found massive, well-structured, luminous galaxies existing just 300 to 500 million years after the Big Bang.</p>

      <blockquote>
        "Finding mature galaxies at the dawn of time is the cosmological equivalent of finding a fully formed adult skeleton inside an infant cradle."
      </blockquote>

      <h2>Challenging the Standard Model</h2>
      <p>These observations challenge our standard cosmological model (Lambda-CDM), which dictates that dark matter structures and baryonic matter assemble gradually over billions of years. Researchers are now reconsidering early feedback loops, black hole formation rates, and the density of gas clouds in the early universe.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-8',
    date: 'Aug 16, 2026',
    readTime: '9 min read',
    topic: 'Science',
    tags: ['Space', 'Science', 'Astronomy', 'Physics'],
    likes: 420,
    commentsCount: 36,
    views: 5700,
    status: 'published',
  },
  {
    id: 'article-9',
    title: 'How CSS Grid Container Queries Will Finally Kill Component Breakpoints',
    subtitle: 'Responsive design is shifting from the page viewport to the individual component. Here is how container queries change the game.',
    content: `
      <h2>The Media Query Problem</h2>
      <p>For over a decade, we have styled components based on viewport width (e.g., <code>@media (max-width: 768px)</code>). But in modular dashboards or grid systems, a component might be placed inside a thin sidebar or a wide main column. In these cases, media queries fail because they do not know the actual space the component has.</p>

      <h2>Enter Container Queries</h2>
      <p>Container queries allow us to query the dimensions of a parent container. A card component can change its layout from a vertical card to a horizontal list card depending on the width of its *immediate wrapper*, regardless of whether the user is on a phone or an ultra-wide monitor.</p>
      
      <pre><code>.container-wrapper {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .card {
    flex-direction: column;
  }
}</code></pre>
    `,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-1',
    date: 'Aug 08, 2026',
    readTime: '4 min read',
    topic: 'Programming',
    tags: ['CSS', 'WebDev', 'Responsive', 'HTML'],
    likes: 198,
    commentsCount: 14,
    views: 2900,
    status: 'published',
  },
  {
    id: 'article-10',
    title: 'The AI-Powered Developer: Copilot, Cursor, and the 10x Velocity Illusion',
    subtitle: 'Are coding assistants making us significantly faster, or are we just writing code we do not fully understand at an alarming rate?',
    content: `
      <h2>The Hype vs. The Reality</h2>
      <p>AI text completion tools like GitHub Copilot and dedicated IDEs like Cursor have become standard in the developer toolkit. Promised as productivity multipliers that turn junior developers into seniors, these tools are undoubtedly changing the mechanics of software construction.</p>

      <h2>The Code Smell of AI Generation</h2>
      <p>While AI is brilliant at generating boilerplate code, algorithms, and regex, it has a tendency to introduce subtle logic errors or duplicate code patterns. Developers spend less time typing, but significantly more time debugging edge cases and reviewing large pull requests.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-3',
    date: 'Aug 11, 2026',
    readTime: '6 min read',
    topic: 'AI',
    tags: ['AI', 'Programming', 'Coding', 'Engineering'],
    likes: 387,
    commentsCount: 29,
    views: 4800,
    status: 'published',
  },
  {
    id: 'article-11',
    title: 'The Rise of Solarpunk: Aesthetic, Ethics, and the Hopeful Future',
    subtitle: 'Unlike the dark, dystopian themes of Cyberpunk, Solarpunk offers a vision of high technology merged with ecological harmony.',
    content: `
      <h2>A Vision of Coexistence</h2>
      <p>Most science fiction films paint a grim picture of the future: toxic rain, corporate overlords, neon-lit alleys, and decaying ecosystems. Solarpunk is the rebellious alternative. It is an aesthetic and philosophical movement that asks: what if we got it right?</p>

      <h2>Eco-Aesthetic Meets Smart Tech</h2>
      <p>Solarpunk does not advocate returning to primitive lifestyles. It envisions cities covered in vertical gardens, local solar microgrids, community workshops, and advanced materials working in tandem with the natural environment.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-6',
    date: 'Aug 05, 2026',
    readTime: '5 min read',
    topic: 'Lifestyle',
    tags: ['Solarpunk', 'Ethics', 'Future', 'Environment'],
    likes: 245,
    commentsCount: 16,
    views: 3100,
    status: 'published',
  },
  {
    id: 'article-12',
    title: 'Demystifying Zero-Knowledge Proofs: Privacy for the Modern Web',
    subtitle: 'An intuitive guide to ZK-SNARKs and how cryptography allows you to prove you know a secret without revealing it.',
    content: `
      <h2>The Cryptographic Magic</h2>
      <p>Imagine showing someone you have the key to a locked room without actually showing them the key or opening the door. That is the essence of a Zero-Knowledge Proof (ZKP). It is a mathematical breakthrough that is forming the basis of next-generation privacy networks.</p>

      <h2>Practical Applications</h2>
      <p>Zero-knowledge technology is moving out of academic papers and into real-world systems, enabling private identity verification, secure voting systems, and scaling layers for blockchains.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-5',
    date: 'Aug 03, 2026',
    readTime: '8 min read',
    topic: 'Technology',
    tags: ['Security', 'Cryptography', 'Privacy', 'Blockchain'],
    likes: 178,
    commentsCount: 7,
    views: 2200,
    status: 'published',
  },
  {
    id: 'article-13',
    title: 'Why Venture Capital is Moving Towards Smaller, High-Focus Funds',
    subtitle: 'The era of mega-funds is pausing. Why investors are returning to seed-stage focus and specialized technological domains.',
    content: `
      <h2>The Capital Overhang</h2>
      <p>During the zero-interest-rate policy (ZIRP) era, massive sovereign wealth and pension funds poured trillions into venture capital. The result was multi-billion dollar venture funds chasing high-growth valuations, leading to inflated cash burn and inefficient operations in startups.</p>

      <h2>The Seed Resurgence</h2>
      <p>Now, VC firms are recognizing that smaller, highly specialized funds often yield superior returns. Capital is returning to seed stages where active mentorship, domain expertise, and capital efficiency still matter.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-7',
    date: 'Aug 01, 2026',
    readTime: '6 min read',
    topic: 'Venture Capital',
    tags: ['VC', 'Business', 'Startups', 'Finance'],
    likes: 132,
    commentsCount: 9,
    views: 1500,
    status: 'published',
  },
  {
    id: 'article-14',
    title: 'Draft: The Future of Quantum Dots in Commercial Displays',
    subtitle: 'A technical exploration of electroluminescent quantum dots (ELQD) and their threat to OLED dominance.',
    content: `
      <p>This is a draft post discussing quantum dot technology. Electroluminescent quantum dots (ELQD) represent a significant departure from standard photo-luminescent sheets. By applying electrical current directly to nanoparticles, displays can achieve the deep blacks of OLEDs alongside the brightness and color purity of LEDs, without the risk of organic burn-in.</p>
      <p>Key topics to cover in the finished piece:</p>
      <ul>
        <li>Fabrication challenges of blue quantum dots.</li>
        <li>Cadmium-free manufacturing standards.</li>
        <li>Current active research labs and commercial timeline (Samsung, BOE).</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-8',
    date: 'Aug 22, 2026',
    readTime: '3 min read',
    topic: 'Science',
    tags: ['Hardware', 'Physics', 'Quantum', 'Display'],
    likes: 0,
    commentsCount: 0,
    views: 0,
    status: 'draft',
  },
  {
    id: 'article-15',
    title: 'Draft: 10 Micro-habits to Reclaim 5 Hours of Deep Work Weekly',
    subtitle: 'Small changes in how you structure your browser tabs, notification profiles, and morning tea routine.',
    content: `
      <p>Draft ideas on simple habit adjustments:</p>
      <ol>
        <li><strong>The Single Tab Rule:</strong> Only keep one tab open during core writing sessions.</li>
        <li><strong>Airplane Mode Mornings:</strong> Do not check messages/emails until you have finished your first 60-minute deep block.</li>
        <li><strong>Friction Filters:</strong> Log out of social media apps after every session so logging back in requires active effort.</li>
      </ol>
    `,
    coverImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=800&q=80',
    authorId: 'author-1',
    date: 'Aug 21, 2026',
    readTime: '3 min read',
    topic: 'Productivity',
    tags: ['Productivity', 'Habits', 'LifeHacks'],
    likes: 0,
    commentsCount: 0,
    views: 0,
    status: 'draft',
  }
];

export const mockComments: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'article-1',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Brilliant writeup, Alexandra! The signal-based approach truly makes React feel like a heavy behemoth. However, I wonder if the lack of standardized state-management patterns in Solid or Svelte might keep enterprises locked into React for a while longer.',
    date: 'Aug 19, 2026',
    likes: 12,
  },
  {
    id: 'comm-2',
    articleId: 'article-1',
    authorName: 'James K. Patterson',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    content: 'Fully agree on the compile-time gains. SolidJS compilation output is incredibly clean. It literally maps components to direct `document.createElement` calls, avoiding all that extra runtime library logic.',
    date: 'Aug 19, 2026',
    likes: 8,
  },
  {
    id: 'comm-3',
    articleId: 'article-3',
    authorName: 'Alexandra Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: 'SSMs are definitely promising. The quadratic bottleneck is real. However, do you think SSMs will be able to handle complex coding tasks where global context relationships are highly non-linear and require strict token alignment?',
    date: 'Aug 20, 2026',
    likes: 15,
  },
  {
    id: 'comm-4',
    articleId: 'article-4',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Great tips, Sarah. Keeping the stack boring is the most underrated advice in tech. I built my first product using basic Rails and SQLite and it did $10k in its first year without a single server issue.',
    date: 'Aug 17, 2026',
    likes: 24,
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'follow',
    actorName: 'Dr. Elena Rostova',
    actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    date: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'like',
    actorName: 'Marcus Vance',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    articleTitle: 'The Post-React World: Rethinking Front-End Architecture',
    articleId: 'article-1',
    date: '5 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'comment',
    actorName: 'James K. Patterson',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    articleTitle: 'The Post-React World: Rethinking Front-End Architecture',
    articleId: 'article-1',
    date: '1 day ago',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'publish',
    actorName: 'Dr. Elena Rostova',
    actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    articleTitle: 'Beyond Transformers: The Quest for the Next Generation of AI Architectures',
    articleId: 'article-3',
    date: '3 days ago',
    read: true,
  }
];

export const mockAnalytics: AnalyticsData = {
  viewsOverTime: [
    { date: 'Mon', views: 240 },
    { date: 'Tue', views: 320 },
    { date: 'Wed', views: 450 },
    { date: 'Thu', views: 380 },
    { date: 'Fri', views: 520 },
    { date: 'Sat', views: 600 },
    { date: 'Sun', views: 780 }
  ],
  followersOverTime: [
    { date: 'Mon', followers: 1390 },
    { date: 'Tue', followers: 1395 },
    { date: 'Wed', followers: 1402 },
    { date: 'Thu', followers: 1408 },
    { date: 'Fri', followers: 1412 },
    { date: 'Sat', followers: 1415 },
    { date: 'Sun', followers: 1420 }
  ],
  likesOverTime: [
    { date: 'Mon', likes: 20 },
    { date: 'Tue', likes: 28 },
    { date: 'Wed', likes: 35 },
    { date: 'Thu', likes: 30 },
    { date: 'Fri', likes: 45 },
    { date: 'Sat', likes: 50 },
    { date: 'Sun', likes: 62 }
  ],
  topicDistribution: [
    { topic: 'Programming', count: 3 },
    { topic: 'AI', count: 2 },
    { topic: 'Design', count: 1 },
    { topic: 'Business', count: 1 },
    { topic: 'Productivity', count: 1 },
    { topic: 'Science', count: 1 }
  ]
};
