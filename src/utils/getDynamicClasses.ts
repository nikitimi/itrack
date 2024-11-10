export default function getDynamicClasses(condition: boolean) {
  return `${condition ? 'bg-black text-white' : ''} hover:bg-itrack-primary hover:text-white`;
}
