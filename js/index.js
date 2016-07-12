(function(){

	var calculator = new Calculator();

    try{

        console.log( 'RESULT = ', calculator.calculateAmount( '(45-8/7)' ) );

    } catch( error ) {

        console.info( error.message )

    }

})();