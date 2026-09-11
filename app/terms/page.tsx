import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl py-24 md:py-32">
      <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Terms of Use</h1>
      <p className="text-white/60 mb-12">Last Updated: August 2026</p>

      <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-white prose-a:text-[#01b4e4] hover:prose-a:text-[#21d07a] prose-strong:text-white">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Popcorn Rate (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by these terms, please do not use the Service.
        </p>

        <h2>2. Intellectual Property and Copyright</h2>
        <p>
          The original code, layout, and textual content of Popcorn Rate are the property of Popcorn Rate. However, the media assets displayed on this site—including movie posters, backdrop images, actor headshots, character names, and synopses—are the intellectual property of their respective film studios, networks, and creators.
        </p>
        <p>
          We utilize these assets under <strong>Fair Use</strong> principles for the purpose of commentary, review, and informational database indexing. We do not claim ownership over any copyrighted movie materials.
        </p>

        <h2>3. TMDB API Attribution</h2>
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB. 
          All movie data and images are sourced dynamically from The Movie Database (TMDB). We are grateful for their comprehensive database which makes this service possible.
        </p>

        <h2>4. User Conduct</h2>
        <p>
          You agree not to use the Service in any way that causes, or may cause, damage to the Service or impairment of the availability or accessibility of the Service; or in any way which is unlawful, illegal, fraudulent, or harmful.
        </p>

        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, express or implied. 
          We do not guarantee the accuracy, completeness, or timeliness of the movie data provided, as it is aggregated from third-party sources.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall Popcorn Rate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
      </div>
    </div>
  );
}
