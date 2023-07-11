import type { App } from "vue";
import { imagePerview } from "./imagePerview";

const components: any[] = [imagePerview];
const install = (app: App) => {
  components.forEach(item => app.component((item._name, item)));
};
export { imagePerview };
export default {
  install,
};
