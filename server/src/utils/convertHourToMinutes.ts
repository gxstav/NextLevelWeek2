export default function convertHourToMinutes(time: string){
  const [hour, minute] = time.split(':').map(Number)
  return (hour * 60 + minute)
}

// export default (time: string) => time.split(':').map((num, i) => i == 0 ? Number(num) * 60 : Number(num)).reduce((a, b) => a + b)

// export default function convertHourToMinutes(time: string){
//   return  time.split(':').map((num, i) => i == 0 ? Number(num) * 60 : Number(num)).reduce((a, b) => a + b)
// }


