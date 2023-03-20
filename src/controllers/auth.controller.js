export const renderSignUp = (req, res) => {
  res.render("auth/signup");
};

export const renderSignIn = (req, res, next) => {
  res.render("auth/signin");
};