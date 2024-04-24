const roleAccess = (userRole, endpoint, method, userId) => {
  const accessRules = {
    superadmin: {
      "/profile/": ["GET", "POST", "PUT", "DELETE"],
      "/classroom/": ["GET", "POST", "PUT", "DELETE"],
      "/": ["GET", "POST", "PUT", "DELETE"],
      "/quiz/": ["GET", "POST", "PUT", "DELETE"],
    },
    admin: {
      "/profile/": ["GET", "PUT", "DELETE"],
      "/classroom/": ["GET"],
      "/": ["GET"],
      "/quiz/": ["GET"],
    },
    user: {
      "/profile/": ["GET", "PUT", "DELETE"],
      "/classroom/": ["GET", "POST", "PUT"],
      "/": ["GET"],
      "/quiz/": ["GET", "POST"],
    },
  };

  // Step 1: Pengecekan userRole
  if (!accessRules[userRole]) {
    console.log(`Role nya salah woy ${userRole}`);
    return false;
  }

  // Step 2: Pengecekan endpoint
  let validEndpoint = false;
  let endpointRules = [];
  Object.keys(accessRules[userRole]).forEach((key) => {
    if (endpoint.startsWith(key)) {
      validEndpoint = true;
      endpointRules = accessRules[userRole][key];
    }
  });
  if (!validEndpoint) {
    console.log(`Endpoint nya salah woy ${endpoint}`);
    return false;
  }

  if (endpoint.includes("/:")) {
    const requestedUserId = parseInt(endpoint.split("/")[2]);
    if (requestedUserId !== userId) {
      console.log(`Disini salahnya`);
      return false;
    }
  }

  // Step 3: Pengecekan method
  if (!endpointRules.includes(method)) {
    console.log(method);
    console.log(endpointRules);
    console.log("Method nya salah woy");
    return false;
  }

  return true;
};

export default roleAccess;
