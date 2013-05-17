/*  
    A basic Media Query emulator for older browsers.
    Emulates a @media (min-width < XXX) kind of behavior.
    Adds a predefined class to the body tag so we can use it as a query selector, 
    when the window is resized to a given size.
*/
var MediaQuery = {};
(function() {
    MediaQuery = {
        win: null, // the Window object
        body: null, // the Document.Body object
        prefix: 'col', // a prefix for the classes we add to the body
        Queries: null, // The Queries object, looks like this: { query-size: prefix + query-name, query-size2: prefix + query-name2 }
        // Remove any queries from the body tag to avoid applying more than one class
        RemoveQuery: function() {
            var cls = this.body.className;
            if(cls) {
                cls = cls.split(' ');
                for(var i = 0; i < cls.length; i++) {
                    if(cls[i].match(this.prefix)) {
                        this.body.className = this.body.className.replace(cls[i], '').replace('  ', '');
                    }
                }
            }
        },
        // Add a Query to our Query List
        AddQuery: function(size, name) {
            if(this.Queries[size]) {
                throw "Query already exists.";
            }

            this.Queries[size] = this.prefix + name;
        },
        // Called on Resize event, go through all queries and apply the first match (the order is always ascending)
        ApplyQuery: function() {
            for( var query in this.Queries ) {
                if( this.win.innerWidth < query ) {
                    if( typeof this.Queries[query] !== undefined ) {
                        if( this.body.className.indexOf(this.Queries[query]) == -1 ) {
                            this.RemoveQuery();
                            this.body.className += ' ' + this.Queries[query];
                            return;
                        }
                    }
                }
                else {
                    this.RemoveQuery();
                }
            }
        },
        Begin: function() {
            // If media queries are supported, bail
            if( typeof window.matchMedia != 'undefined' ) {
                return false;
            }

            // Else, go nuts

            // Get our variables to use whithin
            this.win = window;
            this.body = document.body;
            this.Queries = {};

            // Set some defaul Media Query sizes
            var qs = [ [480, '480'], [1024, '1024'], [720, '720'] ];
            for(var i = 0; i < qs.length; i++) {
                this.AddQuery(qs[i][0], qs[i][1]);
            }

            // Add the 'resize' listener
            this.win.addEventListener('resize', function() {
                MediaQuery.ApplyQuery();
            }, false);

            // Initially apply the query if needed
            this.ApplyQuery();
        }
    };
    window.onload = function() { MediaQuery.Begin(); };
})();