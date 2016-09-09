(function(){

	var moduleCalculator = new Calculator(),
        calculator = $('.container_calc'),
        input = $('.field_for_text'),
        result;


    try{

        console.log( 'RESULT = ', moduleCalculator.calculateSum( '5+6+((2-2)+(8-2))' ) );

    } catch( error ) {

        console.info( error.message )

    }

    $(calculator).click(function(event) {

        if ( !moduleCalculator ) {
            throw new Error('calculator required module calculator !');
        }

        var targetValue = event.target.dataset.val;

        if( !targetValue ) return;

            if( targetValue === 'clear' ) {
                $(input).val('');
                $(input).focus();
            } else
                if ( targetValue === '=' ) {
                     try{
                        result = moduleCalculator.calculateSum( $(input).val() );
                        $(input).val( result['result'] );
                    } catch( error ) {
                        console.info( error.message )
                    }
                } else  $(input).val( $(input).val() + targetValue );
    });

})();