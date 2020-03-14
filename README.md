# TODO:

Pure pug files imported as js h/react.createElement trees
into component's render function

1. Read contents of pug file and put into a js wrapper
consisting of an exported tagged pug template template literal with
all of the pug content

2. Run through babel-plugin-transform-react-pug & output
a h/react.createElement tree ready to be exported

3. Filename (e.g. "template.pug") which can be imported
as "import Template from 'template.pug'"
then "render(Template.call(this))"


IDEA!!!!!!!!!!

[x] Top level scripts should be removed from the ast and
    put at the top of the compiled JS

[ ] Whenever the JSON/JS file of a css module file is imported,
    the babel script should expand the path (make it absolute)
    and inject a script tag into top level of a preact fragment

[ ] Figure out how to keep pug's querySelector language
    instead of using ugly className attribute