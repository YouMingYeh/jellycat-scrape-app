import React from "react";

interface RatesTableProps {
  rates: Record<string, number>;
  handleRatesClick: () => void;
}

const RatesTable: React.FC<RatesTableProps> = ({ rates, handleRatesClick }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-lg fixed top-8 left-8 hover:opacity-100 opacity-70">
      <h1 className="text-2xl font-bold mb-4">匯率:</h1>
      <div className="code-block h-48 overflow-y-scroll p-8">
        <table className="border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Currency</th>
              <th className="border border-gray-300 p-2">Rate</th>
            </tr>
          </thead>
          <tbody>
            {rates &&
              Object.entries(rates).map(([currency, rate]) => (
                <tr key={currency}>
                  <td className="border border-gray-300 p-2">{currency}</td>
                  <td className="border border-gray-300 p-2">{rate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleRatesClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Rates
      </button>
    </div>
  );
};

export default RatesTable;
