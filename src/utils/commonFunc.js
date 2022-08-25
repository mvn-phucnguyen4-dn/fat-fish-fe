const COLORS = [
  'red',
  'magenta',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]
const ranColor = () => {
  const ranIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[ranIndex]
}
const changeDate = (date) => {
  const ts = new Date(date)
  return ts.toLocaleString()
}
export { ranColor, changeDate }
