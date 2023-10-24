import {connect} from "./mongo/connection"
import serverSetup from "./graphql/serverSetup"

connect().catch((e)=>console.log(e));
serverSetup().catch((e)=>console.log(e));