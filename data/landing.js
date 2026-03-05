import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
    {
        Icon: BarChart3,
        title: "Advanced Analytics",
        description: "Get detailed insights into your spending patterns with AI-powered analytics and real-time visual breakdowns.",
        colorClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/20",
        glowClass: "group-hover:shadow-blue-500/20",
        badge: "AI Powered",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        stat: "2B+ data points",
        statColor: "text-blue-400",
        dotColor: "bg-blue-400",
        topLine: "from-transparent via-blue-400/80 to-transparent",
        hoverBorder: "group-hover:border-blue-500/40",
        innerGlow: "group-hover:bg-blue-500/5",
    },
    {
        Icon: Receipt,
        title: "Smart Receipt Scanner",
        description: "Extract data automatically from receipts using advanced AI vision technology. Zero manual entry required.",
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/20",
        glowClass: "group-hover:shadow-emerald-500/20",
        badge: "Instant",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        stat: "99.3% accuracy",
        statColor: "text-emerald-400",
        dotColor: "bg-emerald-400",
        topLine: "from-transparent via-emerald-400/80 to-transparent",
        hoverBorder: "group-hover:border-emerald-500/40",
        innerGlow: "group-hover:bg-emerald-500/5",
    },
    {
        Icon: PieChart,
        title: "Budget Planning",
        description: "Create and manage budgets with intelligent recommendations that adapt dynamically to your lifestyle.",
        colorClass: "text-amber-400",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/20",
        glowClass: "group-hover:shadow-amber-500/20",
        badge: "Smart",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        stat: "Avg 34% savings",
        statColor: "text-amber-400",
        dotColor: "bg-amber-400",
        topLine: "from-transparent via-amber-400/80 to-transparent",
        hoverBorder: "group-hover:border-amber-500/40",
        innerGlow: "group-hover:bg-amber-500/5",
    },
    {
        Icon: CreditCard,
        title: "Multi-Account Support",
        description: "Manage multiple accounts and credit cards in one unified dashboard with real-time sync across all institutions.",
        colorClass: "text-violet-400",
        bgClass: "bg-violet-500/10",
        borderClass: "border-violet-500/20",
        glowClass: "group-hover:shadow-violet-500/20",
        badge: "Unified",
        badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        stat: "10K+ banks",
        statColor: "text-violet-400",
        dotColor: "bg-violet-400",
        topLine: "from-transparent via-violet-400/80 to-transparent",
        hoverBorder: "group-hover:border-violet-500/40",
        innerGlow: "group-hover:bg-violet-500/5",
    },
    {
        Icon: Globe,
        title: "Multi-Currency",
        description: "Support for 150+ currencies with live conversion rates and automatic categorization across borders.",
        colorClass: "text-cyan-400",
        bgClass: "bg-cyan-500/10",
        borderClass: "border-cyan-500/20",
        glowClass: "group-hover:shadow-cyan-500/20",
        badge: "Global",
        badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        stat: "150+ currencies",
        statColor: "text-cyan-400",
        dotColor: "bg-cyan-400",
        topLine: "from-transparent via-cyan-400/80 to-transparent",
        hoverBorder: "group-hover:border-cyan-500/40",
        innerGlow: "group-hover:bg-cyan-500/5",
    },
    {
        Icon: Zap,
        title: "Automated Insights",
        description: "Get proactive financial insights and AI-driven recommendations before issues arise — always one step ahead.",
        colorClass: "text-pink-400",
        bgClass: "bg-pink-500/10",
        borderClass: "border-pink-500/20",
        glowClass: "group-hover:shadow-pink-500/20",
        badge: "Proactive",
        badgeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
        stat: "Daily reports",
        statColor: "text-pink-400",
        dotColor: "bg-pink-400",
        topLine: "from-transparent via-pink-400/80 to-transparent",
        hoverBorder: "group-hover:border-pink-500/40",
        innerGlow: "group-hover:bg-pink-500/5",
    },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Welth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend Welth to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];
