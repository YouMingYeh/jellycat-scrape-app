import React from "react";
import { useState } from "react";

interface CostsProps {
  data: { [key: string]: any };
  handleDataClick: () => void;
  title: string;
}

const Costs: React.FC<CostsProps> = ({ data, handleDataClick, title }) => {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{title} 成本價:</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="code-block h-64 overflow-y-scroll p-8 w-96">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">商品名稱</th>
              <th className="px-4 py-2 text-left">成本價</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              Object.entries(data).map(
                ([key, value]) =>
                  (search === "" ||
                    key.toLowerCase().includes(search.toLowerCase()) ||
                    JSON.stringify(value)
                      .toLowerCase()
                      .includes(search.toLowerCase())) && (
                    <tr key={key}>
                      <td className="border px-4 py-2">{key}</td>
                      <td className="border px-4 py-2">
                        {JSON.stringify(value)}
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleDataClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update {title} Costs
      </button>
    </div>
  );
};

export default Costs;
