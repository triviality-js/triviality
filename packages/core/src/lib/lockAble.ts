export const lockAble = () => {
  let locked = false;
  return {
    lock() {
      locked = true;
    },
    isLocked() {
      return locked;
    },
  };
};
