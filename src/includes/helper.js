export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    // const seconds = Math.round(time - minutes * 60 || 0); // trainer solution
    const seconds = Math.round(time % 60) || 0; // my solution

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  },
};
