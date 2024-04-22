const roleAccess = (userRole, endpoint) => {
  const accessConfig = {
    superadmin: {
      "/profile": { read: true, delete: true, update: true },
      "/classroom": { read: true, create: true, update: true, delete: true },
      "/": { read: true },
    },
    admin: {
      "/profile": { read: true, update: true },
      "/classroom": { read: true, create: true, update: true, delete: true },
    },
    user: {
      "/profile": { read: true, update: true },
      "/classroom": { read: true },
    },
  };

  for (const endpointPattern in accessConfig[userRole]) {
    if (endpoint.startsWith(endpointPattern)) {
      return true;
    }
  }
  return false;
};

export default roleAccess;
