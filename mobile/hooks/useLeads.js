import { useAuth } from "@clerk/expo";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { getLeads } from "../services/api.js";

export default function useLeads() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Prevent multiple automatic requests at the same time
  const fetchingRef = useRef(false);

  const fetchLeads = useCallback(
    async (isRefresh = false) => {
      // Don't start another request if one is already running
      if (fetchingRef.current) {
        return;
      }

      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setLoading(false);
        setError("Please sign in to view leads");
        return;
      }

      try {
        fetchingRef.current = true;

        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await getToken();

        if (!token) {
          setError("Authentication token not available");
          return;
        }

        console.log("Fetching leads...");

        const data = await getLeads(token);

        console.log("Leads API response:", data);

        if (data?.success) {
          const receivedLeads = Array.isArray(data.data)
            ? data.data
            : [];

          console.log(
            "Setting leads:",
            receivedLeads.length
          );

          setLeads(receivedLeads);
        } else {
          setError(
            data?.message || "Failed to fetch leads"
          );
        }
      } catch (error) {
        console.log("error in useLeads:", error);
        
        console.log("Get leads error:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to fetch leads"
        );
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getToken, isLoaded, isSignedIn]
  );

  /*
   * Load leads when screen gets focus.
   *
   * Important:
   * We intentionally use only isLoaded/isSignedIn here.
   * This prevents the focus effect from repeatedly
   * running whenever fetchLeads gets a new reference.
   */
  useFocusEffect(
    useCallback(() => {
      if (!isLoaded || !isSignedIn) {
        return;
      }

      fetchLeads(false);
    }, [isLoaded, isSignedIn])
  );

  const refreshLeads = useCallback(() => {
    return fetchLeads(true);
  }, [fetchLeads]);

  return {
    leads,
    setLeads,

    loading,
    refreshing,
    error,

    fetchLeads,
    refreshLeads,

    isLoaded,
    isSignedIn,

    getToken,
  };
}