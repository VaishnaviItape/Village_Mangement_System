import Constants from "expo-constants";
import { Alert } from "react-native";
const { apiUrl, env } = Constants.expoConfig.extra;
const API_URL = apiUrl;

console.log("ENV:", env);
console.log("API_URL:", apiUrl);

export const getMyExpenses = async (token) => {
  const res = await fetch(`${API_URL}/api/Expense/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
};

export const createExpense = async (token, payload) => {
  const res = await fetch(`${API_URL}/api/Expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to create expense");
  }
  return await res.json();
};

// --- Travel Log APIs ---
export async function uploadTravelLogs(token, attendanceId, logs) {
  if (!logs?.length) return;

  const payload = logs.map((x) => ({
    attendanceId,
    latitude: x.latitude,
    longitude: x.longitude,
    recordedAt: x.recordedAt,
    speed: x.speed || 0,
  }));

  const res = await fetch(`${API_URL}/api/travellog/bulk`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to upload travel logs");
  }

  console.log(`✅ Uploaded ${payload.length} travel logs`);
  return await res.json();
}

// --- Attendance APIs ---
export async function getMyAttendance(token) {
  const res = await fetch(`${API_URL}/api/Attendance/my`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || "Failed to fetch attendance");
  return Array.isArray(data) && data.length > 0 ? data[0] : null; // shape: { date: '2025-10-28', checkInTime: '09:05', checkOutTime: '18:00' } or null
}

export async function checkInAttendance(payload, token) {
  // payload may include lat/long etc if you need
  const res = await fetch(`${API_URL}/api/Attendance/check-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload ?? {}),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || "Check-in failed");
  return data; // return API echo/timestamps if provided
}

export async function checkOutAttendance(payload, token) {
  const res = await fetch(`${API_URL}/api/Attendance/check-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload ?? {}),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || "Check-out failed");
  return data;
}

export const getMySales = async (token) => {
  const res = await fetch(`${API_URL}/api/sales/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
};

export const getProducts = async (token) => {
  const res = await fetch(`${API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
};

export const postSale = async (payload, token) => {
  const res = await fetch(`${API_URL}/api/sales/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
};

export const getMyAttendanceMonth = async (token, from, to) => {
  const query = `?from=${from.toISOString().split("T")[0]}&to=${to.toISOString().split("T")[0]}`;
  const res = await fetch(`${API_URL}/api/attendance/my${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
};

export const getMyLeaveRequests = async (token) => {
  const res = await fetch(`${API_URL}/api/LeaveRequests/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : [];
};

export const createLeaveRequest = async (token, payload) => {
  const res = await fetch(`${API_URL}/api/LeaveRequests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to create leave request");
  }
  return await res.json();
};

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data; // Successfully logged in
  } catch (error) {
    throw error; // Pass error up
  }
}
export async function getTenantsById(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Tenants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Tenants: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getTenantsById error:", error);
    throw error;
  }
}
export async function getTenants(token) {
  try {
    const response = await fetch(`${API_URL}/api/Tenants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include JWT if required
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tenants');
    }
    return data; // tenants list
  } catch (error) {
    throw error;
  }
}

export async function getTenantDetails(tenantId, token) {
  try {
    const response = await fetch(`${API_URL}/api/Tenants/tenant-details/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include JWT if required
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tenants');
    }
    return data; // tenants list
  } catch (error) {
    throw error;
  }
}

export const getDashboard = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getDashboard:", error);
    return null;
  }
};

export const getActivities = async (token) => {
  try {
    // simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const activities = [
      {
        id: "1",
        title: "Lead added",
        subtitle: "Mr. Sharma",
        time: "55 Min Ago",
        image: "https://randomuser.me/api/portraits/men/14.jpg",
      },
      {
        id: "2",
        title: "Order submitted",
        subtitle: "10 pcs",
        time: "2 Hrs Ago",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        id: "3",
        title: "Check-In At",
        subtitle: "9:05 AM",
        time: "Today",
        image: "https://randomuser.me/api/portraits/women/21.jpg",
      },
    ];

    return activities;
  } catch (error) {
    console.error("Error in getDashboard:", error);
    return null;
  }
};


export async function getAllTenants(token) {
  try {
    const response = await fetch(`${API_URL}/api/Tenants/list-with-rent-details?sortBy=FullName&ascending=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include JWT if required
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tenants');
    }
    return data; // tenants list
  } catch (error) {
    throw error;
  }
}
export async function addTenant(tenantData, token) {
  try {
    const response = await fetch(`${API_URL}/api/Tenants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tenantData),
    });

    // If response is empty, return an empty object
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to add tenant");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export async function clientSignup(clientData) {
  try {
    console.log(JSON.stringify(clientData));
    const response = await fetch(`${API_URL}/api/Auth/client_signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to signup client");
    }

    return data; // successful signup response
  } catch (error) {
    throw error;
  }
}

export async function getproperty(token) {
  try {
    const response = await fetch(`${API_URL}/api/Properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include JWT if required
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch Properties');
    }
    return data; // tenants list
  } catch (error) {
    throw error;
  }
}
export async function getUnits(token) {
  try {
    const response = await fetch(`${API_URL}/api/Units`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // include JWT if required
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch Units');
    }
    return data; // tenants list
  } catch (error) {
    throw error;
  }
}

export async function getUnitDetails(unitId, token) {
  const response = await fetch(`${API_URL}/api/Units/details/${unitId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const t = await response.text();
    throw new Error(t || `Failed to fetch unit details`);
  }
  return await response.json();
}
export async function getAgreementDetails(agreementId, token) {
  const response = await fetch(`${API_URL}/api/TenantAgreement/${agreementId}/tenantAgreement_details?onlyActive=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const t = await response.text();
    throw new Error(t || `Failed to fetch unit details`);
  }
  return await response.json();
}
export async function getDistricts(stateId) {
  try {
    const response = await fetch(`${API_URL}/api/Districts/state/${stateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch districts");
    }
    return data; // list of districts
  } catch (error) {
    throw error;
  }
}

export async function getRentInvoicesByAgreement(tenantAgreementId, token) {
  const response = await fetch(
    `${API_URL}/api/RentInvoice/by-tenant-agreement/${tenantAgreementId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to fetch invoices (status ${response.status})`);
  }

  return await response.json();
}

export async function getUnitsByPropertyId(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Units/property/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Units By Property Id: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getUnitsByPropertyId error:", error);
    throw error;
  }
}
export async function getUnitByUnitId(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Units/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Unit By unitId: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getUnitByUnitId error:", error);
    throw error;
  }
}
export async function getTenantByUnitId(unitId, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Tenants?unitId=${unitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tenant: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns tenant(s) for the given unit
  } catch (error) {
    console.error("getTenantByUnitId error:", error);
    throw error;
  }
}

// Fetch enum values by name
export async function getEnumValues(enumName) {
  try {
    const response = await fetch(`${API_URL}/api/Enum/${enumName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch enum ${enumName}`);
    }
    return data; // list of enums for that type
  } catch (error) {
    throw error;
  }
}
export async function getPropertyById(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Properties/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching property: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getPropertyById error:", error);
    throw error;
  }
}
// Example: addProperty function remains same
export async function addproperty(propertyData, token) {
  try {
    const response = await fetch(`${API_URL}/api/Properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to add property");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export async function getSubscriptionPlans() {
  try {
    console.log("Fetching Subscription plans from " + `${API_URL}/api/SubscriptionPlans`);
    const response = await fetch(`${API_URL}/api/SubscriptionPlans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch subscription plans');
    }
    return data; // list of subscription plans
  } catch (error) {
    throw error;
  }
}
export async function verifyOtp(otp, email) {
  try {
    const response = await fetch(`${API_URL}/api/Auth/VerifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp,
        email, // or "username" depending on your API
      }),
    });

    const data = await response.json();

    console.log(JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    return data; // Successful verification response
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser(token) {
  try {
    console.log('getting user details');
    const response = await fetch(`${API_URL}/api/Auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // pass token here
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user info");
    }

    return data; // { id, userName, email, fullName, roles }
  } catch (error) {
    throw error;
  }

}
export async function addUnit(unitData, token) {
  try {
    const response = await fetch(`${API_URL}/api/Units`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unitData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to add Unit");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export const updateProperty = async (propertyId, propertyData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/Properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // if your API uses Bearer token
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update property');
    }

    const data = await response.json();
    return data; // updated property data
  } catch (error) {
    console.error('updateProperty error:', error);
    throw error;
  }
};
export const updateUnit = async (unitId, propertyData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/Units/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // if your API uses Bearer token
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update Units');
    }

    const data = await response.json();
    return data; // updated property data
  } catch (error) {
    console.error('updateUnit error:', error);
    throw error;
  }
};
export async function getTenantById(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Tenants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tenant ny Id: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getTenantById error:", error);
    throw error;
  }
}
export const updateTenant = async (unitId, propertyData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/Tenants/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // if your API uses Bearer token
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update Tenants');
    }

    const data = await response.json();
    return data; // updated tenat data
  } catch (error) {
    console.error('updateTenant error:', error);
    throw error;
  }
};
export async function getUnitId(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/Units/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching property: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single unit object
  } catch (error) {
    console.error("getUnitId error:", error);
    throw error;
  }
}
export async function getExpenses(id, token) {
  try {
    const response = await fetch(`${API_URL}/api/ExpenseTransaction/unit/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Expenses");
    }
    return data; // list of districts
  } catch (error) {
    throw error;
  }
}
export async function getStates() {
  try {
    const response = await fetch(`${API_URL}/api/States`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch States");
    }
    return data; // list of states
  } catch (error) {
    throw error;
  }
}
// Create agreement for tenant
export async function addTenantAgreement(tenantId, agreementData, token) {
  try {
    const response = await fetch(`${API_URL}/api/TenantAgreement?tenantId=${tenantId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(agreementData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to add tenant agreement");
    }

    return data;
  } catch (error) {
    console.error("addTenantAgreement error:", error);
    throw error;
  }
}
export async function getTenantAgreement(tenantId, token) {
  try {
    const response = await fetch(`${API_URL}/api/TenantAgreement?tenantId=${tenantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant agreement: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getTenantAgreement error:", error);
    throw error;
  }
}



export async function addvacant(vacant, token) {
  try {
    const response = await fetch(`${API_URL}/api/Tenants/submit_vacant-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vacant),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit vacant unit request");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export const getAttachments = async (entityId, entityName, token) => {
  const response = await fetch(
    `${API_URL}/api/Attachments/${entityId}/${entityName}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attachments");
  }

  return await response.json(); // Returns array of attachment objects
};
// export const getActiveTenantAgreement = async (tenantId, token) => {
//   const response = await fetch(`${API_URL}/TenantAgreement/active/${tenantId}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   console.log("Response status:", response.status);

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Response error:", errorText);
//     throw new Error(`Failed to fetch active tenant agreement: ${response.status}`);
//   }

//   return await response.json();
// };
export async function getActiveTenantAgreement(tenantId, token) {
  try {
    const response = await fetch(`${API_URL}/api/TenantAgreement/active/${tenantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant agreement: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getTenantAgreement error:", error);
    throw error;
  }
}



export const uploadAttachment = async (imageAssets, entityId, entityType, token) => {
  try {
    const formData = new FormData();

    formData.append("EntityId", entityId);
    formData.append("EntityType", entityType);

    // 2. Append Files
    imageAssets.forEach((asset, index) => {
      // Determine the file extension (e.g., 'png' or 'jpg')
      const filename = asset.fileName || asset.uri.split('/').pop();
      const fileExtension = filename.split('.').pop().toLowerCase();

      // Construct the Mime Type (Crucial for the backend to recognize the file)
      const mimeType = asset.mimeType || (fileExtension === 'png' ? 'image/png' : 'image/jpeg');

      // The object that is appended must strictly follow this format:
      const fileToUpload = {
        // Use the original URI from ImagePicker
        uri: asset.uri,
        // The name that the file will have on the server
        name: filename,
        // The MIME type (e.g., 'image/png')
        type: mimeType,
      };

      // 'Files' is the name of the file parameter the server expects (from your curl)
      formData.append('Files', fileToUpload);
    });

    // Log formData entries for debugging (optional)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(`${API_URL}/api/Attachments/upload-files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        // Do NOT set Content-Type; fetch handles multipart/form-data automatically
        // If you are using React Native, sometimes an explicit 'Content-Type': 'multipart/form-data'
        // with the boundary can be helpful, but usually, fetch manages it.
        // For debugging, you could try adding it, but usually, it causes issues.
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText); // Log server's error response
      throw new Error(errorText || `Upload failed with status: ${response.status}`);
    }

    const result = await response.json();

    Alert.alert("Success", "Document Uploaded Successfully");
    // Call your method to refresh documents, like this.getDocuments(employeeId) in Angular
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    Alert.alert("Upload Failed", error.message || "Something went wrong");
    throw error;
  }
};

export const uploadFiles = async (files, name, mimetype, entityId, entityType, token) => {
  try {
    const formData = new FormData();

    formData.append("EntityId", entityId);
    formData.append("EntityType", entityType);
    formData.append("uri", files);
    formData.append("name", name);
    formData.append("type", mimetype);

    files.forEach((file, index) => {
      console.log(file.uri)
      console.log(file.mimeType)
      console.log(file.name)
      formData.append("Files", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file_${index}`,
      });
    });

    const response = await fetch(`${API_URL}/api/Attachments/upload-files`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // DO NOT set Content-Type manually for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Upload failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};
export const deleteAttachment = async (attachmentId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/Attachments/${attachmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete API error:", errorText);
      throw new Error(errorText || "Failed to delete attachment");
    }

    return true;
  } catch (error) {
    console.error("Delete attachment error:", error);
    throw error;
  }
};

export async function addExpense(ExpenseData, token) {
  try {
    const response = await fetch(`${API_URL}/api/ExpenseTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ExpenseData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Failed to add Expense");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export const addOrUpdateExpenseTransaction = async (formData, token) => {
  const response = await fetch(`${API_URL}/api/ExpenseTransaction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to save expense transaction");
  }

  return await response.json();
};
export async function getAgreementById(id, token) {
  try {
    const response = await fetch(`${apiUrl}/api/TenantAgreement?tenantId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // include token if required
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Tenants: ${response.status}`);
    }

    const data = await response.json();
    return data; // returns single property object
  } catch (error) {
    console.error("getTenantsById error:", error);
    throw error;
  }
}

export async function getActiveAgreement(tenantId, token) {
  try {
    const response = await fetch(`${apiUrl}/api/TenantAgreement/active/${tenantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Handle 204 No Content — return null gracefully
    if (response.status === 204) {
      console.log("No active agreement found for tenant:", tenantId);
      return null;
    }

    // Handle non-success HTTP codes
    if (!response.ok) {
      throw new Error(`Error fetching active agreement: ${response.status}`);
    }

    // Parse JSON body
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("getActiveAgreement error:", error);
    throw error;
  }
}

export async function getpayment(url, token) {
  try {
    const response = await fetch(`${apiUrl}/${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ must be valid
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching payments: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("payments error:", error);
    throw error;
  }
}
