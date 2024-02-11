import { useEffect, useRef, useState } from 'react';

function useInfiniteScroll() {
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const option = {
      threshold: 1.0
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  return { loadMoreRef, page };
}

export default useInfiniteScroll;
