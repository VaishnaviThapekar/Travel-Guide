import { useEffect } from 'react';

export default function useReveal(selector = '[data-reveal]') {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
        if (!els.length) return;

        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        el.classList.add('is-revealed');
                        obs.unobserve(el);
                    }
                }
            },
            { threshold: 0.12 }
        );

        els.forEach((el) => obs.observe(el));

        return () => obs.disconnect();
    }, [selector]);
}
