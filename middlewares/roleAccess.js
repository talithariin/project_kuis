const roleAccess = (userRole, endpoint, method, userId) => {
  const accessRules = {
    superadmin: {
      "*": ["GET", "POST", "PUT", "DELETE"],
      "/": ["GET"],
    },
    admin: {
      // Admin bisa melakukan method update & delete ke endpoint "/profile"
      "/profile/": ["GET", "PUT", "DELETE"],
      "/classroom/": ["GET"],
    },
    user: {
      "/profile/": ["GET", "PUT", "DELETE"],
      "/classroom/": ["GET"],
    },
  };

  // cek role
  const userAccess = accessRules[userRole];
  if (!userAccess) return false;

  // cek endpoint
  const endpointAccess = userAccess[endpoint];
  if (!endpointAccess) return false;

  // cek method
  if (!endpointAccess.includes(method)) return false;

  // cek apakah user mengubah data profile orang lain
  if (
    endpoint.startsWith("/profile/") &&
    (method === "PUT" || method === "DELETE")
  ) {
    const requestedUserId = parseInt(endpoint.split("/")[1]); // Mengambil id dari endpoint
    if (userRole !== "superadmin" && requestedUserId !== userId) {
      return false;
    }
  }

  return true;
};

export default roleAccess;

// const roleAccess = (userRole, endpoint) => {
//   const accessConfig = {
//     superadmin: {
//       "/profile": { read: true, delete: true, update: true },
//       "/classroom": { read: true, create: true, update: true, delete: true },
//       "/": { read: true },
//     },
//     admin: {
//       "/profile": { read: true, update: true },
//       "/classroom": { read: true },
//     },
//     user: {
//       "/profile": { read: true, update: true },
//       "/classroom": { read: true },
//     },
//   };

//   for (const endpointPattern in accessConfig[userRole]) {
//     if (endpoint.startsWith(endpointPattern)) {
//       return true;
//     }
//   }
//   return false;
// };

// export default roleAccess;
