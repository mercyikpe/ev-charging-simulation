import React, { useEffect, useState } from 'react';

interface ChargePoint {
  count: number;
  power: number;
}

interface SimulationInputsProps {
  chargePoints: ChargePoint[];
  setChargePoints: (value: ChargePoint[]) => void;
  arrivalProbabilityMultiplier: number;
  setArrivalProbabilityMultiplier: (value: number) => void;
  carConsumption: number;
  setCarConsumption: (value: number) => void;
  runSimulation: () => void;
}

const SimulationInputs: React.FC<SimulationInputsProps> = ({
  chargePoints,
  setChargePoints,
  arrivalProbabilityMultiplier,
  setArrivalProbabilityMultiplier,
  carConsumption,
  setCarConsumption,
  runSimulation,
}) => {
  const [newChargePoint, setNewChargePoint] = useState<ChargePoint>({
    count: 5,
    power: 11,
  });

  const addChargePoint = () => {
    setChargePoints([...chargePoints, newChargePoint]);
    setNewChargePoint({ count: 1, power: 11 });
    };

  const removeChargePoint = (index: number) => {
    const updatedChargePoints = [...chargePoints];
    updatedChargePoints.splice(index, 1);
    setChargePoints(updatedChargePoints);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Charge Points</label>
        {chargePoints.length === 0 && (
          <p className="text-red-500">
            No charge points available. Please add at least one.
          </p>
        )}
        {chargePoints.map((cp, index) => (
          <div key={index} className="mb-2 flex items-center mt-4">
            <span className="mr-6">
              {cp.count} x {cp.power} kW
            </span>
            <button
              onClick={() => removeChargePoint(index)}
              className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex items-center mt-4">
          <input
            type="number"
            value={newChargePoint.count}
            onChange={(e) =>
              setNewChargePoint({
                ...newChargePoint,
                count: Number(e.target.value),
              })
            }
            className="p-2 border rounded mr-4 w-1/3"
            min="1"
          />
          <input
            type="number"
            value={newChargePoint.power}
            onChange={(e) =>
              setNewChargePoint({
                ...newChargePoint,
                power: Number(e.target.value),
              })
            }
            className="p-2 border rounded mr-6 w-1/3"
            min="1"
          />

          <button
            onClick={addChargePoint}
            className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none"
          >
            Add new
          </button>
        </div>
      </div>
      <div className="mb-4 mt-6">
        <label className="block mb-2 font-semibold">
          Arrival Probability Multiplier (%)
        </label>
        <input
          type="number"
          value={arrivalProbabilityMultiplier}
          onChange={(e) =>
            setArrivalProbabilityMultiplier(Number(e.target.value))
          }
          className="p-2 border rounded w-1/3"
          min="20"
          max="200"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Car Consumption (kWh/100km)
        </label>
        <input
          type="number"
          value={carConsumption}
          onChange={(e) => setCarConsumption(Number(e.target.value))}
          className="p-2 border rounded w-1/3"
          min="1"
        />
      </div>
      <button
        onClick={runSimulation}
        className={`px-4 py-2 text-white rounded ${
          chargePoints.length === 0
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-500'
        }`}
        disabled={chargePoints.length === 0}
      >
        Run Simulation
      </button>
    </>
  );
};

export default SimulationInputs;
