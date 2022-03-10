export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`;

    if (binding.arg === "full") iconClass = binding.value;

    if (binding.modifiers.right) iconClass = `${iconClass} float-right`;

    if (binding.modifiers.yellow) iconClass = `${iconClass} text-yellow-400`;
    else iconClass = `${iconClass} text-green-400`;

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
