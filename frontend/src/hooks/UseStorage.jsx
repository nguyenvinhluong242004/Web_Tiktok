// Lấy đối tượng 'user' từ sessionStorage
function GetUserStrorage() {
  const userJson = sessionStorage.getItem("user");

  if (userJson) {
    // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
    const user = JSON.parse(userJson);
    if (user) {
      return user.value;
    }
  }

  console.log("User not found in sessionStorage.");
  return null;

};

export default GetUserStrorage;