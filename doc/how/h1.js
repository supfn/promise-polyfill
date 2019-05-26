let p = new Promise((res, rej) => {
  setTimeout(res, 1e3, 1);
})
  .then(r => {
    try {
      return r + a;
    } catch (e) {
      return 100;
    }
  })
  .then(r => r + 2, e => console.log(e))
  .then(r => console.log(3, r))
  .catch(e => {
    console.log(e);
  });
