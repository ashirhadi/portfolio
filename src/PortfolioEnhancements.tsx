import { useEffect, useState } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import './portfolio-enhancements.css';

export default function PortfolioEnhancements() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(
        scrollable > 0
          ? (window.scrollY / scrollable) * 100
          : 0
      );

      setShowTop(window.scrollY > 420);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let observer: IntersectionObserver | undefined;

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const targets = document.querySelectorAll<HTMLElement>(
        'main section, .skill-card, .experience-card, .simulator, .tech, .credential'
      );

      targets.forEach((element) => element.classList.add('ahx-reveal'));

      observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('ahx-visible');
              currentObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach((element) => observer?.observe(element));
    }

    return () => {
      window.removeEventListener('scroll', updateScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="ahx-progress"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden="true"
      />

      <div className="ahx-tools" aria-label="Quick tools">
        <a
          className="ahx-mail"
          href="mailto:mashirhadi@gmail.com"
          aria-label="Email Muhammad Ashir Hadi"
          title="Send an email"
        >
          <Mail aria-hidden="true" />
        </a>

        <button
          className={`ahx-top ${showTop ? 'ahx-top-visible' : ''}`}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
          tabIndex={showTop ? 0 : -1}
        >
          <ArrowUp aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
