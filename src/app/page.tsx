'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSealScratched, setIsSealScratched] = useState(false);
  const [isSealScratching, setIsSealScratching] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);

  // 3D Card Effect
  useEffect(() => {
    const wrapper = cardWrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    let isHovering = false;
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let animationId: number;

    const animate = () => {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        card.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => {
      isHovering = false;
      currentX = currentY = targetX = targetY = 0;
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      card.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => { card.style.transition = 'transform 0.1s ease-out'; }, 500);
    };
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isHovering) return;
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = ((e.clientX - centerX) / (rect.width / 2)) * 20;
      targetY = -((e.clientY - centerY) / (rect.height / 2)) * 15;
    };

    wrapper.addEventListener('mouseenter', handleMouseEnter);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
    wrapper.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      wrapper.removeEventListener('mouseenter', handleMouseEnter);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      wrapper.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Background glow parallax
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const glow = document.querySelector('.background-glow') as HTMLElement;
      if (!glow) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
      glow.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('.copyable') || target.closest('.cvv-seal')) return;
    setIsFlipped(!isFlipped);
  };

  const handleCopy = async (text: string, displayText: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(displayText);
      setTimeout(() => setCopiedText(null), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleScratch = () => {
    if (isSealScratching || isSealScratched) return;
    setIsSealScratching(true);
    setTimeout(() => {
      setIsSealScratched(true);
      setIsSealScratching(false);
    }, 600);
  };

  const techStackRow1 = ['react', 'nextdotjs', 'typescript', 'javascript', 'tailwindcss', 'html5', 'css3', 'python'];
  const techStackRow2 = ['nodedotjs', 'express', 'mongodb', 'postgresql', 'redis', 'docker', 'kubernetes', 'amazonaws'];

  return (
    <>
      <div className="background-glow" />
      <main className="container">
        <div className="card-wrapper" ref={cardWrapperRef}>
          <div className="card" ref={cardRef} onClick={handleCardClick}>
            <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* Card Front */}
              <div className="card-front">
                <div className="card-header">
                  <div className="card-chip">
                    <div className="chip-lines">
                      <div className="chip-col"><span /><span /><span /><span /></div>
                      <div className="chip-col chip-col-center"><span /><span /><span /></div>
                      <div className="chip-col"><span /><span /><span /><span /></div>
                    </div>
                  </div>
                  <div className="card-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-info">
                    <div className="card-name">DO MINH QUANG</div>
                    <div className="card-title">Founder of <a href="https://hextra.us" target="_blank" className="hextra-link">Hextra</a></div>
                  </div>
                  <div className="card-qr">
                    <Image src="/img/qr-code.png" alt="QR Code" width={68} height={68} />
                  </div>
                </div>

                <div className="card-footer">
                  <div className="card-date">
                    <span className="label">BIRTH DATE</span>
                    <span className="value">JUNE 12, 1994</span>
                  </div>
                  <div className="card-social">
                    <a href="https://github.com/quangdo126" target="_blank" className="social-icon" title="GitHub">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </a>
                    <a href="https://www.facebook.com/quangdo126" target="_blank" className="social-icon" title="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/quangdo126" target="_blank" className="social-icon" title="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </a>
                  </div>
                </div>
                <div className="card-shine" />
              </div>

              {/* Card Back */}
              <div className="card-back">
                <div className="card-back-header">
                  <div className="contact-area">
                    <span className="contact-text">
                      To contact please call{' '}
                      <strong
                        className="copyable"
                        onClick={() => handleCopy('+84902881467', '+84 902 881 467')}
                        style={{ color: copiedText === '+84 902 881 467' ? '#c9a962' : undefined }}
                      >
                        {copiedText === '+84 902 881 467' ? 'Copied!' : '+84 902 881 467'}
                      </strong>
                      {' '}or email to{' '}
                      <strong
                        className="copyable"
                        onClick={() => handleCopy('quangdo1206@gmail.com', 'quangdo1206@gmail.com')}
                        style={{ color: copiedText === 'quangdo1206@gmail.com' ? '#c9a962' : undefined }}
                      >
                        {copiedText === 'quangdo1206@gmail.com' ? 'Copied!' : 'quangdo1206@gmail.com'}
                      </strong>
                    </span>
                  </div>
                  <div className="tech-stack-header">
                    <div className="tech-row">
                      {techStackRow1.map((icon) => (
                        <Image key={icon} src={`/img/icons/${icon}.svg`} className="tech-icon-sm" alt={icon} title={icon} width={18} height={18} />
                      ))}
                    </div>
                    <div className="tech-row">
                      {techStackRow2.map((icon) => (
                        <Image key={icon} src={`/img/icons/${icon}.svg`} className="tech-icon-sm" alt={icon} title={icon} width={18} height={18} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-back-body">
                  <div className="signature-strip">
                    <div className="cvv-box">
                      <span className="cvv-label">CVV</span>
                      <div className="cvv-wrapper">
                        <span className="cvv-value">126</span>
                        {!isSealScratched && (
                          <div
                            className={`cvv-seal ${isSealScratching ? 'scratching' : ''}`}
                            onClick={handleScratch}
                            title="Click to scratch"
                          >
                            <span className="seal-text">SCRATCH</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-back-footer">
                  <div className="card-back-text">
                    <p>Currently improving my skills in Cloud Native Architectures & CI/CD automation.</p>
                    <p>Looking to collaborate on open-source full-stack and infrastructure automation projects.</p>
                    <p>Ask me about React, Next.js, Docker, Kubernetes, or CI/CD pipelines.</p>
                    <p><span className="highlight">Fun fact:</span> I automate everything I can.</p>
                  </div>
                </div>
                <div className="card-shine" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
