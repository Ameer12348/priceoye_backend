const  bcrypt =  require("bcrypt")
 const passwordHasher = async (password, saltRounds = 10) => {
  try {
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    return hashedpassword;
  } catch (error) {
    console.log(error.bgRed);
  }
};
// password hash end

 const passwordCompare = async (password, hashpass) => {
  try {
    return bcrypt.compare(password, hashpass);
  } catch (error) {
    console.log(error.bgRed);
  }
};
// password compare end
module.exports = {passwordHasher,passwordCompare}
