import React, { useState } from "react";

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(event.target.value);
  };

  const handleCalculateClick = () => {
    try {
      const calculatedResult = eval(expression);
      setResult(calculatedResult);
    } catch (error) {
      setResult(null);
    }
  };

  const handleClearClick = () => {
    setExpression("");
    setResult(null);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`bg-gray-200 p-8 rounded-lg shadow-lg fixed bottom-8 right-8 ${
        isHovered ? "opacity-100" : "opacity-30"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex flex-col items-center `}>
        <h2 className="text-2xl font-bold mb-4 ">Calculator</h2>
        <div className="mb-4">
          <input
            type="text"
            value={expression}
            onChange={handleInputChange}
            className={`border border-gray-300 rounded px-2 py-1 `}
          />
        </div>
        <div className="mb-4">
          <button
            onClick={handleCalculateClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Calculate
          </button>
          <button
            onClick={handleClearClick}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Clear
          </button>
        </div>
        {result !== null && (
          <div className="text-xl font-bold">Result: {result}</div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
