"use client"

import React from 'react'
import { motion } from 'framer-motion'

export const AboutSection: React.FC = () => {
  return (
    <div className="glass-card rounded-lg p-6 cyber-glow mb-6">
      <h3 className="text-xl font-orbitron text-[#00ff00] mb-4 tracking-wider">
        ABOUT
      </h3>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="text-gray-300 leading-relaxed space-y-3"
        >
          <p>
            <span className="text-[#00ffff] font-semibold font-orbitron">10+</span> years combining{' '}
            <span className="text-[#00ffff] font-semibold font-orbitron">System + Software Engineering</span> to fulfill my visions and tasks.
            Stationed in <span className="text-[#00ffff] font-semibold font-orbitron">Liechtenstein</span>.
          </p>
          <p>
            Former L1 trader, moved to Solana and evolved through the meme trenches.{' '}
            Now an{' '}
            <span
              className="text-[#00ff00] font-semibold font-orbitron cursor-help border-b border-dotted border-[#00ff00]/40 relative group"
              title="Internet Capital Markets - Solana tokens with vision and utility, traded 24/7 globally"
            >
              ICM maxi
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-[#00ff00]/60 rounded text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <span className="block font-semibold text-[#00ff00] mb-1">Internet Capital Markets</span>
                Solana tokens with vision and utility,<br />traded 24/7 globally without intermediaries
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#00ff00]/60"></span>
              </span>
            </span>
            , bridging infrastructure and code to build the future.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 pt-4 border-t border-[#00ffff]/20"
        >
          <a
            href="https://x.com/dominikgstoehl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#003333]/70 text-[#00ffff] rounded hover:bg-[#004444] transition-colors duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
            @dominikgstoehl
          </a>
        </motion.div>
      </div>
    </div>
  )
}
