const roleAccess = (userRole, endpoint) => {
  const accessConfig = {
    // endpoint yang boleh diakses superadmin
    superadmin: {
      "/profile": { read: true, delete: true, update: true },
      "/": { read: true },
    },
    // endpoint yang boleh diakses admin
    admin: {
      "/profile": { read: true, update: true },
    },
    // endpoint yang boleh diakses user
    user: {
      "/profile": { read: true, update: true },
    },
  };

  // Periksa apakah pengguna memiliki akses ke endpoint
  for (const endpointPattern in accessConfig[userRole]) {
    if (endpoint.startsWith(endpointPattern)) {
      return true;
    }
  }

  return false;
};

export default roleAccess;
