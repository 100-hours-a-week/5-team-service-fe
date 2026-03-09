import { useEffect, useRef, useState } from "react";

import { TAB_ITEMS, type MeetingDetailTabKey } from "./constants";

type UseMeetingDetailTabsParams = {
  enabled: boolean;
};

export default function useMeetingDetailTabs({ enabled }: UseMeetingDetailTabsParams) {
  const [activeTab, setActiveTab] = useState<MeetingDetailTabKey>("intro");
  const [tabBarOffset, setTabBarOffset] = useState(56);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimerRef = useRef<number | null>(null);
  const scrollEndHandlerRef = useRef<(() => void) | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Record<MeetingDetailTabKey, HTMLDivElement | null>>({
    intro: null,
    leader: null,
    books: null,
    members: null,
    info: null,
  });

  useEffect(() => {
    if (!enabled) return;
    const root = scrollContainerRef.current;
    if (!root) return;
    const tabBar = root.querySelector<HTMLElement>("[data-meeting-detail-tabbar]");
    if (!tabBar) return;

    const updateOffset = () => {
      setTabBarOffset(tabBar.offsetHeight || 56);
    };

    updateOffset();
    const resizeObserver = new ResizeObserver(updateOffset);
    resizeObserver.observe(tabBar);

    return () => {
      resizeObserver.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) return;

        const rootTop = root.getBoundingClientRect().top + tabBarOffset + 1;
        let nearest = visibleEntries[0];
        let minDistance = Math.abs(visibleEntries[0].boundingClientRect.top - rootTop);

        for (const entry of visibleEntries.slice(1)) {
          const distance = Math.abs(entry.boundingClientRect.top - rootTop);
          if (distance < minDistance) {
            nearest = entry;
            minDistance = distance;
          }
        }

        const tab = nearest.target.getAttribute("data-tab") as MeetingDetailTabKey | null;
        if (!tab) return;
        setActiveTab((prev) => (prev === tab ? prev : tab));
      },
      {
        root,
        rootMargin: `-${tabBarOffset + 8}px 0px -45% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    intersectionObserverRef.current = observer;

    TAB_ITEMS.forEach((item) => {
      const section = sectionRefs.current[item.key];
      if (!section) return;
      section.style.scrollMarginTop = `${tabBarOffset + 8}px`;
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      intersectionObserverRef.current = null;
    };
  }, [enabled, tabBarOffset]);

  useEffect(() => {
    TAB_ITEMS.forEach((item) => {
      const section = sectionRefs.current[item.key];
      if (!section) return;
      section.style.scrollMarginTop = `${tabBarOffset + 8}px`;
    });
  }, [tabBarOffset]);

  const assignSectionRef = (tab: MeetingDetailTabKey) => (element: HTMLDivElement | null) => {
    const prev = sectionRefs.current[tab];
    if (prev && intersectionObserverRef.current) {
      intersectionObserverRef.current.unobserve(prev);
    }

    sectionRefs.current[tab] = element;
    if (!element) return;

    element.style.scrollMarginTop = `${tabBarOffset + 8}px`;
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.observe(element);
    }
  };

  const releaseProgrammaticScrollLock = () => {
    isProgrammaticScrollRef.current = false;

    const root = scrollContainerRef.current;
    if (root && scrollEndHandlerRef.current) {
      root.removeEventListener("scrollend", scrollEndHandlerRef.current);
      scrollEndHandlerRef.current = null;
    }

    if (programmaticScrollTimerRef.current) {
      window.clearTimeout(programmaticScrollTimerRef.current);
      programmaticScrollTimerRef.current = null;
    }
  };

  const handleClickTab = (tab: MeetingDetailTabKey) => {
    setActiveTab(tab);

    const target = sectionRefs.current[tab];
    const root = scrollContainerRef.current;
    if (!target || !root) return;

    isProgrammaticScrollRef.current = true;

    if ("onscrollend" in root) {
      if (scrollEndHandlerRef.current) {
        root.removeEventListener("scrollend", scrollEndHandlerRef.current);
      }

      scrollEndHandlerRef.current = () => {
        releaseProgrammaticScrollLock();
      };

      root.addEventListener("scrollend", scrollEndHandlerRef.current, { once: true });
    }

    if (programmaticScrollTimerRef.current) {
      window.clearTimeout(programmaticScrollTimerRef.current);
    }
    programmaticScrollTimerRef.current = window.setTimeout(releaseProgrammaticScrollLock, 500);

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    return () => {
      releaseProgrammaticScrollLock();
    };
  }, []);

  return { activeTab, scrollContainerRef, assignSectionRef, handleClickTab };
}
