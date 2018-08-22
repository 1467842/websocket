/**
 * Only when the param name is object[0].field, spring will treat it as a class's field.
 *
 * So my solution is write a new param plugin for jquery. 
 * Actual I just copy from "jquery.js", and change the code.
 * 
 * Finally use {@code $.customParam} instead of {@code $.param} when send an ajax request.
 * 
 * % zhangbr  
 * % 2017.4.21  
 */
(function($) {
  // copy from jquery.js
  var r20 = /%20/g,
    rbracket = /\[\]$/;

  $.extend({
    customParam: function( a ) {
      var s = [],
        add = function( key, value ) {
          // zhangbr 17.10.27
    	  // start update#000
    	  // If value is a function, invoke it and return its value
          value = jQuery.isFunction( value ) ? value() : value;
    	  if((value !== null) && (value !== undefined) && (value !== '')) {
    		  s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    	  }
    	  // end update#000
        };

      // If an array was passed in, assume that it is an array of form elements.
      if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
        
        // Serialize the form elements
        jQuery.each( a, function() {
          add( this.name, this.value );
        });
      } else {

        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for ( var prefix in a ) {
          buildParams( prefix, a[ prefix ], add );
        }
      }
      
      // Return the resulting serialization
      return s.join( "&" ).replace( r20, "+" );
    }
  });

  /* private method*/
  function buildParams( prefix, obj, add ) {
    if ( jQuery.isArray( obj ) ) {
      
      // Serialize array item.
      jQuery.each( obj, function( i, v ) {
        if (rbracket.test( prefix ) ) {
          
          // Treat each array item as a scalar.
          add( prefix, v );
        } else {
          
          // buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, add );
          buildParams( prefix + "[" + i + "]", v, add );
        }
      });

    } else if (obj != null && typeof obj === "object" ) {
      
      // Serialize object item.
      for ( var name in obj ) {
        // buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        buildParams( prefix + "." + name, obj[ name ], add );
      }
    } else {
      
      // Serialize scalar item.
      add( prefix, obj );
    }
  };
})(jQuery);