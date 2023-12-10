const BASE_URL = "http://20.239.231.243:5000";

export const updateRate = async () => {
  const response = await fetch(`${BASE_URL}/update_rate`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getJellycat = async () => {
  const response = await fetch(`${BASE_URL}/get_jellycat`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getSelfridge = async () => {
  const response = await fetch(`${BASE_URL}/get_selfridge`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getCampusgifts = async () => {
  const response = await fetch(`${BASE_URL}/get_campusgifts`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const getAll = async () => {
  const response = await fetch(`${BASE_URL}/get_all`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const scrape = async () => {
  const response = await fetch(`${BASE_URL}/scrape`, {
    method: "POST",
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

export const compare_prices_with_names = async (jellycat_name: string, selfridge_name: string, campusgifts_name: string) => {
  const response = await fetch(
    `${BASE_URL}/compare_prices_with_names?jellycat_name=${jellycat_name}&selfridge_name=${selfridge_name}&campusgifts_name=${campusgifts_name}`,
    {
      method: "GET",
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
