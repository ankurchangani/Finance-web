// app/privacy/page.jsx

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-cyan-500/20 mb-6">
            <div className="w-2 h-2 rounded-full dot-cyan animate-pulse"></div>
            <span className="text-sm text-cyan-300">
              FinAI Privacy Policy
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl gradient-title gradient-glow mb-6">
            Privacy Policy
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Your financial information and personal data are protected with
            advanced security, encrypted storage, and secure AI processing.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* Card */}
          <section className="glass-card border rounded-3xl p-8 card-glow hover:card-glow-hover transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              1. Information We Collect
            </h2>

            <p className="text-slate-400 leading-8">
              FinAI collects account details, transaction information,
              budgeting data, savings goals, and AI-generated analytics to
              provide intelligent financial insights and personalized budgeting
              experiences.
            </p>
          </section>

          {/* Card */}
          <section className="glass-card border rounded-3xl p-8 card-glow hover:card-glow-hover transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              2. AI Data Processing
            </h2>

            <p className="text-slate-400 leading-8">
              Our AI features use Gemini AI to analyze spending behavior,
              budgeting patterns, and financial trends. Sensitive information
              is securely processed and never shared publicly.
            </p>
          </section>

          {/* Card */}
          <section className="glass-card border rounded-3xl p-8 card-glow hover:card-glow-hover transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">
              3. Security & Authentication
            </h2>

            <p className="text-slate-400 leading-8">
              We use Clerk Authentication, encrypted database storage, secure
              APIs, and protected server-side architecture to ensure maximum
              security for user accounts and financial records.
            </p>
          </section>

          {/* Card */}
          <section className="glass-card border rounded-3xl p-8 card-glow hover:card-glow-hover transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              4. User Privacy Rights
            </h2>

            <p className="text-slate-400 leading-8">
              Users can update, export, or permanently delete their data at any
              time. FinAI never sells personal information or financial records
              to third parties.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}