import app from "./app"
import { prisma } from "./lib/prisma"
const port = process.env.Port || 6000
async function main() {
    try{
          await prisma.$connect()
          console.log("batabase sucessfully")
          app.listen(port ,()=>{
                console.log(port,"connect")
          })
    }catch(error){
        console.log(error,"server errror")
        await prisma.$disconnect();
        process.exit(1)
    }
}
main() 