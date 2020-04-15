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


### PUG

[x] Implement compiler which transforms



Sacrifices:
- In order for includes to work, the pug source code must be parsed
  and so that pug.link can run through the source ast. React-pug only
  accepts pug source code which means that the ast needs to be transformed
  back into pug code. This is done through the package "pug-source-gen": "0.0.2"
  which isn't actively maintained and which does not always play well with
  react-pug.
  
  - Object spread for element attributes doesn't work
  - source-gen always outputs unescaped values regardless of the ast.
    React pug doesn't account for escaping thus some regexes need to
    be employed to fix this. E.g. `!{var} => #{var}` or `int!=1 => int=1`
  
  - React-pug still has many missing features, most notably
    - `div&attributes(obj)` spread/explosions
    
  


<!-- [x] 

[x] Top level scripts should be removed from the ast and
    put at the top of the compiled JS

Pure pug files imported as js h/react.createElement trees
into component's render function -->


### SASS

[x] implement dart-sass compile-script which also runs code
    through postcss with minification and postcss-modules plugins.

[x] targets all files by defualt unless it's an import which is specified
    by an underscore `_patial.sass`. Output files should be same path
    except base folder and ext
    
    ```
    # in
    src/sub-dir/file.sass => 
    # out
    dist/sub-dir/file.css
    dist/sub-dir/file.css.map (sourcemap — not in prod)
    dist/sub-dir/file.sass.json (css-modules mappings)
    ```

[x] JS-component files should use css-module imports
    which should look like a faux sass import.
    
    `import "./styles.sass" => import "./styles.sass.js"`

[x] the css-module imports (`./module-name.sass.js`) which is
    a js export of classname mappings from a css-module transpilation
    should be a transformed from a side-effects-only import
    to an object with a unique id.
    
    `import "./styles.sass.js" => import styles_123vc from ".styles.sass.js"`
    
[ ] JSX className attributes should be expanded from strings to
    arrays where each class name is a key on the css-module
    import. Fallback should be just using key as a string
        
    `"foo bar" => [styles_123vc["foo"] || "foo", styles_123vc["foo"] || "bar"]`
        
[ ] if a css-module object is imported then the JSX should output
    a top level fragment where the first entry is a link tag referencing the
    corresponding css file
    
End goal: use the newest dart-sass features & allow css-modoule
use without sacrificing pug's sleek querySelector-like markup:

`❤️ p.foo-bar | 💔 p(className=styleImport.fooBar)`.

Eliminate need to write link-tags through babel injecting said tag
if css-module mappings object is imported.