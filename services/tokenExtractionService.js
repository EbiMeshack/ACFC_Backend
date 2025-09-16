import jwt from "jsonwebtoken";
export const getID = (token) => {
  const result = jwt.decode(token, process.env.JWT_SECRET);
  return result.userID;
};

export const getIDExp = (token) => {
  const result = jwt.decode(token, process.env.JWT_SECRET);
  return result.exp;
};
