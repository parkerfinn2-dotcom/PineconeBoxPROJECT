// 清除localStorage中的isLoggedIn值，解决登录页面不显示的问题
localStorage.removeItem('isLoggedIn');
localStorage.removeItem('username');
console.log('LocalStorage cleared successfully!');
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
console.log('username:', localStorage.getItem('username'));
