
export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getApiToken()}`,
      }
    });
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

export const postRequests = async (url: string, body?: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiToken()}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const deleteRequest = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getApiToken()}`,
      }
      });
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export const getApiToken = (): string | null => {
  return localStorage.getItem('apiToken');
};