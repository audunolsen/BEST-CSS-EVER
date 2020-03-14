import { Component } from "preact";
import Template from "/header/header.pug"

export default class Header extends Component {

    constructor() {
        super();

        Object.assign(this, {

            state: { show: true }

        });

    }

    render() { return Template.call(this); }

}