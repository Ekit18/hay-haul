import { useEffect, useRef, useState } from 'react';

function useInfiniteScroll({ maxPage }: { maxPage?: number }) {
  const [page, setPage] = useState(0);
  const hasMore = maxPage ? page + 1 < maxPage : false;

  const loadMoreRef = useRef(null);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;

    if (target.isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const resetPage = () => {
    setPage(0);
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

  return { loadMoreRef, page, resetPage };
}

export default useInfiniteScroll;
