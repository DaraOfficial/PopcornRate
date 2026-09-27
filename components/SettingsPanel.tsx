'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Check, Code2, Sparkles, Trash2 } from 'lucide-react';
import {
  EmbedSettings,
  EXAMPLE_MOVIE_EMBED_TEMPLATE,
  EXAMPLE_TV_EMBED_TEMPLATE,
  EMBED_SETTINGS_EVENT,
  getEmbedSettings,
  saveEmbedSettings,
} from '@/lib/embedSettings';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [embedSettings, setEmbedSettings] = useState<EmbedSettings>({
    enabled: false,
    movieTemplate: '',
    tvTemplate: '',
  });
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setEmbedSettings(getEmbedSettings());

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<EmbedSettings>;
      if (custom.detail) {
        setEmbedSettings(custom.detail);
      } else {
        setEmbedSettings(getEmbedSettings());
      }
    };

    window.addEventListener(EMBED_SETTINGS_EVENT, handleSync);
    return () => window.removeEventListener(EMBED_SETTINGS_EVENT, handleSync);
  }, []);

  const updateSettings = (patch: Partial<EmbedSettings>) => {
    const next: EmbedSettings = {
      ...embedSettings,
      ...patch,
    };
    setEmbedSettings(next);
    saveEmbedSettings(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1400);
  };

  const handleToggleEmbed = () => {
    updateSettings({ enabled: !embedSettings.enabled });
  };

  const handleFillExample = () => {
    updateSettings({
      enabled: true,
      movieTemplate: EXAMPLE_MOVIE_EMBED_TEMPLATE,
      tvTemplate: EXAMPLE_TV_EMBED_TEMPLATE,
    });
  };

  const handleClearLinks = () => {
    updateSettings({
      movieTemplate: '',
      tvTemplate: '',
    });
  };

  return (
    <div className="w-[320px] sm:w-[370px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-150 z-50 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm tracking-wide">Settings</h3>
          {savedFlash && (
            <span className="ml-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 rounded-full animate-in fade-in duration-150">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Embed Mode Toggle Section */}
        <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-white text-[13px] block leading-tight">
                  Embed Mode
                </span>
                <span className="text-[11px] text-white/55 block mt-0.5">
                  Use your own custom browser embed link
                </span>
              </div>
            </div>

            {/* iOS Liquid Glass Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={embedSettings.enabled}
              onClick={handleToggleEmbed}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none ${
                embedSettings.enabled
                  ? 'bg-emerald-500/85 border-emerald-300/60 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                  : 'bg-white/15 border-white/25'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out mt-0.5 ${
                  embedSettings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Expandable Custom Embed Link Inputs when Embed Mode is ON */}
          {embedSettings.enabled && (
            <div className="pt-2.5 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/60 font-medium">
                  Placeholders: <code className="text-amber-300 font-mono">{'{id}'}</code>{' '}
                  <code className="text-amber-300 font-mono">{'{season}'}</code>{' '}
                  <code className="text-amber-300 font-mono">{'{episode}'}</code>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleFillExample}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 px-2 py-0.5 rounded-full transition cursor-pointer"
                    title="Fill example embed links"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Example</span>
                  </button>
                  {(embedSettings.movieTemplate || embedSettings.tvTemplate) && (
                    <button
                      type="button"
                      onClick={handleClearLinks}
                      className="inline-flex items-center justify-center text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 p-1 rounded-full transition cursor-pointer"
                      title="Clear embed links"
                      aria-label="Clear embed links"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Movie Embed Link Input */}
              <div className="space-y-1">
                <label className="text-[11px] text-white/75 font-medium block">
                  Movie Embed Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={embedSettings.movieTemplate}
                    onChange={(e) => updateSettings({ movieTemplate: e.target.value })}
                    placeholder="https://.../embed/movie/{id}?..."
                    className="w-full h-9 rounded-xl bg-black/35 hover:bg-black/45 focus:bg-black/55 border border-white/20 focus:border-white/50 px-3 pr-7 text-[12px] text-white placeholder-white/35 font-mono focus:outline-none transition select-text"
                  />
                  {embedSettings.movieTemplate && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ movieTemplate: '' })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      aria-label="Clear movie link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* TV Show Embed Link Input */}
              <div className="space-y-1">
                <label className="text-[11px] text-white/75 font-medium block">
                  TV Show Embed Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={embedSettings.tvTemplate}
                    onChange={(e) => updateSettings({ tvTemplate: e.target.value })}
                    placeholder="https://.../embed/tv/{id}-{season}-{episode}?..."
                    className="w-full h-9 rounded-xl bg-black/35 hover:bg-black/45 focus:bg-black/55 border border-white/20 focus:border-white/50 px-3 pr-7 text-[12px] text-white placeholder-white/35 font-mono focus:outline-none transition select-text"
                  />
                  {embedSettings.tvTemplate && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ tvTemplate: '' })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      aria-label="Clear TV link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-white/50 block mb-1 font-medium">
            Data Provider
          </label>
          <p className="text-white/90 font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> TMDB Official API
            Connected
          </p>
        </div>

        <div>
          <label className="text-white/50 block mb-1 font-medium">
            Region &amp; Streaming
          </label>
          <p className="text-white/80">
            United States (US) &middot; Global Providers
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/50">App Version</span>
          <span className="text-white/70 font-mono text-[11px]">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
