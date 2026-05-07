// app/terms/page.jsx

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-blue-500/20 mb-6">
            <div className="w-2 h-2 rounded-full dot-blue animate-pulse"></div>

            <span className="text-sm text-blue-300">
              FinAI Terms & Conditions
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl gradient-title gradient-glow mb-6">
            Terms & Conditions
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Please read these terms carefully before using the FinAI platform,
            AI financial tools, and analytics services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          <section className="glass-card border rounded-3xl p-8 card-glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              1. User Responsibilities
            </h2>

            <p className="text-slate-400 leading-8">
              Users are responsible for maintaining account security,
              protecting login credentials, and ensuring accurate financial
              information within the platform.
            </p>
          </section>

          <section className="glass-card border rounded-3xl p-8 card-glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              2. AI Financial Insights
            </h2>

            <p className="text-slate-400 leading-8">
              AI-generated recommendations and financial analytics are designed
              for informational purposes only and should not be considered
              professional financial advice.
            </p>
          </section>

          <section className="glass-card border rounded-3xl p-8 card-glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">
              3. Account Security
            </h2>

            <p className="text-slate-400 leading-8">
              FinAI uses modern authentication systems and encrypted APIs,
              however users must also take responsibility for protecting their
              accounts and devices.
            </p>
          </section>

          <section className="glass-card border rounded-3xl p-8 card-glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              4. Service Availability
            </h2>

            <p className="text-slate-400 leading-8">
              FinAI may occasionally perform maintenance updates, AI system
              upgrades, and security improvements which could temporarily affect
              platform availability.
            </p>
          </section>

          <section className="glass-card border rounded-3xl p-8 card-glow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              5. Agreement Acceptance
            </h2>

            <p className="text-slate-400 leading-8">
              By using FinAI, users agree to all platform policies, AI usage
              guidelines, and security practices described in these terms and
              conditions.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}