
export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text(); // Log error response text
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const postRequests = async (url: string, body: any) => {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};