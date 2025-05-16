module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    { pattern: /from-\[#[0-9a-fA-F]{6}\]/ }, // allow arbitrary `from-[#...]` colors
    { pattern: /to-\[#[0-9a-fA-F]{6}\]/ },   // allow arbitrary `to-[#...]` colors
  ],
}
