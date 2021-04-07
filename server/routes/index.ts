import Transaction from "./transaction"
import User from "./user"

 const Routes = (app: any) => {
   User(app)
   Transaction(app)
 }

 export default Routes