import { Component } from "preact";
import Template from "/header/header.pug.js"

export default class Header extends Component {

    constructor() {
        super();

        Object.assign(this, {

            state: { stateTest: true }

        });

    }

    render() { return Template.call(this); }
}