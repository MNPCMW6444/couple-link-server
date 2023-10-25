import {connect} from "./mongo/connection"
import serverSetup from "./graphql/serverSetup"

connect(()=>serverSetup().catch((e)=>console.log(e))).catch((e)=>console.log(e));

