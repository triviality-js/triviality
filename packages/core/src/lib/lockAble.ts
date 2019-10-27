export const lockAble = (initial: boolean = false) => {
  let locked = initial;
  return {
    lock() {
      locked = true;
    },
    isLocked() {
      return locked;
    },
  };
};
