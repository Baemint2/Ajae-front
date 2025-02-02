/** @type {{plugin(): {handler: () => void}; content({base}?: Content): string}} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
      flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
      flowbite.content(),
  ],
}

