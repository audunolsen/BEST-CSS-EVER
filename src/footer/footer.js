import { Component } from "preact";
import Template from "./footer.pug";

export default class Footer extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    render() { return Template.call(this); }
}