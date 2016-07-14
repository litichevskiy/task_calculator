(function(){

	var calculator = new Calculator();

    try{

        console.log( 'RESULT = ', calculator.calculateSum( '5+6+((2-2)+(8-2))' ) );

    } catch( error ) {

        console.info( error.message )

    }

})();