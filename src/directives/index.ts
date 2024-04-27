import { App, Directive } from "vue";
import permission from "./modules/permission";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";

const directivesList: { [key: string]: Directive } = {
  permission,
  copy,
  waterMarker,
  draggable,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
