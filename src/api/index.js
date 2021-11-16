import { CALL_FROM_API } from "./config";
import * as mock from "./mockServer";
import * as api from "./query";

// Define data source
const Service = CALL_FROM_API ? api : mock;

export default Service;
