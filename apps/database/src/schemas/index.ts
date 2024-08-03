import * as relations from "./relations";
import * as tables from "./tables";

const schema = {
	...tables,
	...relations,
};

export { tables };
export default schema;
