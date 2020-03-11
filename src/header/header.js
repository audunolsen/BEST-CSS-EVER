import * as Preact from "preact";
import Template from "./header.pug.js"

export default class Header extends Preact.Component {

    constructor() {
        super();
        this.state = {

        };
    }

    render() { return Template; }
}