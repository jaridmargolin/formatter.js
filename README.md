formatter.js [![Build Status](https://travis-ci.org/firstopinion/formatter.js.png)](https://travis-ci.org/firstopinion/formatter.js)
============

       ___                    __  __              _   
      / _/__  ______ _  ___ _/ /_/ /____ ____    (_)__
     / _/ _ \/ __/  ' \/ _ `/ __/ __/ -_) __/   / (_-<
    /_/ \___/_/ /_/_/_/\_,_/\__/\__/\__/_/ (_)_/ /___/
                                            |___/     
                                            
Format user input to match a specified pattern



Demos/Examples
--------------

[view demo](http://firstopinion.github.io/formatter.js/demos.html)



Why?
----

Sometimes it is useful to format user input as they type. Existing libraries lacked proper functionality / flexibility. Formatter was built from the ground up with no dependencies. There is however a jquery wrapper version for quick use.



On Bower
--------

    bower install formatter



Usage
-----

### Vanilla Javascript

* **uncompressed**: formatter.js
* **compressed**: formatter.min.js

#### new Formatter(el, opts)

    var formatted = new Formatter(document.getElementById('credit-input'), {
      'pattern': '{{999}}-{{999}}-{{999}}-{{9999}}',
      'persistent': true
    });


### Jquery

* **uncompressed**: jquery.formatter.js
* **compressed**: jquery.formatter.min.js

#### $(selector).formatter(opts)

    $('#credit-input').formatter({
      'pattern': '{{999}}-{{999}}-{{999}}-{{9999}}',
      'persistent': true
    });



Opts
----

* **pattern** (required): String representing the pattern of your formatted input. User input areas begin with `{{` and end with `}}`. For example, a phone number may be represented: `({{999}}) {{999}}-{{999}}`. You can specify numbers, letters, or numbers and letters.
  * 9: [0-9]
  * a: [A-Za-z]
  * \*: [A-Za-z0-9] 
* **persistent**: \[False\] Boolean representing if the formatted characters are always visible (persistent), or if they appear as you type.
* **patterns** (optional, replaces *pattern*): Array representing a priority ordered set of patterns that may apply dynamically based on the current input value. Each value in the array is an object, whose key is a regular expression string and value is a *pattern* (see above). The regular expression is tested against the unformatted input value. You may use the special key `'*'` to catch all input values.
```
[
  { '^\d{5}$': 'zip: {{99999}}' },
  { '^.{6,8}$: 'postal code: {{********}}' },
  { '*': 'unknown: {{**********}}' }
]
```



Class Methods
-------------

#### addInptType(char, regexp)

Add regular expressions for different input types.

**Vanilla Javascript**

    Formatter.addInptType('L', /[A-Z]/);

**Jquery**

    $.fn.formatter.addInptType('L', /[A-Z]/);



Instance Methods
----------------

#### resetPattern(pattern)

Fairly self explanatory here :) reset the pattern on an existing Formatter instance.

**Vanilla Javascript**

(assuming you already created a new instance and saved it to the var `formatted`)

    formatted.resetPattern('{{999}}.{{999}}.{{9999}}');

**Jquery**

(assuming you already initiated formatter on `#selector`)

    $('#selector').formatter().resetPattern();



Tests
-----

Install Dependencies:
    
    npm install

Run Tests:
    
    npm test



License
-------

The MIT License (MIT) Copyright (c) 2013 First Opinion

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
