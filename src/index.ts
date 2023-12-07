import {connect} from "./mongo/connection"
import serverSetup from "./graphql/serverSetup"

connect().then(() => serverSetup().catch((e) => console.log(e)))

