import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl py-24 md:py-32">
      <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Privacy Policy</h1>
      <p className="text-white/60 mb-12">Last Updated: August 2026</p>

      <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-white prose-a:text-[#01b4e4] hover:prose-a:text-[#21d07a] prose-strong:text-white">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Popcorn Rate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we handle your data when you visit and use our website.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          We may collect standard, anonymous analytics data (such as IP addresses, browser types, and page interactions) to understand how our site is used and to improve the user experience. 
          If you create an account in the future, we will collect information necessary to maintain your profile (e.g., email address, saved lists).
        </p>

        <h2>3. Third-Party Services & APIs</h2>
        <p>
          Our application heavily utilizes <strong>The Movie Database (TMDB) API</strong> to fetch and display movie data, images, and reviews. 
          Please note that while we use TMDB services, we are not endorsed or certified by TMDB. Your interaction with TMDB-served content is also subject to their respective privacy guidelines.
        </p>
        <p>
          Additionally, we embed YouTube trailers. Viewing these trailers may subject you to YouTube&apos;s (Google&apos;s) privacy policies and data collection practices.
        </p>

        <h2>4. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
          Cookies are files with a small amount of data which may include an anonymous unique identifier. 
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2>5. Advertising and Monetization</h2>
        <p>
          We may use third-party advertising companies to serve ads when you visit our website. 
          These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
        </p>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </div>
    </div>
  );
}
