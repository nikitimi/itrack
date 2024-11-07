import { useEffect, useState } from 'react';

const useChartDataKeys = (chartData: Record<string, string | number>[]) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const chartKeys =
    isLoaded && chartData.length > 0 ? Object.keys(chartData[0]) : [];

  useEffect(() => {
    if (chartData.length > 0) {
      setIsLoaded(true);
    }
  }, [chartData]);

  return chartKeys;
};

export default useChartDataKeys;
