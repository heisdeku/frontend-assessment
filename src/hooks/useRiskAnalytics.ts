import { useEffect, useRef, useState } from "react";
import { Transaction } from "../types/transaction";
import RiskWorker from "../workers/risk-worker?worker";

import { RiskAnalytics } from "../types/risk";

export const useRiskAnalytics = (transactions: Transaction[]) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAnalytics, setRiskAnalytics] = useState<RiskAnalytics | null>(
    null
  );

  const riskWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    riskWorkerRef.current = new RiskWorker();

    const handleMessage = (e: MessageEvent<RiskAnalytics>) => {
      setRiskAnalytics(e.data);
      setIsAnalyzing(false);
    };

    riskWorkerRef.current.addEventListener("message", handleMessage);

    return () => {
      riskWorkerRef.current?.removeEventListener("message", handleMessage);
      riskWorkerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!riskWorkerRef.current) return;
    if (transactions.length < 1000) return;

    setIsAnalyzing(true);
    riskWorkerRef.current.postMessage(transactions);
  }, [transactions]);

  return { isAnalyzing, riskAnalytics };
};
