import React, { useEffect, useState } from "react";
import { compare_prices_with_names } from "../APIs";

const ComparePrices: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [jellycat_name, setJellycatName] = useState<string>("");
  const [selfridge_name, setSelfridgeName] = useState<string>("");
  const [campusgifts_name, setCampusgiftsName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (jellycat_name && selfridge_name && campusgifts_name) {
        const result = await compare_prices_with_names(
          jellycat_name,
          selfridge_name,
          campusgifts_name
        );
        setData(result);
      }
    };

    fetchData();
  }, [jellycat_name, selfridge_name, campusgifts_name]);

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-96">
      <h1 className="text-2xl font-bold mb-4">利潤比較:</h1>
      <input
        type="text"
        placeholder="Jellycat Name"
        value={jellycat_name}
        onChange={(e) => setJellycatName(e.target.value)}
        className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="text"
        placeholder="Selfridge Name"
        value={selfridge_name}
        onChange={(e) => setSelfridgeName(e.target.value)}
        className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="text"
        placeholder="Campusgifts Name"
        value={campusgifts_name}
        onChange={(e) => setCampusgiftsName(e.target.value)}
        className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {data ? (
        <div className="code-block h-64 overflow-y-scroll p-8">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">網站</th>
                <th className="px-4 py-2 text-left">利潤估計</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                Object.entries(data[jellycat_name]).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2">
                      {JSON.stringify(value)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ComparePrices;
