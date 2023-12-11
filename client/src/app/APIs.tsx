const BASE_URL = "https://jellycat-scrape.azurewebsites.net";

export const updateRate = async () => {
  const response = await fetch(`${BASE_URL}/update_rate`, {
    method: "GET",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getJellycat = async () => {
  const response = await fetch(`${BASE_URL}/get_jellycat`, {
    method: "GET",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getSelfridge = async () => {
  const response = await fetch(`${BASE_URL}/get_selfridge`, {
    method: "GET",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getCampusgifts = async () => {
  const response = await fetch(`${BASE_URL}/get_campusgifts`, {
    method: "GET",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getAll = async () => {
  const response = await fetch(`${BASE_URL}/get_all`, {
    method: "GET",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const scrape = async () => {
  const response = await fetch(`${BASE_URL}/scrape`, {
    method: "POST",
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const scrapeSpecific = async (website: string) => {
  const response = await fetch(`${BASE_URL}/scrape_specific`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ website }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getPrice = async () => {
  const response = await fetch(`${BASE_URL}/get_price`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const comparePrices = async (name: string) => {
  const response = await fetch(`${BASE_URL}/compare_prices?name=${name}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const compare_prices_with_names = async (
  jellycat_name: string,
  selfridge_name: string,
  campusgifts_name: string
) => {
  const response = await fetch(
    `${BASE_URL}/compare_prices_with_names?jellycat_name=${jellycat_name}&selfridge_name=${selfridge_name}&campusgifts_name=${campusgifts_name}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};
