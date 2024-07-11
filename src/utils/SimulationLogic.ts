import { arrivalProbabilityData, chargingDemandData } from '@/data';

export interface ChargePoint {
  count: number;
  power: number;
}

const arrivalProbabilityDataConverted = arrivalProbabilityData.map((item) => ({
  timeRange: item.timeRange,
  probability: parseFloat(item.probability.replace('%', '')) / 100,
}));

const chargingDemandDataConverted = chargingDemandData.map((item) => ({
  probability: parseFloat(item.probability.replace('%', '')) / 100,
  demand: item.demand.includes('None')
    ? 0
    : (parseFloat(item.demand.split(' ')[0]) * 18) / 100, // Convert km to kWh
}));

const getChargingDemand = (): number => {
  const random = Math.random() * 100;
  let cumulativeProbability = 0;
  for (const demand of chargingDemandDataConverted) {
    cumulativeProbability += demand.probability * 100;
    if (random <= cumulativeProbability) {
      return demand.demand;
    }
  }
  return 0;
};

const getArrivalProbability = (
  interval: number,
  multiplier: number
): number => {
  const hour = Math.floor(interval / 4) % 24; // Convert interval to hour of day
  const baseProbability = arrivalProbabilityDataConverted[hour].probability;
  return baseProbability * (multiplier / 300); 
};

const simulateEVCharging = (
  chargePoints: ChargePoint[],
  totalIntervals: number,
  arrivalProbabilityMultiplier: number,
  carConsumption: number
): {
  powerUsage: number[];
  totalEnergy: number;
  actualMaxDemand: number;
  totalChargingEvents: number[];
  chargingValues: number[][];
} => {
  if (chargePoints.length === 0) {
    return {
      powerUsage: [],
      totalEnergy: 0,
      actualMaxDemand: 0,
      totalChargingEvents: [],
      chargingValues: [],
    };
  }

  let totalEnergyConsumed = 0;
  let actualMaxDemand = 0;
  const powerUsage = Array(totalIntervals).fill(0);
  const totalChargingEvents = Array(totalIntervals).fill(0);
  const chargingValues: number[][] = chargePoints.flatMap((cp) =>
    Array(cp.count)
      .fill(null)
      .map(() => Array(totalIntervals).fill(0))
  );

  const chargepointStatus = chargePoints.flatMap((cp) =>
    Array(cp.count)
      .fill(0)
      .map(() => ({ remainingDuration: 0, power: cp.power }))
  );

  const maxConcurrentCharging = Math.floor(
    chargePoints.reduce((sum, cp) => sum + cp.count, 0) * 0.5
  ); // Cap at 50% of total charge points

  for (let interval = 0; interval < totalIntervals; interval++) {
    let intervalPowerUsage = 0;
    let concurrentChargingCount = 0;

    // Update existing charging sessions
    for (let i = 0; i < chargepointStatus.length; i++) {
      if (chargepointStatus[i].remainingDuration > 0) {
        chargepointStatus[i].remainingDuration -= 1;
        intervalPowerUsage += chargepointStatus[i].power;
        totalEnergyConsumed += chargepointStatus[i].power * 0.25; // 15 minutes = 0.25 hours
        chargingValues[i][interval] = chargepointStatus[i].power;
        concurrentChargingCount++;
      }
    }

    // Check for new arrivals if concurrent charging count is below cap
    const arrivalProbability = getArrivalProbability(
      interval,
      arrivalProbabilityMultiplier
    );

    for (
      let i = 0;
      i < chargepointStatus.length &&
      concurrentChargingCount < maxConcurrentCharging;
      i++
    ) {
      if (
        chargepointStatus[i].remainingDuration <= 0 &&
        Math.random() < arrivalProbability
      ) {
        const energyDemand = getChargingDemand(); // in kWh
        if (energyDemand > 0) {
          const chargeDuration = Math.ceil(
            energyDemand / (chargepointStatus[i].power * 0.25)
          ); // Convert to 15-minute intervals
          chargepointStatus[i].remainingDuration = chargeDuration;
          totalChargingEvents[interval]++;
          concurrentChargingCount++;
        }
      }
    }

    powerUsage[interval] = intervalPowerUsage;
    actualMaxDemand = Math.max(actualMaxDemand, intervalPowerUsage);
  }

  return {
    powerUsage,
    totalEnergy: totalEnergyConsumed,
    actualMaxDemand,
    totalChargingEvents,
    chargingValues,
  };
};

export const simulateChargingStations = (
  chargePoints: ChargePoint[],
  arrivalProbabilityMultiplier: number,
  carConsumption: number
) => {
  if (chargePoints.length === 0) {
    return {
      powerUsage: [],
      timeLabels: [],
      totalEnergy: 0,
      actualMaxDemand: 0,
      theoreticalMaxDemand: 0,
      concurrencyFactor: 0,
      totalChargingEvents: [],
      chargingValues: [],
    };
  }

  const totalIntervals = 365 * 24 * 4; // One year in 15-minute intervals
  const {
    powerUsage,
    totalEnergy,
    actualMaxDemand,
    totalChargingEvents,
    chargingValues,
  } = simulateEVCharging(
    chargePoints,
    totalIntervals,
    arrivalProbabilityMultiplier,
    carConsumption
  );

  const timeLabels = Array.from({ length: totalIntervals }, (_, i) => {
    const hour = Math.floor(i / 4) % 24;
    return arrivalProbabilityDataConverted[hour].timeRange;
  });

  const theoreticalMaxDemand = chargePoints.reduce(
    (sum, cp) => sum + cp.count * cp.power,
    0
  );
  const concurrencyFactor = actualMaxDemand / theoreticalMaxDemand;

  return {
    powerUsage,
    timeLabels,
    totalEnergy,
    actualMaxDemand,
    theoreticalMaxDemand,
    concurrencyFactor,
    totalChargingEvents,
    chargingValues,
  };
};
