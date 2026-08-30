import { useState, useEffect } from "react";

/**
 * Custom Hook: useFetchProducts
 * A dynamic, reusable data-fetching hook. Pass ANY url and it fetches that
 * endpoint when the component mounts (or when the url changes). No API call
 * is hardcoded inside the hook itself.
 *
 * Returns { data, loading, error, refetch }.
 */
export function useFetchProducts(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchKey, setRefetchKey] = useState(0);

  // Allows consumers to manually re-trigger the fetch (e.g. a Retry button)
  const refetch = () => setRefetchKey((k) => k + 1);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!url) {
      return;
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, refetchKey]);

  return { data, loading, error, refetch };
}

export default useFetchProducts;
