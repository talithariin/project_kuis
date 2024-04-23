const generateJoinCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let joinCode = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    joinCode += characters[randomIndex];
  }

  return joinCode;
};

export default generateJoinCode;
