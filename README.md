formatter.js [![Build Status](https://travis-ci.org/firstopinion/formatter.js.png)](https://travis-ci.org/firstopinion/formatter.js)
============

       ___                    __  __              _   
      / _/__  ______ _  ___ _/ /_/ /____ ____    (_)__
     / _/ _ \/ __/  ' \/ _ `/ __/ __/ -_) __/   / (_-<
    /_/ \___/_/ /_/_/_/\_,_/\__/\__/\__/_/ (_)_/ /___/
                                            |___/     
                                            
Format user input to match a specified pattern


Why?
----

Sometimes it is useful to format user input as they type. Existing libraries lacked flexibility. Also note that Formatter does not depend on jQuery or any existing libraries.


On Bower
--------

    bower install formatter


Usage
-----

**Include script tag:**

    <script src="bower_components/formatter/formatter.js">  
    

### new Formatter(el, opts)

    new Formatter(document.getElementById('credit-input'), {
        'str': '{{XXXX}}-{{XXXX}}-{{XXXX}}-{{XXXX}}'
    });


* **el** (required): Input element to manipulate
* **opts** (required): An object holding instance specific options.
  * **pattern** (required): String representing the pattern of your formatted input. User input areas begin with `{{` and end with `}}`. For example, a phone number may be represented: `({{XXX}}) {{XXX}}-{{XXXX}}`
  * **persistent** (false): Boolean value representing whether the formatted characters are shown or added as the user types
  * **repeat** (false): Boolean value representing whether the supplied pattern will be repeated.


Examples / Demos
----------------

view live demos

**Credit Card**: 4242-4242-4242-4242

    new Formatter(document.getElementById('credit-input'), {
        'str': '{{XXXX}}-{{XXXX}}-{{XXXX}}-{{XXXX}}'
    });

**Phone Number**: (802) 415-3411

    new Formatter(document.getElementById('phone-input'), {
        'str': '({{XXX}}) {{XXX}}-{{XXXX}}'
    });

**Number**: 100,000,000,000

    new Formatter(document.getElementById('num-input'), {
        'str': '{{XXX}},',
        'repeat': true
    });

Tests
-----

Install Dependencies:
    
    npm install

Run Tests:
    
    npm test


  gem install travis
  cd my_project
  travis encrypt MY_SECRET_ENV=super_secret

  TRAVIS_SECURE_ENV_VARS


License
-------

The MIT License (MIT) Copyright (c) 2013 First Opinion

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.