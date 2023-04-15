export const getRGBColor = (hex: string, type: string) => {
   let color = hex.replace(/#/g, '')
   // rgb values
   var r = parseInt(color.slice(0, 2), 16)
   var g = parseInt(color.slice(2, 4), 16)
   var b = parseInt(color.slice(4, 6), 16)

   return `--color-${type}: rgb(${r}, ${g}, ${b});`
}
